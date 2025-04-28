from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from config import get_db
import services.user_service as user_service
from schemas.user import User, UserCreate, UserUpdate, Token

# Настройка OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/token")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Аутентификация и получение токена доступа"""
    user = user_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = user_service.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    db_user = user_service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    
    db_user = user_service.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")
    
    return user_service.create_user(db=db, user=user)

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Получение списка всех пользователей (только для админа)"""
    # Здесь должна быть проверка прав доступа
    users = user_service.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """Получение данных пользователя по ID"""
    # Здесь должна быть проверка прав доступа
    db_user = user_service.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return db_user

@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """Обновление данных пользователя"""
    # Здесь должна быть проверка прав доступа
    db_user = user_service.update_user(db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return db_user

@router.get("/me", response_model=User)
def read_users_me(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """Получение данных текущего пользователя"""
    # Здесь должна быть аутентификация по токену
    # и получение текущего пользователя
    # Этот метод требует доработки после реализации JWT аутентификации
    return {"username": "current_user"}  # Заглушка