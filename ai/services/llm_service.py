import requests
import json
import os

HF_TOKEN = "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"

API_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def generate_mongo_query(user_question: str):

    prompt = f"""
You are a strict MongoDB query generator.

Return ONLY JSON in this format:
{{
  "type": "find" OR "count" OR "hotspot",
  "filters": {{}},
  "limit": 10
}}

Available fields:
priorityLevel: High, Medium, Low
status: Open, Resolved, InProgress, Reported
location: string

User Question:
{user_question}
"""

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.1
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    result = response.json()

    try:
        text = result[0]["generated_text"]
        json_start = text.find("{")
        json_text = text[json_start:]
        return json.loads(json_text)
    except:
        return None