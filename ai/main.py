from fastapi import FastAPI
from models.request_models import ComplaintRequest
from services.embedding_engine import generate_embedding
from services.similarity_engine import detect_similar
from services.nlp_engine import analyze_text
from services.priority_engine import calculate_priority
from services.tag_engine import auto_tag

app = FastAPI()


@app.post("/analyze")
async def analyze_complaint(data: ComplaintRequest):

    # 1️⃣ Generate embedding
    embedding = generate_embedding(data.description)

    # 2️⃣ Auto Tag
    tags = auto_tag(data.description)

    # 3️⃣ Decide category from tags
    if tags:
        category = tags[0]  # first detected tag becomes main category
    else:
        category = "General"

    # 4️⃣ Similarity
    similarity_data = detect_similar(embedding)

    cluster_id = similarity_data["clusterId"]
    cluster_size = similarity_data["clusterSize"]

    # 5️⃣ Sentiment
    sentiment = analyze_text(data.description)

    # 6️⃣ Emergency detection
    is_emergency = "Emergency" in tags

    # 7️⃣ Priority
    priority = calculate_priority(
        sentiment_score=sentiment["score"],
        text=data.description,
        cluster_size=cluster_size,
        is_emergency=is_emergency
    )

    return {
        "clusterId": cluster_id,
        "clusterSize": cluster_size,
        "similarityScore": similarity_data["similarityScore"],
        "sentiment": sentiment,
        "priorityScore": priority["score"],
        "priorityLevel": priority["level"],
        "category": category,   # ✅ FIXED
        "tags": tags,
        "isEmergency": is_emergency
    }