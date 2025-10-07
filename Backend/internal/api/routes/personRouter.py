import json
import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from internal.domain.category import Category
from internal.domain.transaction import Transaction
from internal.infrastructure.database.db import get_db
from internal.domain.person import Person
from internal.api.middleware.auth import get_current_user
from internal.schemas.transactionSchema import TransactionResponse, WithdrawRequest
from ollama import chat

router = APIRouter(prefix="/person", tags=["Person"])

@router.post("/deposit", response_model=TransactionResponse)
def deposit(amount: int, description: str | None = None ,user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Monto inválido")

    ingreso_category = db.query(Category).filter(
        Category.name == "Ingreso",
        (Category.personID == user.id) | (Category.personID == 0)).first()

    if not ingreso_category:
        raise HTTPException(status_code=404, detail="Categoría 'Ingreso' no encontrada")

    transaction = Transaction(
        personID=user.id,
        categoryID=ingreso_category.id,
        paymentMethodID=None,
        date=datetime.now(),
        amount=amount,
        description=description
    )

    user.balance += amount
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.post("/withdraw",response_model=TransactionResponse)
def withdraw(request: WithdrawRequest ,user: Person = Depends(get_current_user), db: Session = Depends(get_db)):
    if request.amount <= 0 or request.amount > user.balance:
        raise HTTPException(status_code=400, detail="Monto inválido o saldo insuficiente")

    category = db.query(Category).filter(
        Category.id == request.categoryID,
        (Category.personID == user.id) | (Category.personID == 0)
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    transaction = Transaction(
        personID=user.id,
        categoryID=request.categoryID,
        paymentMethodID=request.paymentMethodID,
        date=datetime.now(),
        amount=request.amount,
        description=request.description
    )

    user.balance -= request.amount
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.get("/balance")
def get_user_balance(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.personID == user.id).all()
    if not transactions:
        return {"balance": 0}

    total = 0
    for t in transactions:
        if t.category and t.category.name.lower() == "ingreso":
            total += t.amount
        else:
            total -= t.amount
    return {"balance": total}

@router.get("/income")
def get_user_income(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    total_income = (
        db.query(func.sum(Transaction.amount))
        .join(Category)
        .filter(Transaction.personID == user.id, Category.name.ilike("ingreso"))
        .scalar()
    )
    return {"total_income": total_income or 0}

@router.get("/expenses")
def get_user_expenses(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    total_expenses = (
        db.query(func.sum(Transaction.amount))
        .join(Category)
        .filter(Transaction.personID == user.id, Category.name.ilike("ingreso") == False)
        .scalar()
    )
    return {"total_expenses": total_expenses or 0}

@router.get("/transactions", response_model=list[TransactionResponse])
def get_user_transactions(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.personID == user.id).all()

    result = []
    for t in transactions:
        transaction_dict = {
            "id": t.id,
            "amount": t.amount,
            "description": t.description,
            "personID": t.personID,
            "categoryID": t.categoryID,
            "paymentMethodID": t.paymentMethodID,
            "date": t.date,
            "categoryName": t.category.name if t.category else None
        }
        result.append(transaction_dict)

    return result

@router.get("/ai-tips")
def get_financial_tips(db: Session = Depends(get_db), user: Person = Depends(get_current_user)):

    transactions = db.query(Transaction).filter(Transaction.personID == user.id).order_by(Transaction.date.desc()).all()

    if len(transactions) == 0:
        raise HTTPException(
            status_code=400,
            detail="No tienes transacciones registradas. ¡Comienza a registrar tus movimientos financieros para recibir consejos personalizados!"
    )

    selected_transactions = transactions if len(transactions) < 10 else transactions[:20]

    transaction_summary = []
    for t in selected_transactions:
        transaction_summary.append({
            "fecha": t.date.strftime("%Y-%m-%d"),
            "categoria": t.category.name if t.category else "Sin categoría",
            "monto": t.amount,
            "descripcion": t.description or "Sin descripción"
        })

    # Crear prompt optimista y alegre
    prompt = f"""¡Hola! 🌟 Soy tu asistente financiero personal y estoy aquí para ayudarte a brillar con tus finanzas.

He analizado tus últimas {len(selected_transactions)} transacciones y quiero compartir contigo algunos consejos súper positivos para que sigas creciendo económicamente. 

Aquí están tus transacciones recientes:
{json.dumps(transaction_summary, indent=2, ensure_ascii=False)}

Por favor, proporcioname 3-5 tips financieros personalizados basados en estos datos. Sé:
- ✨ Optimista y motivador
- 💡 Práctico y accionable
- 🎯 Específico a sus patrones de gasto
- 🌈 Enfocado en oportunidades de mejora

Redacta los consejos en español, de forma amigable y entusiasta. ¡Ayúdame a inspirar mejores hábitos financieros!"""

    try:
        ai_model = os.getenv("AI_MODEL")
        response = chat(
            model=ai_model,
            messages=[{
                'role': 'user',
                'content': prompt
            }]
        )

        tips_text = response['message']['content']

        return {
            "tips": tips_text,
            "generated_at": datetime.now().isoformat(),
            "transactions_analyzed": len(selected_transactions)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar tips con IA: {str(e)}"
        )