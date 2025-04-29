from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional

from models.user import User
from schemas.user import UserCreate, UserUpdate

# Настройки безопасности
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "YOUR_SECRET_KEY"  # В реальном проекте нужно использовать переменные окружения
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_user(db: Session, user_id: int):
    """Получение пользователя по ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    """Получение пользователя по email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    """Получение пользователя по username"""
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Получение списка пользователей"""
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    """Создание нового пользователя"""
    # Проверяем, что пользователя с таким email или username нет
    if get_user_by_email(db, user.email) or get_user_by_username(db, user.username):
        return None
    
    # Хешируем пароль
    hashed_password = pwd_context.hash(user.password)
    
    # Создаем пользователя
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        address=user.address,
        city=user.city
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise e

def update_user(db: Session, user_id: int, user: UserUpdate):
    """Обновление данных пользователя"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user.dict(exclude_unset=True)
    
    # Если обновляется email, проверяем, что такой email не используется другим пользователем
    if "email" in update_data and update_data["email"] != db_user.email:
        existing_user = get_user_by_email(db, update_data["email"])
        if existing_user and existing_user.id != user_id:
            raise ValueError("Email уже используется другим пользователем")
    
    # Если обновляется username, проверяем, что такой username не используется другим пользователем        
    if "username" in update_data and update_data["username"] != db_user.username:
        existing_user = get_user_by_username(db, update_data["username"])
        if existing_user and existing_user.id != user_id:
            raise ValueError("Имя пользователя уже занято")
    
    # Хешируем пароль, если он был передан
    if "password" in update_data:
        update_data["hashed_password"] = pwd_context.hash(update_data.pop("password"))
    
    try:
        # Обновляем поля объекта
        for key, value in update_data.items():
            if hasattr(db_user, key):  # Проверяем, существует ли такое поле
                setattr(db_user, key, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise e

def authenticate_user(db: Session, username: str, password: str):
    """Аутентификация пользователя"""
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def verify_password(plain_password, hashed_password):
    """Проверка пароля"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создание JWT токена"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def change_password(db: Session, user_id: int, current_password: str, new_password: str):
    """Изменение пароля пользователя"""
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    # Проверяем текущий пароль
    if not verify_password(current_password, db_user.hashed_password):
        return False
    
    # Хешируем новый пароль
    db_user.hashed_password = pwd_context.hash(new_password)
    
    try:
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e