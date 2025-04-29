import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

/**
 * Компонент шапки сайта с навигацией и управлением авторизацией
 * Обернут в React.memo для предотвращения ненужных перерисовок
 */
const Header = memo(({ user, onLogout, openModal, handleCategoryChange }) => {
  const navigate = useNavigate();

  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  const onCategoryClick = (e, category) => {
    e.preventDefault();
    if (handleCategoryChange) {
      handleCategoryChange(category);
    }
  };

  return (
    <header className="fixed-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">MØRK</Link>
        </div>
        
        <nav>
          <ul className="nav-links">
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "Jewelry")}>
                Jewelry
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "Bags")}>
                Bags
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "Tops")}>
                Tops
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "All")}>
                All
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "Hoodies")}>
                Hoodies
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "Bottom")}>
                Bottom
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "Accessories")}>
                Accessories
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => onCategoryClick(e, "More")}>
                More
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="auth-controls">
          {user ? (
            <div className="user-menu">
              <span className="username">Привет, {user.username || user.first_name}</span>
              <button className="profile-button" onClick={() => navigate("/profile")}>
                Профиль
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-button" onClick={() => openModal && openModal(true)}>
                Войти
              </button>
              <button className="register-button" onClick={() => openModal && openModal(false)}>
                Регистрация
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

// Добавляем displayName для отладки
Header.displayName = 'Header';

export default Header;