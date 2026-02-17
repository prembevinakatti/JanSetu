const { google } = require("googleapis");
const cron = require("node-cron");
const axios = require("axios");
const { convert } = require("html-to-text");
const ingestComplaint = require("./ingestion.service");

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oAuth2Client,
});

// ✅ Extract clean text
function extractBody(payload) {
  if (!payload) return "";

  let rawBody = "";

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        rawBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        break;
      }

      if (part.mimeType === "text/html" && part.body?.data) {
        const html = Buffer.from(part.body.data, "base64").toString("utf-8");

        rawBody = convert(html, {
          wordwrap: false,
        });
        break;
      }
    }
  } else if (payload.body?.data) {
    rawBody = Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  return rawBody;
}

async function fetchUnreadEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5, // fetch small batch
      q: 'is:unread newer_than:1d category:primary -category:promotions -category:social (pothole OR garbage OR drainage OR "water leakage" OR streetlight OR "traffic signal" OR "road damage")',
    });

    if (!res.data.messages || res.data.messages.length === 0) {
      console.log("No civic emails found in last 24 hours.");
      return;
    }

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const headers = msg.data.payload.headers;

      const subject = headers.find((h) => h.name === "Subject")?.value || "";

      const cleanBody = extractBody(msg.data.payload);

      const combinedText = (subject + " " + cleanBody).toLowerCase();

      // 🔥 Strict Civic Keyword Validation
      const civicKeywords = [
        "pothole",
        "garbage",
        "drainage",
        "streetlight",
        "water leakage",
        "traffic signal",
        "road damage",
        "road crack",
        "sewage",
        "overflow",
      ];

      const isCivic = civicKeywords.some((keyword) =>
        combinedText.includes(keyword),
      );

      if (!isCivic) {
        console.log("Skipped (Not Civic):", subject);

        // mark as read to avoid rechecking
        await gmail.users.messages.modify({
          userId: "me",
          id: message.id,
          requestBody: {
            removeLabelIds: ["UNREAD"],
          },
        });

        continue;
      }

      console.log("Processing Civic Email:", subject);

      await ingestComplaint({
        title: subject || "Email Complaint",
        description: cleanBody,
        source: "email",
      });

      // mark as read
      await gmail.users.messages.modify({
        userId: "me",
        id: message.id,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      });
    }
  } catch (error) {
    console.error("Email Fetch Error:", error.message);
  }
}

// Run every 1 minute
cron.schedule("* * * * *", () => {
  console.log("Checking emails...");
  fetchUnreadEmails();
});

module.exports = fetchUnreadEmails;
