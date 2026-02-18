from fastapi import FastAPI
from models.request_models import ComplaintRequest
from services.embedding_engine import generate_embedding
from services.similarity_engine import detect_similar
from services.nlp_engine import analyze_text
from services.priority_engine import calculate_priority

app = FastAPI()

@app.post("/analyze")
async def analyze_complaint(data: ComplaintRequest):

    # 1️⃣ Generate embedding
    embedding = generate_embedding(data.description)

    # 2️⃣ Detect similarity
    similarity_data = detect_similar(embedding)

    cluster_id = similarity_data["clusterId"]
    cluster_size = similarity_data["clusterSize"]

    # 3️⃣ Sentiment
    sentiment = analyze_text(data.description)

    # 4️⃣ Priority
    priority = calculate_priority(
        sentiment_score=sentiment["score"],
        text=data.description,
        cluster_size=cluster_size
    )

    return {
        "clusterId": cluster_id,
        "clusterSize": cluster_size,
        "sentiment": sentiment,
        "priorityScore": priority["score"],
        "priorityLevel": priority["level"],
        "similarityScore": similarity_data["similarityScore"]
    }
