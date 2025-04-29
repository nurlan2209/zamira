import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import CatalogPage from "./components/CatalogPage";
import ProductPage from "./components/ProductPage";
import PaymentPage from "./components/PaymentPage";
import ProfilePage from "./components/ProfilePage";
import AuthPage from "./components/AuthPage";
import Modal from "./components/Modal";
import useUserStore from "./store/index";
import { userService } from "./services/api";
import "./App.css";

// Вынесем функцию refreshUserAuth за пределы компонента
// чтобы можно было экспортировать её корректно
let refreshUserAuthGlobal = null;

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Используем отдельные селекторы для user и setUser
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  // Функция для обновления аутентификации
  const refreshUserAuth = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Если токена нет, пользователь не авторизован
      setUser(null);
      return false;
    }
    
    try {
      // Проверяем валидность токена
      const userData = await userService.getCurrentUser();
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении данных пользователя:", error);
      
      // Если токен недействителен, очищаем его
      if (error.message && (
          error.message.includes("401") || 
          error.message.includes("Unauthorized") || 
          error.message.includes("токен")
      )) {
        localStorage.removeItem("token");
        setUser(null);
        setAuthError("Время сессии истекло или токен недействителен. Пожалуйста, войдите снова.");
      }
      
      return false;
    }
  };

  // Сохраняем функцию в глобальную переменную для экспорта
  refreshUserAuthGlobal = refreshUserAuth;

  // Проверка авторизации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Пытаемся получить данные пользователя
          const userData = await userService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Ошибка авторизации:", error);
          // Очистка невалидного токена
          localStorage.removeItem("token");
          setAuthError("Время сессии истекло или токен недействителен. Пожалуйста, войдите снова.");
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [setUser]); // Используем только setUser в зависимостях

  const openModal = (isLoginForm) => {
    setIsLogin(isLoginForm);
    setShowModal(true);
    setAuthError(null); // Сбрасываем ошибку при открытии модального окна
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Функция для переключения между входом и регистрацией в модальном окне
  const toggleModalMode = () => {
    setIsLogin(!isLogin);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  
  // Компонент для защищенных маршрутов
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      );
    }
    
    return user ? children : <Navigate to="/auth" />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <Router>
      {authError && (
        <div className="auth-notification">
          <p>{authError}</p>
          <button onClick={() => openModal(true)}>Войти</button>
          <button onClick={() => setAuthError(null)}>✕</button>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<HomePage openModal={openModal} user={user} onLogout={handleLogout} />} />
        <Route path="/catalog" element={<CatalogPage user={user} onLogout={handleLogout} />} />
        <Route path="/product/:id" element={<ProductPage user={user} onLogout={handleLogout} />} />
        <Route 
          path="/payment" 
          element={
            <PrivateRoute>
              <PaymentPage refreshAuth={refreshUserAuth} />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Модальное окно для регистрации/входа */}
      <Modal
        show={showModal}
        closeModal={closeModal}
        isLogin={isLogin}
        toggleMode={toggleModalMode}
      />
    </Router>
  );
}

// Экспортируем функцию для использования в других компонентах
export const refreshUserAuth = async (...args) => {
  if (refreshUserAuthGlobal) {
    return refreshUserAuthGlobal(...args);
  }
  // Если функция еще не инициализирована
  console.warn('refreshUserAuth вызвана до инициализации App');
  return false;
};

export default App;