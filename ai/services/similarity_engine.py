from sklearn.metrics.pairwise import cosine_similarity
import uuid
from utils.db import issues_collection

SIMILARITY_THRESHOLD = 0.75


def detect_similar(new_embedding):

    # 🔒 Safety check
    if not new_embedding or len(new_embedding) == 0:
        return {
            "clusterId": str(uuid.uuid4()),
            "clusterSize": 1,
            "similarityScore": 0.0
        }

    # ✅ Get one representative embedding per cluster
    existing_clusters = list(
        issues_collection.aggregate([
            {
                "$match": {"clusterId": {"$exists": True}}
            },
            {
                "$group": {
                    "_id": "$clusterId",
                    "embedding": {"$first": "$embedding"}
                }
            }
        ])
    )


    best_score = 0.0
    best_cluster_id = None

    for cluster in existing_clusters:

        embedding = cluster.get("embedding")
        cluster_id = cluster.get("_id")  # IMPORTANT FIX

        # Skip invalid embeddings
        if not embedding or len(embedding) == 0:
            continue

        if len(embedding) != len(new_embedding):
            continue

        score = cosine_similarity(
            [new_embedding],
            [embedding]
        )[0][0]

        if score > best_score:
            best_score = score
            best_cluster_id = cluster_id   # IMPORTANT FIX

    # ✅ If similar complaint found
    if best_score >= SIMILARITY_THRESHOLD and best_cluster_id:

        cluster_size = issues_collection.count_documents({
            "clusterId": best_cluster_id
        }) + 1

        return {
            "clusterId": best_cluster_id,
            "clusterSize": cluster_size,
            "similarityScore": float(best_score)
        }

    # ❌ Otherwise create new cluster
    new_cluster = str(uuid.uuid4())

    return {
        "clusterId": new_cluster,
        "clusterSize": 1,
        "similarityScore": float(best_score)
    }