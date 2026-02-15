from pydantic import BaseModel


class ComplaintRequest(BaseModel):
    description: str
    latitude: float
    longitude: float