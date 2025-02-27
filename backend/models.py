from database import Base
from sqlalchemy import Column, Numeric, String, Date
import uuid
from sqlalchemy.dialects.postgresql import UUID
class Meal(Base):
    __tablename__ = "meals"

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, index=True)
    date = Column(Date, index=True)
    meal = Column(String, index=True)
    energy = Column(Numeric, index=True)
    cost = Column(Numeric, index=True)
    fat = Column(Numeric, index=True)
    carbs = Column(Numeric, index=True)
    protein = Column(Numeric, index=True)
    