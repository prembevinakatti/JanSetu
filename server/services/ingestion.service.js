const axios = require("axios");
const Issue = require("../models/Issue");

async function ingestComplaint(data) {
  try {
    // Call Python AI service
    const aiResponse = await axios.post(
      "http://localhost:8001/analyze",
      {
        description: data.description,
      }
    );

    const aiData = aiResponse.data;

    // Save to DB
    await Issue.create({
      title: data.title,
      description: data.description,
      category: aiData.category,
      sentiment: aiData.sentiment,
      priorityScore: aiData.priorityScore,
      priorityLevel: aiData.priorityLevel,
      clusterId: aiData.clusterId,
      isEmergency: aiData.isEmergency,
    });

  } catch (error) {
    console.error("Ingestion Error:", error.message);
  }
}

module.exports = ingestComplaint;
