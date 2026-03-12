const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload-complaints", upload.single("file"), async (req, res) => {

  const results = [];

  try {

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data.complaint);
      })
      .on("end", async () => {

        const analyzedComplaints = [];

        for (const complaint of results) {

          const aiResponse = await axios.post(
            "http://localhost:8000/analyze",
            {
              description: complaint,
              latitude: 0,
              longitude: 0
            }
          );

          analyzedComplaints.push({
            text: complaint,
            ...aiResponse.data
          });

        }

        fs.unlinkSync(req.file.path);

        res.json(analyzedComplaints);
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

module.exports = router;