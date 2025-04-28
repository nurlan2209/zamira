"""
Скрипт для импорта товаров из фронтенда в базу данных PostgreSQL.
"""
import re
import ast
from sqlalchemy.orm import Session

from config import get_db, engine, Base
from models.product import Product

# Создание таблиц в базе данных
Base.metadata.create_all(bind=engine)

def extract_products(file_path):
    """
    Извлекает данные о товарах из JS файла фронтенда.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Находим массив товаров
    start_index = content.find("const products = [")
    if start_index == -1:
        print("Не удалось найти массив товаров в файле.")
        return []
    
    # Находим конец массива
    bracket_level = 0
    in_array = False
    start_pos = start_index + len("const products = ")
    for i, char in enumerate(content[start_pos:], start=start_pos):
        if char == '[' and not in_array:
            in_array = True
            bracket_level += 1
        elif char == '[':
            bracket_level += 1
        elif char == ']':
            bracket_level -= 1
            if bracket_level == 0 and in_array:
                end_pos = i + 1
                break
    
    if not in_array or bracket_level != 0:
        print("Не удалось найти конец массива товаров.")
        return []
    
    products_array_text = content[start_pos:end_pos]
    
    # Парсим товары вручную
    products = []
    current_product = {}
    in_product = False
    current_field = None
    current_value = ""
    in_string = False
    escaped = False
    
    # Заменим одинарные кавычки на двойные для полей и значений
    products_array_text = products_array_text.replace("'", '"')
    
    # Находим отдельные товары с помощью регулярного выражения
    product_pattern = r'\{\s*"id":\s*(\d+),\s*"name":\s*"([^"]+)",\s*"price":\s*"([^"]+)",\s*"img":\s*"([^"]+)",\s*"category":\s*"([^"]+)"(?:,\s*"sizes":\s*(\[[^\]]+\]))?(?:,\s*"rating":\s*([^,]+))?(?:,\s*"reviews":\s*(\[[^\]]+\]))?'
    
    matches = re.finditer(product_pattern, products_array_text)
    for match in matches:
        product = {
            'id': int(match.group(1)),
            'name': match.group(2),
            'price': match.group(3),
            'img': match.group(4),
            'category': match.group(5),
        }
        
        # Попробуем извлечь размеры
        if match.group(6):
            try:
                # Удаляем одинарные кавычки и заменяем на двойные для корректного JSON
                sizes_text = match.group(6).replace("'", '"')
                product['sizes'] = ast.literal_eval(sizes_text)
            except:
                product['sizes'] = []
        else:
            product['sizes'] = []
        
        # Попробуем извлечь рейтинг
        if match.group(7):
            try:
                product['rating'] = float(match.group(7))
            except:
                product['rating'] = 0.0
        else:
            product['rating'] = 0.0
        
        # Попробуем извлечь отзывы
        if match.group(8):
            try:
                # Просто сохраняем как строку, позже преобразуем в JSON
                reviews_text = match.group(8)
                # Преобразуем отзывы к формату JSON
                reviews = []
                review_pattern = r'\{\s*"user":\s*"([^"]+)",\s*"review":\s*"([^"]+)"\s*\}'
                review_matches = re.finditer(review_pattern, reviews_text)
                for review_match in review_matches:
                    review = {
                        'user': review_match.group(1),
                        'review': review_match.group(2)
                    }
                    reviews.append(review)
                product['reviews'] = reviews
            except Exception as e:
                print(f"Ошибка при парсинге отзывов: {e}")
                product['reviews'] = []
        else:
            product['reviews'] = []
        
        products.append(product)
    
    print(f"Найдено {len(products)} товаров.")
    return products

def import_products():
    """
    Импортирует товары в базу данных.
    """
    # Путь к файлу с компонентом ProductPage.jsx, где содержатся все товары
    file_path = "../my-app/src/components/ProductPage.jsx"
    
    # Извлекаем товары из файла
    products = extract_products(file_path)
    
    if not products:
        print("Не удалось найти товары или произошла ошибка при парсинге.")
        return
    
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
        for product in products:
            # Извлекаем числовое значение цены
            price_str = product['price']
            # Убираем символ доллара и преобразуем в число
            actual_price = float(price_str.replace('$', ''))
            
            # Создаем новую запись в базе данных
            db_product = Product(
                id=product['id'],
                name=product['name'],
                price=product['price'],
                actual_price=actual_price,
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
        print(f"Импорт завершен успешно. Добавлено {len(products)} товаров.")
    
    except Exception as e:
        db.rollback()
        print(f"Ошибка при импорте данных: {e}")
    
    finally:
        db.close()

if __name__ == "__main__":
    import_products()