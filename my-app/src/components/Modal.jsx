import React, { useState, useEffect } from "react";
import { userService } from "../services/api";
import useUserStore from "../store/index";

function Modal({ show, closeModal, isLogin, toggleMode }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Используем setter из store
  const setUser = useUserStore(state => state.setUser);

  // Сбрасываем форму при изменении видимости или типа модального окна
  useEffect(() => {
    if (show) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      setRegistrationSuccess(false);
    }
  }, [show, isLogin]);

  // Не рендерим, если модальное окно не открыто
  if (!show) return null;

  // Валидация формы
  const validateForm = () => {
    // Сбрасываем предыдущую ошибку
    setErrorMessage("");
    
    // Проверка имени пользователя
    if (!username.trim()) {
      setErrorMessage("Введите имя пользователя");
      return false;
    }
    
    // Проверка email при регистрации
    if (!isLogin) {
      if (!email.trim()) {
        setErrorMessage("Введите email");
        return false;
      }
      
      // Простая валидация формата email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage("Введите корректный email");
        return false;
      }
      
      // Проверка пароля
      if (password.length < 8) {
        setErrorMessage("Пароль должен содержать не менее 8 символов");
        return false;
      }
      
      // Проверка совпадения паролей
      if (password !== confirmPassword) {
        setErrorMessage("Пароли не совпадают");
        return false;
      }
    } else {
      // Проверка пароля при входе
      if (!password) {
        setErrorMessage("Введите пароль");
        return false;
      }
    }
    
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Валидируем форму
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Вход пользователя
        const loginData = await userService.login(username, password);
        
        if (loginData && loginData.access_token) {
          localStorage.setItem("token", loginData.access_token);
          
          // Получаем данные пользователя
          try {
            const userData = await userService.getCurrentUser();
            setUser(userData);
            closeModal();
          } catch (userError) {
            console.error("Ошибка при получении данных пользователя:", userError);
            
            // Если не удалось получить данные, создаем базовый объект пользователя
            setUser({
              id: 1,
              username: username,
              email: email || "",
              is_active: true
            });
            
            closeModal();
          }
        } else {
          throw new Error("Не удалось получить токен авторизации");
        }
      } else {
        // Регистрация пользователя
        const registerData = {
          username,
          email,
          password,
          first_name: "",
          last_name: ""
        };
        
        await userService.register(registerData);
        // После успешной регистрации показываем сообщение об успехе
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(error.message || "Ошибка при авторизации. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAfterRegistration = async () => {
    setIsLoading(true);
    try {
      // Вход после регистрации
      const loginData = await userService.login(username, password);
      
      if (loginData && loginData.access_token) {
        localStorage.setItem("token", loginData.access_token);
        
        // Получаем данные пользователя после регистрации
        try {
          const userData = await userService.getCurrentUser();
          setUser(userData);
          closeModal();
        } catch (userError) {
          console.error("Ошибка при получении данных пользователя:", userError);
          // В случае ошибки создаем базовый объект пользователя
          setUser({
            id: 1,
            username: username,
            email: email,
            is_active: true
          });
          closeModal();
        }
      } else {
        throw new Error("Не удалось получить токен авторизации");
      }
    } catch (error) {
      console.error("Login after registration error:", error);
      setErrorMessage("Ошибка при входе после регистрации. Пожалуйста, попробуйте войти вручную.");
      // Переключаемся на форму входа
      setRegistrationSuccess(false);
      if (toggleMode) toggleMode();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal} aria-label="Закрыть">
          &times;
        </button>
        
        {registrationSuccess ? (
          <div className="registration-success">
            <h2>Регистрация успешна!</h2>
            <p>Ваш аккаунт был успешно создан. Теперь вы можете войти с вашими учетными данными.</p>
            <button 
              className="auth-button"
              onClick={handleLoginAfterRegistration}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Войти сейчас"}
            </button>
            <button 
              className="secondary-button"
              onClick={closeModal}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
            
            {errorMessage && <div className="auth-error">{errorMessage}</div>}
            
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                  disabled={isLoading}
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  disabled={isLoading}
                  minLength={isLogin ? 1 : 8}
                  required
                />
                {!isLogin && <small>Минимум 8 символов</small>}
              </div>
              
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>
            
            <div className="auth-toggle">
              <p>
                {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                <button 
                  type="button" 
                  className="toggle-form-button"
                  onClick={toggleMode}
                  disabled={isLoading}
                >
                  {isLogin ? "Зарегистрироваться" : "Войти"}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Modal;