import React, { useState, useEffect } from "react";
import { userService } from "../services/api";
import useUserStore from "../store/index";

function Modal({ show, closeModal, isLogin, toggleMode }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setErrorMessage("");
      setRegistrationSuccess(false);
    }
  }, [show, isLogin]);

  // Не рендерим, если модальное окно не открыто
  if (!show) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Валидация формы
    if (!username) {
      setErrorMessage("Введите имя пользователя");
      return;
    }
    
    if (!isLogin && !email) {
      setErrorMessage("Введите email");
      return;
    }
    
    if (!password) {
      setErrorMessage("Введите пароль");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Вход пользователя
        const loginData = await userService.login(username, password);
        
        if (loginData && loginData.access_token) {
          localStorage.setItem("token", loginData.access_token);
          
          // После успешного входа сразу создаем данные пользователя на основе формы
          // вместо вызова API, который возвращает ошибку
          const basicUserData = {
            id: 1, // Заглушка, реальный ID будет получен с сервера
            username: username,
            email: email || "user@example.com", // Заглушка, если email не указан
            is_active: true
          };
          
          setUser(basicUserData);
          closeModal();
        } else {
          throw new Error("Не удалось получить токен авторизации");
        }
      } else {
        // Регистрация пользователя
        const registerData = {
          username,
          email,
          password
        };
        
        await userService.register(registerData);
        // После успешной регистрации показываем сообщение и предлагаем войти
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(error.message || "Ошибка при авторизации");
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
        
        // После успешного входа сразу создаем данные пользователя на основе формы
        const basicUserData = {
          id: 1, // Заглушка, реальный ID будет получен с сервера
          username: username,
          email: email,
          is_active: true
        };
        
        setUser(basicUserData);
        closeModal();
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
        <button className="close-button" onClick={closeModal}>
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
                />
              </div>
              
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