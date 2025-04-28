from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from config import get_db
import services.product_service as product_service
from schemas.product import Product, ProductCreate, ProductUpdate, Review

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Получение списка всех товаров с возможностью фильтрации по категории"""
    products = product_service.get_products(db, skip=skip, limit=limit, category=category)
    return products

@router.get("/search", response_model=List[Product])
def search_products(
    query: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Поиск товаров по названию"""
    products = product_service.search_products(db, query=query, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    """Получение товара по ID"""
    db_product = product_service.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return db_product

@router.post("/", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Создание нового товара"""
    # Здесь можно добавить проверку прав доступа (только для админа)
    return product_service.create_product(db=db, product=product)

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    """Обновление товара по ID"""
    # Здесь можно добавить проверку прав доступа (только для админа)
    db_product = product_service.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Удаление товара по ID"""
    # Здесь можно добавить проверку прав доступа (только для админа)
    success = product_service.delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return {"message": "Товар успешно удален"}

@router.post("/{product_id}/reviews", response_model=Product)
def add_review(product_id: int, review: Review, db: Session = Depends(get_db)):
    """Добавление отзыва к товару"""
    db_product = product_service.add_review(db, product_id=product_id, user=review.user, review_text=review.review)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return db_product