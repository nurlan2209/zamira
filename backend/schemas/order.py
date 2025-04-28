from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = 1
    selected_size: str

class OrderItem(OrderItemBase):
    pass

class OrderBase(BaseModel):
    shipping_address: str
    payment_details: Optional[Dict[str, Any]] = None

class OrderCreate(OrderBase):
    items: List[OrderItem]

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    shipping_address: Optional[str] = None
    payment_details: Optional[Dict[str, Any]] = None

class OrderInDB(OrderBase):
    id: int
    user_id: int
    total_price: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Order(OrderInDB):
    items: List[Dict[str, Any]]