const axios = require("axios");

exports.analyzeComplaint = async (description, latitude, longitude) => {
  const res = await axios.post("http://localhost:8000/analyze", {
    description,
    latitude,
    longitude,
  });

  return res.data;
};
