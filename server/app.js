const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const authRoute = require("./routes/auth.route");
const officerRoute = require("./routes/officer.route");
const issueRoute = require("./routes/issue.route");
const adminRoute = require("./routes/admin.route");
const issueHistoryRoute = require("./routes/issueHistory.route");
const analyticsRoute = require("./routes/analytics.route");
const googleAuthRoute = require("./routes/googleAuth.routes");
const emailComplaintRoute = require("./routes/emailComplaint.route");
const connectDB = require("./config/database");
const fetchUnreadEmails = require("./services/email.service");
const uploadRoute = require("./routes/uploadComplaints.route");

const app = express();

// fetchUnreadEmails();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/janSetu/auth", authRoute);
app.use("/api/v1/janSetu/officers", officerRoute);
app.use("/api/v1/janSetu/issues", issueRoute);
app.use("/api/v1/janSetu/admin", adminRoute);
app.use("/api/v1/janSetu/history", issueHistoryRoute);
app.use("/api/v1/janSetu/analytics", analyticsRoute);
app.use("/api/v1/janSetu/emailComplaints", emailComplaintRoute);
app.use("/", googleAuthRoute);
app.use("/api", uploadRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
