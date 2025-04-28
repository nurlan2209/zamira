from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
import datetime

from config import Base

# Таблица для связи многие-ко-многим между заказами и товарами
order_products = Table(
    "order_products",
    Base.metadata,
    Column("order_id", Integer, ForeignKey("orders.id"), primary_key=True),
    Column("product_id", Integer, ForeignKey("products.id"), primary_key=True),
    Column("quantity", Integer, default=1),
    Column("selected_size", String, nullable=False),
)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, paid, shipped, delivered, cancelled
    shipping_address = Column(String, nullable=False)
    payment_details = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    products = relationship("Product", secondary=order_products)