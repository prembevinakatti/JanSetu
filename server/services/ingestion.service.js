const axios = require("axios");
const EmailComplaint = require("../models/emailComplaint.model");

async function ingestComplaint(data) {
  try {
    // 🔥 Call Python AI Service
    const aiResponse = await axios.post(
      "http://localhost:8001/analyze",
      {
        description: data.description,
        latitude: 0,     // temporary default
        longitude: 0,    // temporary default
      }
    );

    const aiData = aiResponse.data;

    // ✅ Update EmailComplaint with AI Results
    const updated = await EmailComplaint.findByIdAndUpdate(
      data.emailId,   // IMPORTANT: pass email document ID
      {
        isCivic: aiData.category !== "Other",
        aiCategory: aiData.category,
        aiSentiment: aiData.sentiment,
        aiPriorityScore: aiData.priorityScore,
        aiPriorityLevel: aiData.priorityLevel,
        aiClusterId: aiData.clusterId,
        isEmergency: aiData.isEmergency,
        isProcessed: true,
      },
      { new: true }
    );

    console.log("Email AI Updated:", updated._id);

  } catch (error) {
    console.error("Ingestion Error FULL:", error.response?.data || error.message);
  }
}

module.exports = ingestComplaint;
