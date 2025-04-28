from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from models.order import Order, order_products
from models.product import Product
from schemas.order import OrderCreate, OrderUpdate

def get_orders(db: Session, user_id: int = None, skip: int = 0, limit: int = 100):
    """Получение списка заказов с возможностью фильтрации по пользователю"""
    query = db.query(Order)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    """Получение заказа по ID"""
    return db.query(Order).filter(Order.id == order_id).first()

def create_order(db: Session, order: OrderCreate, user_id: int):
    """Создание нового заказа"""
    # Создаем заказ
    total_price = 0.0
    
    # Вычисляем общую стоимость заказа
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            # Предполагаем, что actual_price - это числовое значение цены
            total_price += product.actual_price * item.quantity
    
    db_order = Order(
        user_id=user_id,
        total_price=total_price,
        shipping_address=order.shipping_address,
        payment_details=order.payment_details,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Добавляем товары к заказу
    for item in order.items:
        db.execute(
            order_products.insert().values(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                selected_size=item.selected_size
            )
        )
    
    db.commit()
    return db_order

def update_order(db: Session, order_id: int, order: OrderUpdate):
    """Обновление заказа"""
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    
    update_data = order.dict(exclude_unset=True)
    
    # Обновляем поля объекта
    for key, value in update_data.items():
        setattr(db_order, key, value)
    
    # Обновляем дату изменения
    db_order.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    """Удаление заказа"""
    db_order = get_order(db, order_id)
    if not db_order:
        return False
    
    # Удаляем записи из таблицы связей
    db.execute(order_products.delete().where(order_products.c.order_id == order_id))
    
    # Удаляем сам заказ
    db.delete(db_order)
    db.commit()
    return True

def get_order_with_items(db: Session, order_id: int):
    """Получение заказа вместе с товарами"""
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    
    # Получаем товары из заказа
    items = []
    for product_id, quantity, selected_size in db.execute(
        db.query(
            order_products.c.product_id,
            order_products.c.quantity,
            order_products.c.selected_size
        ).filter(order_products.c.order_id == order_id)
    ):
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            items.append({
                "product": product,
                "quantity": quantity,
                "selected_size": selected_size
            })
    
    return {"order": db_order, "items": items}