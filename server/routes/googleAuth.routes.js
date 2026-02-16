const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// STEP 1: Redirect to Google Login
router.get("/auth/google", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline", // VERY IMPORTANT
    prompt: "consent",      // VERY IMPORTANT
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });

  res.redirect(url);
});

// STEP 2: Handle Callback
router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oAuth2Client.getToken(code);

    console.log("REFRESH TOKEN:", tokens.refresh_token);

    res.send(`
      <h2>Google Auth Successful ✅</h2>
      <p>Copy this Refresh Token and paste in your .env file:</p>
      <pre>${tokens.refresh_token}</pre>
    `);

  } catch (error) {
    console.error("OAuth Error:", error.message);
    res.send("Authentication failed");
  }
});

module.exports = router;
