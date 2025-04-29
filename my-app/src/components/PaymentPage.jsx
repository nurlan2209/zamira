import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCodePayment from "./QRCodePayment";
import "../App.css";
import "../styles/QRCodePayment.css";

export default function PaymentPage() {
  const location = useLocation(); // Получаем переданные данные
  const { product, selectedSize } = location.state || {}; // Извлекаем товар и выбранный размер

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // Состояние для отображения QR-кода

  const navigate = useNavigate(); // Для навигации обратно на главную страницу

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
  const handlePaymentSuccess = (success = true) => {
    if (success) {
      setPaymentSuccess(true);
      setShowQRCode(false);
    } else {
      // Пользователь отменил платеж
      setShowQRCode(false);
    }
  };

  // Возврат на главную страницу
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="payment-page">
      <h1>Оформление заказа</h1>

      {paymentSuccess ? (
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h2>Платеж успешно завершен!</h2>
          <p>Спасибо за покупку! Ваш заказ успешно оформлен.</p>
          <p>Номер заказа: #{Math.floor(Math.random() * 10000)}</p>
          <button onClick={handleGoHome} className="go-home-button">
            Вернуться на главную
          </button>
        </div>
      ) : (
        <div className="payment-content">
          {/* Форма оплаты */}
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

            <button type="submit" className="submit-button">
              Перейти к оплате
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
  );
}