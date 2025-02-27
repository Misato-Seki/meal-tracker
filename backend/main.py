from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models as MealModel
from database import engine, get_db
from sqlalchemy.orm import Session
import schemas
import models
<<<<<<< HEAD
=======
import database
>>>>>>> main

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
    meals = db.query(MealModel.Meal).all()
    return meals

@app.post("/meals", response_model=schemas.MealResponse)
def create_meal(meal: schemas.MealRequest, db: Session = Depends(get_db)):
    db_meal = models.Meal(**meal.dict())
    db.add(db_meal)
    db.commit() # 情報を保存
    db.refresh(db_meal) # 保存したばかりの情報をもう一度確認
    return db_meal
