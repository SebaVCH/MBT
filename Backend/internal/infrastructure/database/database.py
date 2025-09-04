from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from internal.domain import Base, person, category, transaction, paymentMethod

# Configuración de la base de datos SQLite
engine = create_engine('sqlite:///database.db')
SessionLocal = sessionmaker(bind=engine)

# Crear las tablas en la base de datos
def StartDB():
    Base.metadata.create_all(engine)

# Proporciona una sesión de base de datos
def ReturnDB():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()