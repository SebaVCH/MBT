from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from internal.domain import Base, person, category, transaction, paymentMethod

engine = create_engine('sqlite:///database.db')
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def StartDB():
    Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()