from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from jose import JWTError, jwt

from config import get_db
import services.user_service as user_service
from schemas.user import User, UserCreate, UserUpdate, Token, TokenData

# Настройка OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/token")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Настройки безопасности - должны совпадать с user_service.py
SECRET_KEY = "YOUR_SECRET_KEY"  # Используйте тот же ключ, что и в user_service.py
ALGORITHM = "HS256"

router = APIRouter()

# Добавляем функцию получения текущего пользователя по токену
async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """
    Функция для получения текущего пользователя из токена
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Декодируем JWT токен
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    # Получаем пользователя из базы данных
    user = user_service.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    
    return user

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
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Получение списка всех пользователей (только для админа)"""
    # Здесь должна быть проверка прав доступа
    users = user_service.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Получение данных текущего пользователя"""
    return current_user

@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Получение данных пользователя по ID"""
    # Проверяем права доступа - пользователь может получать только свои данные
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для просмотра данных другого пользователя"
        )
    
    db_user = user_service.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return db_user

@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: int, 
    user: UserUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Обновление данных пользователя"""
    # Проверяем права доступа - пользователь может обновлять только свои данные
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для обновления данных другого пользователя"
        )
    
    try:
        # Вызываем сервис для обновления пользователя
        db_user = user_service.update_user(db, user_id=user_id, user=user)
        if db_user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/{user_id}/change-password", response_model=User)
def change_password(
    user_id: int,
    current_password: str,
    new_password: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Изменение пароля пользователя"""
    # Проверяем права доступа
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для изменения пароля другого пользователя"
        )
    
    # Проверяем текущий пароль и устанавливаем новый
    success = user_service.change_password(
        db, 
        user_id=user_id, 
        current_password=current_password, 
        new_password=new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Текущий пароль неверен"
        )
    
    # Возвращаем обновленные данные пользователя
    return user_service.get_user(db, user_id=user_id)