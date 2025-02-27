from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from uuid import uuid4 as uuid

class MealRequest(BaseModel):
    date: date
    meal: str
    energy: Decimal
    cost: Decimal
    # fat: Decimal
    # carbs: Decimal
    # protein: Decimal

class MealResponse(BaseModel):
    id: uuid

    class Config:
        from_attributes = True