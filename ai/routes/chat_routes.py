from fastapi import APIRouter
from models.chat_models import ChatRequest
from services.chat_service import process_chat

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(data: ChatRequest):
    reply = await process_chat(data.message)
    return {"reply": reply}