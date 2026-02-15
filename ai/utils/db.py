from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)

db = client["janSetu"]  # <-- your main DB name

issues_collection = db["issues"]
history_collection = db["issuehistories"]
