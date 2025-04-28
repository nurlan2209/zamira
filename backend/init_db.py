"""
Скрипт для инициализации базы данных и создания таблиц.
Этот скрипт создает все необходимые таблицы в базе данных и 
добавляет тестового пользователя с правами администратора.
"""
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from config import get_db, engine, Base
from models.user import User
from models.product import Product
from models.order import Order, order_products

# Инициализация контекста для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    """
    Инициализация базы данных: создание таблиц и тестового пользователя.
    """
    try:
        # Создание всех таблиц
        Base.metadata.create_all(bind=engine)
        print("Таблицы успешно созданы")
        
        # Получение сессии базы данных
        db = next(get_db())
        
        # Проверяем, существует ли уже тестовый пользователь
        test_user = db.query(User).filter(User.username == "admin").first()
        if not test_user:
            # Создаем тестового пользователя
            hashed_password = pwd_context.hash("admin123")
            test_user = User(
                username="admin",
                email="admin@example.com",
                hashed_password=hashed_password,
                first_name="Admin",
                last_name="User",
                is_active=True
            )
            db.add(test_user)
            db.commit()
            print("Тестовый пользователь успешно создан")
        else:
            print("Тестовый пользователь уже существует")
        
        # Добавьте здесь код для создания тестовых товаров, если нужно
        # Например:
        # create_test_products(db)
        
        db.close()
        print("Инициализация базы данных завершена успешно")
    
    except Exception as e:
        print(f"Ошибка при инициализации базы данных: {e}")

def create_test_products(db: Session):
    """
    Создание тестовых товаров, если база данных пуста.
    """
    # Проверяем, есть ли уже товары в базе данных
    existing_products = db.query(Product).count()
    if existing_products > 0:
        print(f"В базе данных уже есть {existing_products} товаров, пропускаем создание тестовых")
        return
    
    # Создаем несколько тестовых товаров
    test_products = [
        Product(
            name="Тестовый худи",
            price="$99",
            actual_price=99.0,
            img="https://i.pinimg.com/736x/9d/4f/94/9d4f94d406f3bb64676b9cdea594839d.jpg",
            category="Hoodies",
            sizes=["S", "M", "L", "XL"],
            rating=4.5,
            reviews=[
                {"user": "Тестовый пользователь", "review": "Отличный товар!"}
            ],
            description="Тестовый худи для демонстрации функциональности"
        ),
        Product(
            name="Тестовые штаны",
            price="$79",
            actual_price=79.0,
            img="https://i.pinimg.com/736x/79/29/0f/79290fe785787fbc80dfc172cec8a747.jpg",
            category="Bottom",
            sizes=["S", "M", "L"],
            rating=4.2,
            reviews=[
                {"user": "Тестовый пользователь", "review": "Хорошие штаны!"}
            ],
            description="Тестовые штаны для демонстрации функциональности"
        )
    ]
    
    for product in test_products:
        db.add(product)
    
    db.commit()
    print(f"Добавлено {len(test_products)} тестовых товаров")

if __name__ == "__main__":
    init_db()