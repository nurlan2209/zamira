import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCodePayment from "../../src/components/QRCodePayment";
import { orderService } from "../services/api";
import useUserStore from "../store/index";
import Header from "./Header";
import "../App.css";
import "../styles/QRCodePayment.css";
import "../styles/PaymentPage.css";

export default function PaymentPage({ refreshAuth }) {
  const location = useLocation();
  const { product, selectedSize } = location.state || {};
  const user = useUserStore((state) => state.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const navigate = useNavigate();

  // Заполняем форму данными пользователя, если они доступны
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phone_number || "");
      setAddress(user.address || "");
      setCity(user.city || "");
    }
  }, [user]);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    // Проверяем форму на валидность
    if (!firstName || !lastName || !email || !phoneNumber || !address || !city) {
      alert("Пожалуйста, заполните все поля формы");
      return;
    }
    
    // Показываем QR-код для оплаты
    setShowQRCode(true);
  };

  // Обработчик успешной оплаты
// Обработчик успешной оплаты
const handlePaymentSuccess = async (success = true) => {
  const user = useUserStore.getState().user; // Получаем пользователя из хранилища
  if (!user || !user.id) {
    throw new Error("Информация о пользователе недоступна. Пожалуйста, войдите снова.");
  }
  const userId = user.id;
  if (success) {
    setIsLoading(true);
    setError("");
    
    try {
      // Перед созданием заказа обновляем данные аутентификации
      if (refreshAuth) {
        const isAuthenticated = await refreshAuth();
        if (!isAuthenticated) {
          throw new Error("Необходимо войти в систему для создания заказа");
        }
      }
      
      // Формируем данные заказа в соответствии с ожиданиями бэкенда
      const orderData = {
        "user_id": userId,
        "shipping_address": `${city}, ${address}`,
        "payment_details": {
          "payment_method": "qr_code",
          "first_name": firstName,
          "last_name": lastName,
          "email": email,
          "phone_number": phoneNumber
        },
        "items": [
          {
            "product_id": product.id,
            "quantity": 1,
            "selected_size": selectedSize
          }
        ]
      };
      
      console.log("Отправка заказа с данными:", orderData);
      
      // Проверка валидности токена перед отправкой заказа
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Отсутствует токен авторизации. Пожалуйста, войдите снова.");
      }
      
      try {
        // Отправляем заказ на сервер
        const response = await orderService.createOrder(orderData);
        console.log("Заказ успешно создан:", response);
        
        // Сохраняем номер заказа для отображения
        setOrderNumber(response.id || "Новый");
        
        // Устанавливаем состояние успешной оплаты
        setPaymentSuccess(true);
        setShowQRCode(false);
      } catch (orderError) {
        console.error("Ошибка при создании заказа:", orderError);
        
        // Более детальное логирование ошибки
        if (orderError.name === 'TypeError' && orderError.message.includes('Failed to fetch')) {
          console.error("Проблема сетевого соединения. Проверьте, запущен ли сервер бэкенда.");
          setError("Ошибка соединения с сервером. Пожалуйста, проверьте подключение к интернету и убедитесь, что сервер запущен.");
        } else {
          setError("Произошла ошибка при создании заказа: " + (orderError.message || "Неизвестная ошибка"));
        }
        
        // Все равно показываем успешную оплату,
        // но с информацией о проблеме с созданием заказа
        setPaymentSuccess(true);
        setShowQRCode(false);
        setOrderNumber("Обрабатывается");
      }
    } catch (authError) {
      console.error("Ошибка авторизации:", authError);
      setError("Ошибка авторизации: " + (authError.message || "Необходимо войти в систему"));
      
      // В случае ошибки аутентификации, предлагаем пользователю войти снова
      if (authError.message && (authError.message.includes("аутентифицирован") || 
          authError.message.includes("Unauthorized") ||
          authError.message.includes("токен") ||
          authError.message.includes("войти"))) {
        // Сохраняем данные для возврата после авторизации
        const paymentData = {
          product,
          selectedSize,
          shippingInfo: {
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            city
          }
        };
        
        // Перенаправляем на страницу аутентификации
        localStorage.removeItem("token"); // Удаляем недействительный токен
        navigate("/auth", { state: { returnUrl: "/payment", paymentData } });
        return;
      }
      
      // Показываем успешную оплату несмотря на ошибку с созданием заказа
      setPaymentSuccess(true);
      setShowQRCode(false);
      setOrderNumber("Обрабатывается");
    } finally {
      setIsLoading(false);
    }
  } else {
    // Пользователь отменил платеж
    setShowQRCode(false);
  }
};

  // Возврат на главную страницу
  const handleGoHome = () => {
    navigate("/");
  };

  // Переход к профилю с заказами
  const handleGoToOrders = () => {
    navigate("/profile", { state: { activeTab: "orders" } });
  };

  // Если нет продукта, перенаправляем на главную
  if (!product && !paymentSuccess) {
    return (
      <div className="payment-page-container">
        <Header user={user} />
        <div className="payment-page">
          <h1>Ошибка оформления заказа</h1>
          <p>Информация о товаре отсутствует. Пожалуйста, выберите товар для заказа.</p>
          <button onClick={handleGoHome} className="go-home-button">
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <Header user={user} />
      <div className="payment-page">
        <h1>Оформление заказа</h1>

        {error && <div className="payment-error">{error}</div>}

        {paymentSuccess ? (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2>Платеж успешно завершен!</h2>
            <p>Спасибо за покупку! Ваш заказ успешно оформлен.</p>
            <p>Номер заказа: #{orderNumber}</p>
            <div className="payment-success-buttons">
              <button onClick={handleGoToOrders} className="view-orders-button">
                Посмотреть мои заказы
              </button>
              <button onClick={handleGoHome} className="go-home-button">
                Вернуться на главную
              </button>
            </div>
          </div>
        ) : (
          <div className="payment-content">
            <form onSubmit={handleSubmit} className="payment-form">
              <h2>Данные получателя</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Имя</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Фамилия</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Введите вашу фамилию"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Электронная почта</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Введите ваш email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Номер телефона</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder="Введите номер телефона"
                  />
                </div>
              </div>

              <h3>Адрес доставки</h3>
              
              <div className="form-group">
                <label htmlFor="address">Улица, дом, квартира</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Введите адрес доставки"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Город</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Введите город"
                />
              </div>

              <h3>Способ оплаты</h3>
              <div className="payment-methods">
                <div className="payment-method">
                  <input 
                    type="radio" 
                    id="qr-payment" 
                    name="payment-method" 
                    checked 
                    readOnly
                  />
                  <label htmlFor="qr-payment">Оплата QR-кодом</label>
                  <p className="payment-method-description">
                    Оплатите заказ, отсканировав QR-код через приложение вашего банка
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button" 
                disabled={isLoading}
              >
                {isLoading ? "Загрузка..." : "Перейти к оплате"}
              </button>
            </form>

            {/* Отображение выбранного товара */}
            {product && (
              <div className="product-summary">
                <h2>Ваш заказ</h2>
                <div className="product-info">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description || "Стильный товар из новой коллекции"}</p>
                    <p className="product-size">Размер: {selectedSize}</p>
                    <p className="product-price">{product.price}</p>
                  </div>
                </div>

                {/* Сводка заказа */}
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Товар:</span>
                    <span>{product.price}</span>
                  </div>
                  <div className="summary-row">
                    <span>Доставка:</span>
                    <span>Бесплатно</span>
                  </div>
                  <div className="summary-row total">
                    <span>Итого:</span>
                    <span>{product.price}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Модальное окно с QR-кодом для оплаты */}
        {showQRCode && (
          <div className="modal-overlay">
            <button className="modal-close" onClick={() => setShowQRCode(false)}>×</button>
            <QRCodePayment 
              product={product}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowQRCode(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}