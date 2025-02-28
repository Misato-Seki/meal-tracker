from pydantic import BaseModel
from decimal import Decimal
from datetime import date

class MealRequest(BaseModel):
    date: date
    meal: str
    energy: Decimal
    cost: Decimal
    fat: Decimal
    carbs: Decimal
    protein: Decimal

class MealResponse(BaseModel):
    id: int
    date: date
    meal: str
    energy: Decimal
    cost: Decimal
    fat: Decimal
    carbs: Decimal
    protein: Decimal

    class Config:
        from_attributes = True