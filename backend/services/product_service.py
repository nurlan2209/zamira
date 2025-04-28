from sqlalchemy.orm import Session
from typing import List, Optional
from models.product import Product
from schemas.product import ProductCreate, ProductUpdate

def get_products(db: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None):
    """Получение списка товаров с возможностью фильтрации по категории"""
    query = db.query(Product)
    if category and category != "All":
        query = query.filter(Product.category == category)
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    """Получение товара по ID"""
    return db.query(Product).filter(Product.id == product_id).first()

def create_product(db: Session, product: ProductCreate):
    """Создание нового товара"""
    db_product = Product(
        name=product.name,
        price=product.price,
        actual_price=product.actual_price,
        img=product.img,
        category=product.category,
        sizes=product.sizes,
        rating=product.rating,
        reviews=[review.dict() for review in product.reviews],
        description=product.description
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: ProductUpdate):
    """Обновление товара"""
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product.dict(exclude_unset=True)
    
    # Обновляем поля объекта
    for key, value in update_data.items():
        if key == "reviews" and value is not None:
            value = [review.dict() for review in value]
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    """Удаление товара"""
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    
    db.delete(db_product)
    db.commit()
    return True

def search_products(db: Session, query: str, skip: int = 0, limit: int = 100):
    """Поиск товаров по названию"""
    search = f"%{query}%"
    return db.query(Product).filter(Product.name.ilike(search)).offset(skip).limit(limit).all()

def add_review(db: Session, product_id: int, user: str, review_text: str):
    """Добавление отзыва к товару"""
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    new_review = {"user": user, "review": review_text}
    
    # Добавляем новый отзыв и обновляем товар
    if db_product.reviews:
        db_product.reviews.append(new_review)
    else:
        db_product.reviews = [new_review]
    
    db.commit()
    db.refresh(db_product)
    return db_product