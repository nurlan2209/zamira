import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Используем useLocation для получения данных, переданных через navigate
import "../App.css";

export default function PaymentPage() {
  const location = useLocation(); // Получаем переданные данные
  const { product, selectedSize } = location.state || {}; // Извлекаем товар и выбранный размер

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const navigate = useNavigate(); // Для навигации обратно на главную страницу

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentSuccess(true); // Платеж успешен
  };

  const handleGoHome = () => {
    navigate("/"); // Переход на главную страницу
  };

  return (
    <div className="payment-page">
      <h1>Оплата</h1>

      {paymentSuccess ? (
        <div className="payment-success">
          <h2>Платеж успешно завершен!</h2>
          <button onClick={handleGoHome} className="go-home-button">
            Вернуться на главную
          </button>
        </div>
      ) : (
        <div className="payment-content">
          {/* Форма оплаты */}
          <form onSubmit={handleSubmit} className="payment-form">
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

            <button type="submit" className="submit-button">
              Завершить оплату
            </button>
          </form>

          {/* Отображение выбранного товара */}
          {product && (
            <div className="product-summary">
              <h3>Ваш заказ</h3>
              <div className="product-info">
                <img
                  src={product.img}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p className="price">{product.price} ₸</p>
                  <p>Размер: {selectedSize}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
