import re
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def normalize_text(text: str):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)  # remove punctuation
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def generate_embedding(text: str):
    clean_text = normalize_text(text)
    return model.encode(clean_text).tolist()