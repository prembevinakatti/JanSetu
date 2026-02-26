const axios = require("axios");
const EmailComplaint = require("../models/emailComplaint.model");

async function ingestComplaint(data) {
  try {
    if (!data.description || !data.emailId) {
      console.log("Invalid ingestion data");
      return;
    }

    const aiResponse = await axios.post(
      "http://localhost:8000/analyze",
      {
        description: data.description,
        latitude: 0,
        longitude: 0,
      }
    );

    const aiData = aiResponse.data;

    if (!aiData) {
      console.log("Empty AI response");
      return;
    }

    const updated = await EmailComplaint.findByIdAndUpdate(
      data.emailId,
      {
        isCivic: aiData.category !== "General",
        aiCategory: aiData.category,
        aiSentiment: aiData.sentiment,
        aiPriorityScore: aiData.priorityScore,
        aiPriorityLevel: aiData.priorityLevel,
        aiClusterId: aiData.clusterId,
        aiTags: aiData.tags,
        isEmergency: aiData.isEmergency || false,
        isProcessed: true,
      },
      { new: true }
    );

    if (updated) {
      console.log("Email AI Updated:", updated._id);
    }

  } catch (error) {
    console.error("Ingestion Error FULL:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

module.exports = ingestComplaint;