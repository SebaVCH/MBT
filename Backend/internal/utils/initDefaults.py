from sqlalchemy.orm import Session
from internal.domain.category import Category
from internal.domain.paymentMethod import PaymentMethod

#Inicializa categorías y métodos de pago por defecto si no existen
def init_default_data(db: Session):
    #Categorias
    categorias_default = [
        'Ingreso',
        'Supermercado',
        'Gym',
        'Luz',
        'Agua',
        'Wifi'
    ]
    for nombre in categorias_default:
        existing = db.query(Category).filter(
            Category.name == nombre,
            Category.personID == 0
        ).first()

        if not existing:
            category = Category(name=nombre, personID=0)
            db.add(category)

    #Métodos de pago
    metodos_default = [
        'Tarjeta de credito',
        'Tarjeta de debido',
        'Cheque',
        'Efectivo'
    ]

    for nombre in metodos_default:
        existing = db.query(PaymentMethod).filter(
            PaymentMethod.name == nombre,
            PaymentMethod.personID == 0
        ).first()

        if not existing:
            payment_method = PaymentMethod(name=nombre, personID=0)
            db.add(payment_method)

    db.commit()
