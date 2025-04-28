from sqlalchemy import Column, Integer, String, Float, Text, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB

from config import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    price = Column(String, nullable=False)
    actual_price = Column(Float, nullable=False)  # Числовое значение цены для фильтрации
    img = Column(String, nullable=False)
    category = Column(String, index=True, nullable=False)
    sizes = Column(ARRAY(String), nullable=False)  # PostgreSQL поддерживает массивы
    rating = Column(Float, nullable=False, default=0)
    reviews = Column(JSONB, nullable=False, default=[])  # Используем JSONB для хранения отзывов
    description = Column(Text, nullable=True)