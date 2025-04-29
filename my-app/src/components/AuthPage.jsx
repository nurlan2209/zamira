import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";
import useUserStore from "../store/index";
import "../App.css";

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage("");
  };

  const validateForm = () => {
    setErrorMessage("");
    
    if (!username) {
      setErrorMessage("Пожалуйста, введите имя пользователя");
      return false;
    }
    
    if (!isLoginMode && !email) {
      setErrorMessage("Пожалуйста, введите email");
      return false;
    }
    
    if (!password) {
      setErrorMessage("Пожалуйста, введите пароль");
      return false;
    }
    
    if (!isLoginMode && password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        // Вход
        const response = await userService.login(username, password);
        localStorage.setItem("token", response.access_token);
        
        // Получение данных пользователя
        const userData = await userService.getCurrentUser();
        setUser(userData);
        
        navigate("/");
      } else {
        // Регистрация
        const userData = {
          username,
          email,
          password,
        };
        
        await userService.register(userData);
        setIsLoginMode(true);
        setErrorMessage("Регистрация успешна! Теперь вы можете войти.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Произошла ошибка. Пожалуйста, попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">{isLoginMode ? "Вход" : "Регистрация"}</h1>
        
        {errorMessage && <div className="auth-error">{errorMessage}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : isLoginMode ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        
        <div className="auth-toggle">
          <p>
            {isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            <button
              type="button"
              className="toggle-button"
              onClick={toggleMode}
            >
              {isLoginMode ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;