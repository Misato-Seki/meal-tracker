from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1",
    "https://meal-tracker-omega.vercel.app" # prod url (/を消す！)
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/food")
def read_root():
    return {"message": "Hello World"}