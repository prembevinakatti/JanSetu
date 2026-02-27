# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.request_models import ComplaintRequest
from services.embedding_engine import generate_embedding
from services.similarity_engine import detect_similar
from services.nlp_engine import analyze_text
from services.priority_engine import calculate_priority
from services.tag_engine import auto_tag
from services.category_engine import derive_category_from_tags
from routes.chat_routes import router as chat_router

app = FastAPI()

# ✅ CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development (React localhost)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chatbot routes
app.include_router(chat_router)


@app.post("/analyze")
async def analyze_complaint(data: ComplaintRequest):

    if not data.description:
        return {"error": "Description is required"}

    # 1️⃣ Embedding
    embedding = generate_embedding(data.description)

    # 2️⃣ Auto Tag
    tags = auto_tag(data.description)

    # 3️⃣ Category
    category = derive_category_from_tags(tags)

    # 4️⃣ Similarity
    similarity_data = detect_similar(embedding)
    cluster_id = similarity_data["clusterId"]
    cluster_size = similarity_data["clusterSize"]

    # 5️⃣ Sentiment
    sentiment = analyze_text(data.description)

    # 6️⃣ Emergency Logic
    is_emergency = (
        "Emergency" in tags
        or "Health" in tags
        or "fire" in data.description.lower()
        or "flood" in data.description.lower()
    )

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
        "category": category,
        "tags": tags,
        "isEmergency": is_emergency
    }