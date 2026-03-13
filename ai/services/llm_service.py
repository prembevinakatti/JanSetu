import requests
import json

HF_TOKEN = "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"

API_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def generate_mongo_query(user_question):

    prompt = f"""
You generate MongoDB queries.

Return ONLY JSON.

Format:
{{
"type": "find" OR "count",
"filters": {{}},
"limit": 10
}}

Fields:
priorityLevel: High Medium Low
status: Reported InProgress Resolved
category: string
address: string

User question:
{user_question}
"""

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 150,
            "temperature": 0.1
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    result = response.json()

    try:
        text = result[0]["generated_text"]

        start = text.find("{")
        end = text.rfind("}") + 1

        json_text = text[start:end]

        return json.loads(json_text)

    except:
        return None