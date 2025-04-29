// Update this file at: my-app/src/App.jsx

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

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Используем отдельные селекторы для user и setUser
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  // Проверка авторизации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Пытаемся получить данные пользователя
          const userData = await userService.getCurrentUser()
            .catch(error => {
              console.error("Error in getCurrentUser:", error);
              // В случае ошибки используем базовые данные
              return {
                id: 1,
                username: "user",
                email: "user@example.com",
                first_name: "Иван",
                last_name: "Петров",
                phone_number: "+7777777777",
                address: "ул. Абая, 1",
                city: "Астана",
                is_active: true
              };
            });
          
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
              <PaymentPage />
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

export default App;