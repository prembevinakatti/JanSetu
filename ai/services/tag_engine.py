from sentence_transformers import SentenceTransformer, util
import torch

model = SentenceTransformer("all-MiniLM-L6-v2")

# Predefined tag categories
TAG_CATEGORIES = {
    "Sanitation": [
        "garbage", "waste", "dirty", "overflow", "drain"
    ],
    "Water": [
        "water leakage", "no water", "pipeline", "drinking water"
    ],
    "Road": [
        "pothole", "road damage", "broken road", "accident"
    ],
    "Electricity": [
        "power cut", "electric shock", "street light", "voltage"
    ],
    "Health": [
        "infection", "mosquito", "disease", "hospital"
    ],
    "Emergency": [
        "fire", "explosion", "collapse", "flood"
    ]
}

# Precompute embeddings for keywords
TAG_EMBEDDINGS = {
    tag: model.encode(keywords, convert_to_tensor=True)
    for tag, keywords in TAG_CATEGORIES.items()
}


def auto_tag(text: str, threshold=0.55):

    text_embedding = model.encode(text, convert_to_tensor=True)

    detected_tags = []

    for tag, keyword_embeddings in TAG_EMBEDDINGS.items():

        similarities = util.cos_sim(text_embedding, keyword_embeddings)

        max_score = torch.max(similarities).item()

        if max_score > threshold:
            detected_tags.append(tag)

    return detected_tags