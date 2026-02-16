const { google } = require("googleapis");
const cron = require("node-cron");
const ingestComplaint = require("./ingestion.service");

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oAuth2Client,
});

async function fetchUnreadEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });

    if (!res.data.messages) return;

    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const headers = msg.data.payload.headers;

      const subject = headers.find(
        (h) => h.name === "Subject"
      )?.value;

      const body =
        msg.data.payload.parts?.[0]?.body?.data || "";

      const decodedBody = Buffer.from(
        body,
        "base64"
      ).toString("utf-8");

      await ingestComplaint({
        title: subject || "Email Complaint",
        description: decodedBody,
        source: "email",
      });

      // Mark email as read
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
