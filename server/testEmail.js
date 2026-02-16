const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

async function fetchEmails() {
  const gmail = google.gmail({
    version: "v1",
    auth: oAuth2Client,
  });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
    q: "is:unread",
  });

  if (!res.data.messages) {
    console.log("No unread emails");
    return;
  }

  for (const message of res.data.messages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
    });

    const headers = msg.data.payload.headers;

    const subject = headers.find(
      (h) => h.name === "Subject"
    )?.value;

    let body = "";

    if (msg.data.payload.parts) {
      const part = msg.data.payload.parts.find(
        (p) => p.mimeType === "text/plain"
      );

      if (part) {
        body = Buffer.from(
          part.body.data,
          "base64"
        ).toString("utf-8");
      }
    }

    console.log("----- EMAIL -----");
    console.log("Subject:", subject);
    console.log("Body:", body);
  }
}

fetchEmails();
