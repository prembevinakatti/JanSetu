const { google } = require("googleapis");
const cron = require("node-cron");
const { convert } = require("html-to-text");
const EmailComplaint = require("../models/emailComplaint.model");
const ingestComplaint = require("./ingestion.service");

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

/* ================= GOOGLE AUTH ================= */

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

function isCivicIssue(text) {
  const keywords = [
    "pothole",
    "garbage",
    "waste",
    "streetlight",
    "water leakage",
    "sewage",
    "drainage",
    "road damage",
    "traffic signal",
    "broken road",
    "sanitation",
    "noise complaint",
    "water supply",
  ];

  const lowerText = text.toLowerCase();

  return keywords.some((keyword) => lowerText.includes(keyword));
}

/* ================= CLEAN BODY ================= */

function extractBody(payload) {
  if (!payload) return "";

  const decode = (data) =>
    Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "utf-8",
    );

  let body = "";

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        body = decode(part.body.data);
        break;
      }

      if (part.mimeType === "text/html" && part.body?.data) {
        const html = decode(part.body.data);
        body = convert(html, { wordwrap: false });
        break;
      }
    }
  } else if (payload.body?.data) {
    body = decode(payload.body.data);
  }

  return body.trim();
}

/* ================= FETCH EMAILS ================= */

async function fetchUnreadEmails() {
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5,
      q: `
        is:unread
        newer_than:1d
        category:primary
        -category:promotions
        -category:social
      `,
    });

    const messages = response.data.messages;

    if (!messages || messages.length === 0) {
      console.log("No new emails found.");
      return;
    }

    for (const message of messages) {
      try {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        const headers = msg.data.payload.headers;

        const subject = headers.find((h) => h.name === "Subject")?.value || "";

        const from = headers.find((h) => h.name === "From")?.value || "";

        const cleanBody = extractBody(msg.data.payload);

        console.log("Processing Email:", subject);

        // ✅ Save raw email
        const combinedText = subject + " " + cleanBody;

        // 🚫 Ignore non-civic emails
        if (!isCivicIssue(combinedText)) {
          console.log("Skipping non-civic email:", subject);
          return;
        }

        console.log("Processing Civic Complaint:", subject);

        // ✅ Save raw email
        const emailDoc = await EmailComplaint.create({
          subject,
          body: cleanBody,
          from,
          source: "email",
          isProcessed: false,
        });

        // ✅ Send to AI
        await ingestComplaint({
          emailId: emailDoc._id,
          description: combinedText,
        });

        // ✅ Mark email as read
        await gmail.users.messages.modify({
          userId: "me",
          id: message.id,
          requestBody: { removeLabelIds: ["UNREAD"] },
        });
      } catch (innerError) {
        console.error("Single Email Error:", innerError.message);
      }
    }
  } catch (error) {
    console.error("Email Fetch Error:", error.message);
  }
}

/* ================= CRON ================= */

cron.schedule("* * * * *", () => {
  console.log("Checking emails...");
  fetchUnreadEmails();
});

module.exports = fetchUnreadEmails;
