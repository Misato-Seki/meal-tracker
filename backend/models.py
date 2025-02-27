from database import Base
from sqlalchemy import Column, Numeric, String, Date, Integer
class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    meal = Column(String, index=True)
    energy = Column(Numeric, index=True)
    cost = Column(Numeric, index=True)
    fat = Column(Numeric, index=True)
    carbs = Column(Numeric, index=True)
    protein = Column(Numeric, index=True)
    