from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get the database URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database engine = データベースに接続するための「エンジン(電話)」
engine = create_engine(DATABASE_URL)

# Create a session factory = データベースとお話しする「セッション」（会話）を作る
# autocommit=False「会話が終わるまで自動で保存しない」
# autoflush=False「会話の途中では自動的にデータを送らない」
# bind=engine「このセッションはさっき作ったエンジンを使う」
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the base class = データベースの設計図の基本クラスを作る
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal() # データベースに接続する
    try:
        yield db # 接続したデータベースを渡す
    finally:
        db.close()