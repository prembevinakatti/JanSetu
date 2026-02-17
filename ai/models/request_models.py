from typing import Optional
from pydantic import BaseModel

class ComplaintRequest(BaseModel):
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
