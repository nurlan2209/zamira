from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ReviewBase(BaseModel):
    user: str
    review: str

class Review(ReviewBase):
    pass

class ProductBase(BaseModel):
    name: str
    price: str
    actual_price: float
    img: str
    category: str
    sizes: List[str]
    description: Optional[str] = None

class ProductCreate(ProductBase):
    rating: float = 0.0
    reviews: List[Review] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[str] = None
    actual_price: Optional[float] = None
    img: Optional[str] = None
    category: Optional[str] = None
    sizes: Optional[List[str]] = None
    rating: Optional[float] = None
    reviews: Optional[List[Review]] = None
    description: Optional[str] = None

class ProductInDB(ProductBase):
    id: int
    rating: float
    reviews: List[Dict[str, Any]]

    class Config:
        orm_mode = True

class Product(ProductInDB):
    pass