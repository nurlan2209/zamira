"""
Упрощенный скрипт для импорта товаров напрямую из данных.
Этот скрипт можно использовать, если основной import_products.py не работает.
"""
from sqlalchemy.orm import Session

from config import get_db, engine, Base
from models.product import Product

# Создаем список товаров на основе данных из ProductPage.jsx
sample_products = [
    {
        "id": 1,
        "name": "Shadow Ember",
        "price": "$190",
        "actual_price": 190.0,
        "img": "https://i.pinimg.com/736x/9d/4f/94/9d4f94d406f3bb64676b9cdea594839d.jpg",
        "category": "Hoodies",
        "sizes": ["S", "M", "L", "XL"],
        "rating": 4.5,
        "reviews": [
            {"user": "Айгуль", "review": "Очень красивый худи, комфортный и стильный!"},
            {"user": "Руслан", "review": "Ткань приятная, но немного маломерит."}
        ]
    },
    {
        "id": 2,
        "name": "Frost Pulse",
        "price": "$49",
        "actual_price": 49.0,
        "img": "https://i.pinimg.com/736x/66/bc/11/66bc1140083fd5a840e66c4634e02270.jpg",
        "category": "Hoodies",
        "sizes": ["S", "M", "L"],
        "rating": 4.0,
        "reviews": [
            {"user": "Мадина", "review": "Очень приятная ткань, но в районе талии немного широковато."},
            {"user": "Данияр", "review": "Хороший худи, но материал мог бы быть плотнее."}
        ]
    },
    {
        "id": 10,
        "name": "Carbon Veil",
        "price": "$190",
        "actual_price": 190.0,
        "img": "https://i.pinimg.com/736x/79/29/0f/79290fe785787fbc80dfc172cec8a747.jpg",
        "category": "Bottom",
        "sizes": ["S", "M", "L", "XL"],
        "rating": 4.5,
        "reviews": [
            {"user": "Айгуль", "review": "Удобные штаны, хороший материал!"},
            {"user": "Руслан", "review": "Хорошо сидят на фигуре."}
        ]
    },
    {
        "id": 18,
        "name": "Storm Lace",
        "price": "$190",
        "actual_price": 190.0,
        "img": "https://i.pinimg.com/736x/e9/77/fd/e977fdc73a66a8ac752dffc1660fa586.jpg",
        "category": "Shoes",
        "sizes": ["38", "39", "40", "41", "42"],
        "rating": 4.5,
        "reviews": [
            {"user": "Айгуль", "review": "Отличная обувь, очень комфортная!"},
            {"user": "Руслан", "review": "Немного мала, но в целом хорошая."}
        ]
    },
    {
        "id": 26,
        "name": "Gravity Haul",
        "price": "$190",
        "actual_price": 190.0,
        "img": "https://i.pinimg.com/736x/29/4c/ae/294caeb86113a5f2ce3709de419f2642.jpg",
        "category": "Bags",
        "sizes": ["M", "L", "XL"],
        "rating": 4.5,
        "reviews": [
            {"user": "Айжан", "review": "Очень стильный рюкзак, хорошее качество."},
            {"user": "Нурлан", "review": "Великолепный рюкзак, удобно носить."}
        ]
    },
    {
        "id": 34,
        "name": "Lunar Pin",
        "price": "$19",
        "actual_price": 19.0,
        "img": "https://i.pinimg.com/736x/aa/36/aa/aa36aa178cd579eaa7a07e89d43cee5c.jpg",
        "category": "Accessories",
        "sizes": ["S", "M", "L"],
        "rating": 4.5,
        "reviews": [
            {"user": "Айша", "review": "Очень удобный аксессуар, стильный и качественный."},
            {"user": "Мухаммед", "review": "Прекрасный товар, я доволен!"}
        ]
    },
    {
        "id": 44,
        "name": "Iris Link",
        "price": "$99",
        "actual_price": 99.0,
        "img": "https://i.pinimg.com/736x/49/df/d6/49dfd647994e9498fa1d437a92642f88.jpg",
        "category": "Jewelry",
        "sizes": ["S", "M", "L"],
        "rating": 4.7,
        "reviews": [
            {"user": "Анастасия", "review": "Очень стильное кольцо, рекомендую."},
            {"user": "Данияр", "review": "Отличное кольцо, идеально подошло!"}
        ]
    },
    {
        "id": 51,
        "name": "Amber Crest",
        "price": "$105",
        "actual_price": 105.0,
        "img": "https://i.pinimg.com/736x/d8/64/a4/d864a4b3087d9a08eb7ec0dd9b368ee2.jpg",
        "category": "Tops",
        "sizes": ["S", "M", "L"],
        "rating": 4.4,
        "reviews": [
            {"user": "Мария", "review": "Очень красивый топ, стильный и удобный."},
            {"user": "Алексей", "review": "Отличное качество, размер подошел."}
        ]
    },
    {
        "id": 59,
        "name": "Urban Mirage",
        "price": "$95",
        "actual_price": 95.0,
        "img": "https://i.pinimg.com/736x/f3/2b/02/f32b02389d0b77c8a6d7236b8f88ada0.jpg",
        "category": "More",
        "sizes": ["S", "M", "L"],
        "rating": 4.3,
        "reviews": [
            {"user": "Алина", "review": "Очень качественный продукт, удобно носить."},
            {"user": "Сергей", "review": "Цена соответствует качеству."}
        ]
    }
]

def import_sample_products():
    """
    Импортирует примеры товаров в базу данных.
    """
    # Создаем таблицы в базе данных (если они еще не созданы)
    Base.metadata.create_all(bind=engine)
    
    # Получаем сессию базы данных
    db = next(get_db())
    
    try:
        # Проверяем, есть ли уже товары в базе
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"В базе данных уже есть {existing_count} товаров.")
            decision = input("Вы хотите удалить существующие товары и импортировать новые? (y/n): ")
            if decision.lower() == 'y':
                # Удаляем все товары
                db.query(Product).delete()
                db.commit()
                print("Существующие товары удалены.")
            else:
                print("Импорт отменен.")
                return
        
        # Импортируем товары в базу данных
        for product in sample_products:
            # Создаем новую запись в базе данных
            db_product = Product(
                id=product['id'],
                name=product['name'],
                price=product['price'],
                actual_price=product['actual_price'],
                img=product['img'],
                category=product['category'],
                sizes=product['sizes'],
                rating=product['rating'],
                reviews=product['reviews'],
                description=None  # Описание может быть добавлено позже
            )
            
            db.add(db_product)
            print(f"Добавлен товар: {product['name']}")
        
        # Сохраняем изменения
        db.commit()
        print(f"Импорт завершен успешно. Добавлено {len(sample_products)} товаров.")
    
    except Exception as e:
        db.rollback()
        print(f"Ошибка при импорте данных: {e}")
    
    finally:
        db.close()

if __name__ == "__main__":
    import_sample_products()