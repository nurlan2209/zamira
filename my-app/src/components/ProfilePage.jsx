import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userService, orderService } from "../services/api";
import useUserStore from "../store/index";
import OrderHistory from "./OrderHistory";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  
  // Получаем активную вкладку из состояния навигации (если есть)
  const initialTab = location.state?.activeTab || "profile";
  
  // Состояния для отображения данных пользователя и их редактирования
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    city: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordChangeMode, setIsPasswordChangeMode] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab); // profile, orders, settings
  const [orders, setOrders] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false); // Состояние для обновления списка заказов
  
  // Загрузка данных пользователя при монтировании компонента или при изменении user
  useEffect(() => {
    // Проверяем наличие пользователя
    const fetchUserData = async () => {
      if (!user) {
        navigate("/");
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Устанавливаем данные из текущего пользователя в состояние компонента
        setUserData({
          username: user.username || "",
          email: user.email || "",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          phone_number: user.phone_number || "",
          address: user.address || "",
          city: user.city || ""
        });
        
        // Получаем заказы пользователя
        try {
          const userOrders = await orderService.getUserOrders();
          setOrders(userOrders);
        } catch (ordersError) {
          console.error("Error fetching orders:", ordersError);
          // Используем пустой массив заказов для отображения
          setOrders([]);
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        setError("Ошибка при загрузке данных. Попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, refreshOrders]); // Добавляем refreshOrders в зависимости

  // Обработчик для обновления списка заказов
  const handleRefreshOrders = () => {
    setRefreshOrders(prev => !prev);
  };

  // Обработчик для переключения режима редактирования
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setError("");
    setSuccess("");
  };

  // Обработчик для переключения режима изменения пароля
  const togglePasswordChangeMode = () => {
    setIsPasswordChangeMode(!isPasswordChangeMode);
    setPasswords({
      current: "",
      new: "",
      confirm: ""
    });
    setError("");
    setSuccess("");
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик изменения полей пароля
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы с данными пользователя
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      setIsLoading(true);
      
      console.log("Отправка данных на сервер:", userData);
      
      // Обновление данных пользователя через API
      const updatedUser = await userService.updateUser(user.id, userData);
      
      // Обновляем данные пользователя в хранилище Zustand
      setUser(updatedUser);
      
      // Закрываем режим редактирования и показываем сообщение об успехе
      setIsEditMode(false);
      setSuccess("Данные успешно обновлены!");
      
      console.log("Данные пользователя успешно обновлены:", updatedUser);
    } catch (err) {
      console.error("Ошибка при обновлении данных:", err);
      setError(`Ошибка при обновлении данных: ${err.message || "Неизвестная ошибка"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик отправки формы изменения пароля
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Проверка совпадения паролей
    if (passwords.new !== passwords.confirm) {
      setError("Новые пароли не совпадают");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Вызов API для изменения пароля
      await userService.changePassword(user.id, passwords.current, passwords.new);
      
      setIsPasswordChangeMode(false);
      setSuccess("Пароль успешно изменен!");
      
      // Сбрасываем поля пароля
      setPasswords({
        current: "",
        new: "",
        confirm: ""
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Ошибка при изменении пароля. Возможно, текущий пароль введен неверно.");
    } finally {
      setIsLoading(false);
    }
  };

  // Отображаем загрузку
  if (isLoading && !userData.username) {
    return (
      <div className="profile-container">
        <div className="loading-spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Личный кабинет</h1>
        <div className="profile-tabs">
          <button 
            className={activeTab === "profile" ? "tab-active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Профиль
          </button>
          <button 
            className={activeTab === "orders" ? "tab-active" : ""}
            onClick={() => {
              setActiveTab("orders");
              handleRefreshOrders(); // Обновляем список заказов при переключении на вкладку
            }}
          >
            Мои заказы
          </button>
          <button 
            className={activeTab === "settings" ? "tab-active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Настройки
          </button>
        </div>
      </div>

      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}

      {activeTab === "profile" && (
        <div className="profile-section">
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  disabled
                  className="profile-input"
                />
                <small>Имя пользователя нельзя изменить</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled
                  className="profile-input"
                />
                <small>Email нельзя изменить</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="first_name">Имя</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Фамилия</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone_number">Номер телефона</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Адрес</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="city">Город</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              
              <div className="profile-buttons">
                <button type="submit" className="profile-button save-button">
                  {isLoading ? "Сохранение..." : "Сохранить"}
                </button>
                <button 
                  type="button" 
                  className="profile-button cancel-button"
                  onClick={toggleEditMode}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {userData.first_name && userData.last_name 
                    ? userData.first_name[0] + userData.last_name[0] 
                    : userData.username ? userData.username[0].toUpperCase() : "U"}
                </div>
              </div>
              
              <div className="profile-details">
                <h2>{userData.first_name} {userData.last_name || userData.username}</h2>
                
                <div className="info-row">
                  <span className="info-label">Имя пользователя:</span>
                  <span className="info-value">{userData.username}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userData.email}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Телефон:</span>
                  <span className="info-value">{userData.phone_number || "Не указан"}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Адрес:</span>
                  <span className="info-value">{userData.address || "Не указан"}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Город:</span>
                  <span className="info-value">{userData.city || "Не указан"}</span>
                </div>
                
                <button 
                  className="profile-button edit-button"
                  onClick={toggleEditMode}
                >
                  Редактировать
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="orders-section">
          <div className="refresh-orders-container">
            <button 
              className="refresh-orders-button"
              onClick={handleRefreshOrders}
              disabled={isLoading}
            >
              {isLoading ? "Обновление..." : "Обновить заказы"}
            </button>
          </div>
          <OrderHistory orders={orders} />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="profile-section settings-section">
          <h2>Настройки аккаунта</h2>
          
          <div className="setting-card">
            <h3>Изменение пароля</h3>
            
            {isPasswordChangeMode ? (
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="current">Текущий пароль</label>
                  <input
                    type="password"
                    id="current"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    required
                    className="profile-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="new">Новый пароль</label>
                  <input
                    type="password"
                    id="new"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    required
                    className="profile-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirm">Подтвердите новый пароль</label>
                  <input
                    type="password"
                    id="confirm"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    required
                    className="profile-input"
                  />
                </div>
                
                <div className="profile-buttons">
                  <button type="submit" className="profile-button save-button">
                    {isLoading ? "Изменение..." : "Изменить пароль"}
                  </button>
                  <button 
                    type="button" 
                    className="profile-button cancel-button"
                    onClick={togglePasswordChangeMode}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <div className="setting-content">
                <p>Здесь вы можете изменить пароль от вашего аккаунта.</p>
                <button 
                  className="profile-button"
                  onClick={togglePasswordChangeMode}
                >
                  Изменить пароль
                </button>
              </div>
            )}
          </div>
          
          <div className="setting-card">
            <h3>Настройки уведомлений</h3>
            <div className="setting-content">
              <div className="setting-option">
                <label className="toggle-label">
                  <input type="checkbox" className="toggle-input" />
                  <span className="toggle-slider"></span>
                  <span>Получать email о новых акциях</span>
                </label>
              </div>
              
              <div className="setting-option">
                <label className="toggle-label">
                  <input type="checkbox" className="toggle-input" defaultChecked />
                  <span className="toggle-slider"></span>
                  <span>Уведомления о статусе заказа</span>
                </label>
              </div>
              
              <div className="setting-option">
                <label className="toggle-label">
                  <input type="checkbox" className="toggle-input" />
                  <span className="toggle-slider"></span>
                  <span>Уведомления о новых товарах</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="setting-card danger-zone">
            <h3>Опасная зона</h3>
            <div className="setting-content">
              <p>Удаление аккаунта приведет к безвозвратной потере всех данных.</p>
              <button className="profile-button delete-button">
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;