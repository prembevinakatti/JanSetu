from fastapi import FastAPI
from models.request_models import ComplaintRequest
from services.embedding_engine import generate_embedding
from services.nlp_engine import analyze_text
from services.similarity_engine import detect_similar
from services.priority_engine import calculate_priority

app = FastAPI()


@app.post("/analyze")
async def analyze_complaint(data: ComplaintRequest):

    # 1️⃣ Generate embedding
    embedding = generate_embedding(data.description)

    # 2️⃣ NLP analysis
    nlp_result = analyze_text(data.description)

    # 3️⃣ Similarity + cluster detection
    similarity_data = detect_similar(embedding)

    cluster_id = similarity_data["clusterId"]
    is_similar = similarity_data["similarComplaint"]

    # 4️⃣ Priority calculation
    priority = calculate_priority(
        sentiment_score=nlp_result["sentiment"]["score"],
        is_emergency=False,
        hotspot_boost=10 if is_similar else 0
    )

    # 5️⃣ Return FULL AI response
    return {
        "sentiment": nlp_result["sentiment"],
        "embedding": embedding,
        "clusterId": cluster_id,
        "similarComplaint": is_similar,
        "priorityScore": priority["score"],
        "priorityLevel": priority["level"]
    }
