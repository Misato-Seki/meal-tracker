***venv***
```zsh
source venv/bin/activate
```

***FastAPI***
```zsh
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

***Generate Migration Script***
```zsh
alembic revision --autogenerate -m "Initial migration"
```
***SQL Migration***
```zsh
alembic upgrade head
```

***requirements.txt***
```zsh
pip freeze > requirements.txt
```