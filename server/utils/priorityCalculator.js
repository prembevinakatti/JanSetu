const calculatePriority = (aiData) => {
  if (!aiData) return { score: 0, level: "Low" };

  let score =
    aiData.severity_score * 40 +
    (aiData.sentiment.label === "NEGATIVE" ? 20 : 5) +
    (aiData.is_emergency ? 50 : 0);

  let level = "Low";

  if (score > 80) level = "High";
  else if (score > 40) level = "Medium";

  return { score, level };
};

module.exports = { calculatePriority };
