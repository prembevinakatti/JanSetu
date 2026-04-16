import os
import json
from groq import Groq
from utils.db import issues_collection, email_collection


# ✅ Load API key
GROQ_API_KEY = "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"

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in environment variables.")

client = Groq(api_key=GROQ_API_KEY)



# ✅ Fetch and normalize both schemas
def fetch_relevant_data():

    # Fetch web complaints
    web_complaints = list(
        issues_collection
        .find()
        .sort("createdAt", -1)
    )

    # Fetch email complaints
    email_complaints = list(
        email_collection
        .find()
        .sort("createdAt", -1)
    )

    cleaned = []

    # Normalize Web schema
    for c in web_complaints:
        cleaned.append({
            "title": c.get("title"),
            "description": (c.get("description") or "")[:200],
            "priority": c.get("priorityLevel"),
            "status": c.get("status"),
            "category": c.get("category"),
            "location": c.get("address") or c.get("location"),
            "source": "web",
            "createdAt": str(c.get("createdAt"))
        })

    # Normalize Email schema
    for c in email_complaints:
        cleaned.append({
            "title": c.get("subject"),
            "description": (c.get("body") or "")[:200],
            "priority": c.get("aiPriorityLevel"),
            "status": None,  # email may not have status
            "category": c.get("aiCategory"),
            "location": None,
            "source": "email",
            "createdAt": str(c.get("createdAt"))
        })

    # Sort combined data by date (latest first)
    cleaned.sort(key=lambda x: x["createdAt"], reverse=True)

    # Limit total results sent to LLM
    return cleaned


def generate_answer(question: str):

    data = fetch_relevant_data()

    system_prompt = """
You are an AI Civic Assistant.

IMPORTANT:
You MUST respond ONLY in VALID JSON.

If user asks for high priority complaints, return:

{
  "type": "complaints",
  "total": number,
  "data": [
    {
      "title": "...",
      "status": "...",
      "category": "...",
      "location": "..."
    }
  ]
}

Rules:
- Only include HIGH priority complaints.
- If none found:

{
  "type": "text",
  "message": "No high priority complaints found."
}
"""

    user_prompt = f"""
Complaint Data:
{json.dumps(data)}

Question:
{question}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=600,
        )

        result = response.choices[0].message.content.strip()

        return json.loads(result)

    except Exception as e:
        print("Groq Error:", str(e))
        return {
            "type": "text",
            "message": "AI service temporarily unavailable."
        }