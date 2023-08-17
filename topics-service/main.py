from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient

app = FastAPI()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["voting_app"]
topics_collection = db["topics"]
voters_collection = db["voters"]

# Topic model
class Topic(BaseModel):
    title: str
    description: str
    choices: list
    votes: list
    results: list
    status: str


# Create a new topic
@app.post("/topics")
def create_topic(topic: Topic):
    topic_data = topic.dict()
    result = topics_collection.insert_one(topic_data)
    topic_data["_id"] = str(result.inserted_id)
    return topic_data

"""
    Generate a sample post request
    {
        "title": "New topic",
        "description": "New topic description",
        "choices": [
            "Choice 1",
            "Choice 2"

        ],
        "votes": [],
        "results": [],
        "status": "active" 
    }
"""

# Get all topics
@app.get("/topics")
def get_all_topics():
    topics = list(topics_collection.find())
    return topics

# Get a topic by id
@app.get("/topics/{topicId}")
def get_topic(topicId: str):
    topic = topics_collection.find_one({"_id": topicId})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

# Update a topic by id
@app.patch("/topics/{topicId}")
def update_topic(topicId: str, topic: Topic):
    topic_data = topic.dict(exclude_unset=True)
    result = topics_collection.update_one({"_id": topicId}, {"$set": topic_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Topic updated successfully"}

# Delete a topic by id
@app.delete("/topics/{topicId}")
def delete_topic(topicId: str):
    result = topics_collection.delete_one({"_id": topicId})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Topic deleted successfully"}

# Delete all votes of a topic by id
@app.delete("/topics/{topicId}/votes")
def delete_topic_votes(topicId: str):
    result = topics_collection.update_one({"_id": topicId}, {"$unset": {"votes": ""}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Votes deleted successfully"}

# Delete all results of a topic by id
@app.delete("/topics/{topicId}/results")
def delete_topic_results(topicId: str):
    result = topics_collection.update_one({"_id": topicId}, {"$unset": {"results": ""}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Results deleted successfully"}

