from fastapi import FastAPI, Depends, HTTPException, Query
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
def get_meal(db: Session = Depends(get_db), date: date = Query(None)):
    """
    Retrieve all meal entries from the database.

    Args:
        db: A Session object that provides a connection to the database.

    Returns:
        List[Meal]: A list of Meal objects containing all meals in the database.
    """
    if date:
        meals = db.query(MealModel.Meal).filter(models.Meal.date == date).all()
    else:
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

@app.put("/meals/{id}", response_model = schemas.MealResponse)
def put_meal(meal: schemas.MealRequest, id: int, db: Session = Depends(get_db)):
    """
    Update an existing meal entry in the database.

    Args:
        db: A Session object to interact with the database.
        meal: A MealRequest object containing the new date, meal name, energy, cost, fat, carbs, and protein of the meal.
        id: The id of the meal to be updated.

    Returns:
        MealResponse: A MealResponse object containing the id and other information of the updated meal.
    """
    meal_in_db = db.query(models.Meal).filter(models.Meal.id == id).first()
    if not meal_in_db:
        raise HTTPException(status_code=404, detail="Meal not found")
    else:
        meal_in_db.datae = meal.date
        meal_in_db.meal = meal.meal
        meal_in_db.energy = meal.energy
        meal_in_db.cost = meal.cost
        meal_in_db.fat = meal.fat
        meal_in_db.carbs = meal.carbs
        meal_in_db.protein = meal.protein
        db.add(meal_in_db)
        db.commit()
        db.refresh(meal_in_db)
        return meal_in_db
    
@app.delete("/meals/{id}")
def delete_meal(id: int, db: Session = Depends(get_db)):
    """
    Delete an existing meal entry from the database.

    Args:
        db: A Session object to interact with the database.
        id: The id of the meal to be deleted.

    Returns:
        Dict[str, str]: A dictionary containing the message "Item deleted successfully"
    """
    db_meal = db.query(models.Meal).filter(models.Meal.id == id).first()
    db.delete(db_meal)
    db.commit()
    return {"message": "Item deleted successfully"}

@app.get("/meals/{id}")
# db という名前の引数は Session という型. Session は、データベースとやり取りするための「通路」みたいなもの.
# Depends() を使うと：FastAPIが 自動的に get_db() を呼び出して、db に接続した Session を渡してくれる.
def get_meal(id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific meal entry from the database by its ID.

    Args:
        id: The ID of the meal to retrieve.
        db: A Session object that provides a connection to the database.

    Returns:
        List[Meal]: A list containing the meal object with the specified ID.
    """
    meals = db.query(MealModel.Meal).filter(models.Meal.id == id).first()
    return meals