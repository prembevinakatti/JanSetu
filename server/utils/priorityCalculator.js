const calculatePriority = (aiData, description) => {
  if (!aiData) return { score: 0, level: "Low" };

  let score = 0;

  // Base severity
  score += aiData.severity_score * 50;

  // Sentiment boost
  if (aiData.sentiment.label === "NEGATIVE") {
    score += 20;
  }

  // Emergency boost
  if (aiData.is_emergency) {
    score += 60;
  }

  // Infrastructure keyword boost
  const highImpactKeywords = [
    "bus stand",
    "hospital",
    "school",
    "highway",
    "traffic signal",
  ];

  if (
    highImpactKeywords.some((word) =>
      description.toLowerCase().includes(word)
    )
  ) {
    score += 25;
  }

  let level = "Low";

  if (score >= 80) level = "High";
  else if (score >= 50) level = "Medium";

  return { score, level };
};
