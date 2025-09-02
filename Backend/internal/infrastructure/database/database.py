from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from internal.domain import Base, person, category, transaction, paymentMethod

engine = create_engine('sqlite:///database.db')
Session = sessionmaker(engine)
session = Session()

def StartDB():
    Base.metadata.create_all(engine)