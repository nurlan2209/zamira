from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from config import get_db
import services.order_service as order_service
from schemas.order import Order, OrderCreate, OrderUpdate

router = APIRouter()

@router.get("/", response_model=List[Order])
def read_orders(
    user_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получение списка заказов"""
    # Здесь должна быть проверка прав доступа
    orders = order_service.get_orders(db, user_id=user_id, skip=skip, limit=limit)
    return orders

@router.get("/{order_id}", response_model=Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """Получение заказа по ID"""
    # Здесь должна быть проверка прав доступа
    db_order = order_service.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return db_order

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, user_id: int, db: Session = Depends(get_db)):
    """Создание нового заказа"""
    # Здесь должна быть получение user_id из токена
    return order_service.create_order(db=db, order=order, user_id=user_id)

@router.put("/{order_id}", response_model=Order)
def update_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    """Обновление заказа по ID"""
    # Здесь должна быть проверка прав доступа
    db_order = order_service.update_order(db, order_id=order_id, order=order)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return db_order

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Удаление заказа по ID"""
    # Здесь должна быть проверка прав доступа
    success = order_service.delete_order(db, order_id=order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return {"message": "Заказ успешно удален"}

@router.get("/{order_id}/details")
def read_order_with_items(order_id: int, db: Session = Depends(get_db)):
    """Получение заказа вместе с товарами"""
    # Здесь должна быть проверка прав доступа
    result = order_service.get_order_with_items(db, order_id=order_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return result