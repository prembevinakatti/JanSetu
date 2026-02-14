const axios = require("axios");

const analyzeComplaint = async (text) => {
  try {
    const response = await axios.post("http://localhost:8000/analyze", {
      text,
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing complaint:", error);
  }
};

module.exports = { analyzeComplaint };
