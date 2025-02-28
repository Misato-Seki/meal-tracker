from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models as MealModel
from database import engine, get_db
from sqlalchemy.orm import Session
import schemas
import models
from datetime import date

app = FastAPI()

# CORS settings = アプリにアクセスしてもいい場所のリスト
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1",
    "https://meal-tracker-omega.vercel.app" # prod url (/を消す！)
]

# Add CORS middleware = このアプリは、上のリストにある場所からなら自由にアクセスしてもOKというルールを設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/meals")
# db という名前の引数は Session という型. Session は、データベースとやり取りするための「通路」みたいなもの.
# Depends() を使うと：FastAPIが 自動的に get_db() を呼び出して、db に接続した Session を渡してくれる.
def get_meal(db: Session = Depends(get_db)):
    """
    Retrieve all meal entries from the database.

    Args:
        db: A Session object that provides a connection to the database.

    Returns:
        List[Meal]: A list of Meal objects containing all meals in the database.
    """
    meals = db.query(MealModel.Meal).all()
    return meals

@app.post("/meals", response_model=schemas.MealResponse)
def create_meal(meal: schemas.MealRequest, db: Session = Depends(get_db)):
    """
    Create a new meal entry in the database.

    Args:
        meal: A MealRequest object containing the date, meal name, energy, cost, fat, carbs, and protein of the meal.
        db: A Session object to interact with the database.

    Returns:
        MealResponse: A MealResponse object containing the id and other information of the newly created meal.
    """
    db_meal = models.Meal(**meal.dict())
    db.add(db_meal)
    db.commit() # 情報を保存
    db.refresh(db_meal) # 保存したばかりの情報をもう一度確認
    return db_meal


@app.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    """
    Get the total energy and cost of the meals for today.

    Returns:
        Summary: A dictionary containing the date, total energy, and total cost.
    """
    today = date.today()
    meals = db.query(models.Meal).filter(models.Meal.date == today).all()

    total_energy = sum(meal.energy for meal in meals)
    total_cost = sum(meal.cost for meal in meals)

    return {
        "date": today,
        "total_energy": total_energy,
        "total_cost": total_cost
    }