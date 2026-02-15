import uuid
from utils.db import issues_collection
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

SIMILARITY_THRESHOLD = 0.85

def detect_similar(new_embedding):

    existing = list(
        issues_collection.find({"embedding": {"$exists": True}})
    )

    if not existing:
        # First complaint in system
        return {
            "clusterId": str(uuid.uuid4()),
            "similarComplaint": False
        }

    max_score = 0
    best_cluster = None

    new_vector = np.array(new_embedding).reshape(1, -1)

    for issue in existing:
        old_vector = np.array(issue["embedding"]).reshape(1, -1)
        score = cosine_similarity(new_vector, old_vector)[0][0]

        if score > max_score:
            max_score = score
            best_cluster = issue.get("clusterId")

    if max_score >= SIMILARITY_THRESHOLD:
        return {
            "clusterId": best_cluster,
            "similarComplaint": True
        }
    else:
        return {
            "clusterId": str(uuid.uuid4()),
            "similarComplaint": False
        }
