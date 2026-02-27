from fastapi import APIRouter
from models.chat_models import ChatRequest
from services.chat_service import process_chat

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(data: ChatRequest):
    result = await process_chat(data.message)

    # If backend already returns proper dict, return directly
    if isinstance(result, dict):
        return result

    # If string fallback
    if isinstance(result, str):
        return {
            "type": "text",
            "message": result
        }

    # Safety fallback
    return {
        "type": "text",
        "message": "Unexpected response format."
    }