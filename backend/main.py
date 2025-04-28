from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routers import products, users, orders
from config import get_db

app = FastAPI(title="Fashion Store API", version="1.0.0")

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL фронтенда (Vite по умолчанию)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API интернет-магазина одежды MØRK!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)