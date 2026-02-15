import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from utils.db import issues_collection

SIMILARITY_THRESHOLD = 0.85

def detect_similar(new_embedding, lat, lng):

    existing = list(issues_collection.find({}, {"embedding": 1}))

    similar_count = 0
    cluster_id = None

    for issue in existing:
        if "embedding" in issue:
            sim = cosine_similarity(
                [new_embedding],
                [issue["embedding"]]
            )[0][0]

            if sim > SIMILARITY_THRESHOLD:
                similar_count += 1
                cluster_id = issue.get("clusterId")

    return {
        "similar_count": similar_count,
        "clusterId": cluster_id
    }
