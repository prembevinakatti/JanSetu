const axios = require("axios");
const EmailComplaint = require("../models/emailComplaint.model");

/* ================= CIVIC ISSUE FILTER ================= */

function isCivicIssue(text) {
  if (!text) return false;

  const keywords = [
    "pothole",
    "garbage",
    "waste",
    "sewage",
    "streetlight",
    "street light",
    "water leakage",
    "drain",
    "drainage",
    "road damage",
    "broken road",
    "traffic signal",
    "sanitation",
    "water supply",
    "mosquito",
    "dirty",
    "flood",
    "overflow",
  ];

  const lower = text.toLowerCase();

  return keywords.some((k) => lower.includes(k));
}

/* ================= INGEST COMPLAINT ================= */

async function ingestComplaint(data) {
  try {

    if (!data.description || !data.emailId) {
      console.log("Invalid ingestion data");
      return;
    }

    /* ---------- CIVIC FILTER ---------- */

    if (!isCivicIssue(data.description)) {

      console.log("Skipping non-civic email");

      await EmailComplaint.findByIdAndUpdate(
        data.emailId,
        {
          isProcessed: true,
          isCivic: false
        }
      );

      return;
    }

    console.log("Processing civic complaint...");

    /* ---------- CALL AI SERVICE ---------- */

    const aiResponse = await axios.post(
      "http://localhost:8000/analyze",
      {
        description: data.description,
        latitude: 0,
        longitude: 0,
      }
    );

    const aiData = aiResponse.data;

    if (!aiData || !aiData.category) {
      console.log("Invalid AI response");
      return;
    }

    /* ---------- UPDATE DATABASE ---------- */

    const updated = await EmailComplaint.findByIdAndUpdate(
      data.emailId,
      {
        isCivic: aiData.category !== "General",
        aiCategory: aiData.category,
        aiTags: aiData.tags || [],
        aiSentiment: aiData.sentiment || {},
        aiPriorityScore: aiData.priorityScore || 0,
        aiPriorityLevel: aiData.priorityLevel || "Low",
        aiClusterId: aiData.clusterId,
        isEmergency: aiData.isEmergency || false,
        isProcessed: true,
      },
      { new: true }
    );

    if (updated) {
      console.log("Email AI Updated:", updated._id);
    }

  } catch (error) {

    console.error("Ingestion Error:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

  }
}

module.exports = ingestComplaint;