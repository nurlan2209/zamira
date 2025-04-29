import React, { useState, useEffect } from 'react';
import '../styles/QRCodePayment.css';

const QRCodePayment = ({ onSuccess, product, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(20); // 20 секунд на оплату
  const [isExpired, setIsExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // QR-код (это заглушка, в реальном приложении здесь будет генерироваться настоящий QR-код)
  const qrCodeUrl = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 200 200' stroke='none'%3e%3crect width='200' height='200' fill='%23ffffff'/%3e%3cdefs%3e%3crect id='p' width='8' height='8'/%3e%3c/defs%3e%3cg fill='%23000000'%3e%3cuse x='32' y='32' href='%23p'/%3e%3cuse x='32' y='40' href='%23p'/%3e%3cuse x='32' y='48' href='%23p'/%3e%3cuse x='32' y='56' href='%23p'/%3e%3cuse x='32' y='64' href='%23p'/%3e%3cuse x='32' y='72' href='%23p'/%3e%3cuse x='32' y='80' href='%23p'/%3e%3cuse x='40' y='32' href='%23p'/%3e%3cuse x='40' y='80' href='%23p'/%3e%3cuse x='48' y='32' href='%23p'/%3e%3cuse x='48' y='48' href='%23p'/%3e%3cuse x='48' y='56' href='%23p'/%3e%3cuse x='48' y='64' href='%23p'/%3e%3cuse x='48' y='80' href='%23p'/%3e%3cuse x='56' y='32' href='%23p'/%3e%3cuse x='56' y='48' href='%23p'/%3e%3cuse x='56' y='56' href='%23p'/%3e%3cuse x='56' y='64' href='%23p'/%3e%3cuse x='56' y='80' href='%23p'/%3e%3cuse x='64' y='32' href='%23p'/%3e%3cuse x='64' y='48' href='%23p'/%3e%3cuse x='64' y='56' href='%23p'/%3e%3cuse x='64' y='64' href='%23p'/%3e%3cuse x='64' y='80' href='%23p'/%3e%3cuse x='72' y='32' href='%23p'/%3e%3cuse x='72' y='80' href='%23p'/%3e%3cuse x='80' y='32' href='%23p'/%3e%3cuse x='80' y='40' href='%23p'/%3e%3cuse x='80' y='48' href='%23p'/%3e%3cuse x='80' y='56' href='%23p'/%3e%3cuse x='80' y='64' href='%23p'/%3e%3cuse x='80' y='72' href='%23p'/%3e%3cuse x='80' y='80' href='%23p'/%3e%3cuse x='32' y='88' href='%23p'/%3e%3cuse x='48' y='88' href='%23p'/%3e%3cuse x='72' y='88' href='%23p'/%3e%3cuse x='96' y='32' href='%23p'/%3e%3cuse x='96' y='48' href='%23p'/%3e%3cuse x='96' y='56' href='%23p'/%3e%3cuse x='96' y='72' href='%23p'/%3e%3cuse x='96' y='80' href='%23p'/%3e%3cuse x='96' y='88' href='%23p'/%3e%3cuse x='104' y='40' href='%23p'/%3e%3cuse x='104' y='48' href='%23p'/%3e%3cuse x='104' y='64' href='%23p'/%3e%3cuse x='104' y='72' href='%23p'/%3e%3cuse x='104' y='88' href='%23p'/%3e%3cuse x='104' y='96' href='%23p'/%3e%3cuse x='112' y='32' href='%23p'/%3e%3cuse x='112' y='40' href='%23p'/%3e%3cuse x='112' y='56' href='%23p'/%3e%3cuse x='112' y='72' href='%23p'/%3e%3cuse x='112' y='88' href='%23p'/%3e%3cuse x='112' y='96' href='%23p'/%3e%3cuse x='120' y='32' href='%23p'/%3e%3cuse x='120' y='48' href='%23p'/%3e%3cuse x='120' y='56' href='%23p'/%3e%3cuse x='120' y='72' href='%23p'/%3e%3cuse x='128' y='32' href='%23p'/%3e%3cuse x='128' y='40' href='%23p'/%3e%3cuse x='128' y='80' href='%23p'/%3e%3cuse x='128' y='96' href='%23p'/%3e%3cuse x='128' y='112' href='%23p'/%3e%3cuse x='128' y='120' href='%23p'/%3e%3cuse x='128' y='128' href='%23p'/%3e%3cuse x='136' y='32' href='%23p'/%3e%3cuse x='136' y='48' href='%23p'/%3e%3cuse x='136' y='56' href='%23p'/%3e%3cuse x='136' y='64' href='%23p'/%3e%3cuse x='136' y='72' href='%23p'/%3e%3cuse x='136' y='80' href='%23p'/%3e%3cuse x='136' y='88' href='%23p'/%3e%3cuse x='136' y='96' href='%23p'/%3e%3cuse x='136' y='104' href='%23p'/%3e%3cuse x='136' y='112' href='%23p'/%3e%3cuse x='136' y='120' href='%23p'/%3e%3cuse x='136' y='128' href='%23p'/%3e%3cuse x='144' y='96' href='%23p'/%3e%3cuse x='144' y='112' href='%23p'/%3e%3cuse x='144' y='120' href='%23p'/%3e%3cuse x='144' y='128' href='%23p'/%3e%3cuse x='152' y='32' href='%23p'/%3e%3cuse x='152' y='40' href='%23p'/%3e%3cuse x='152' y='48' href='%23p'/%3e%3cuse x='152' y='56' href='%23p'/%3e%3cuse x='152' y='80' href='%23p'/%3e%3cuse x='152' y='88' href='%23p'/%3e%3cuse x='152' y='96' href='%23p'/%3e%3cuse x='152' y='104' href='%23p'/%3e%3cuse x='152' y='112' href='%23p'/%3e%3cuse x='160' y='48' href='%23p'/%3e%3cuse x='160' y='72' href='%23p'/%3e%3cuse x='160' y='80' href='%23p'/%3e%3cuse x='160' y='88' href='%23p'/%3e%3cuse x='160' y='96' href='%23p'/%3e%3cuse x='160' y='120' href='%23p'/%3e%3cuse x='168' y='32' href='%23p'/%3e%3cuse x='168' y='48' href='%23p'/%3e%3cuse x='168' y='56' href='%23p'/%3e%3cuse x='168' y='72' href='%23p'/%3e%3cuse x='168' y='80' href='%23p'/%3e%3cuse x='168' y='96' href='%23p'/%3e%3cuse x='168' y='112' href='%23p'/%3e%3cuse x='168' y='120' href='%23p'/%3e%3cuse x='168' y='128' href='%23p'/%3e%3cuse x='32' y='136' href='%23p'/%3e%3cuse x='32' y='144' href='%23p'/%3e%3cuse x='32' y='152' href='%23p'/%3e%3cuse x='32' y='160' href='%23p'/%3e%3cuse x='40' y='128' href='%23p'/%3e%3cuse x='40' y='136' href='%23p'/%3e%3cuse x='40' y='144' href='%23p'/%3e%3cuse x='48' y='136' href='%23p'/%3e%3cuse x='48' y='144' href='%23p'/%3e%3cuse x='48' y='152' href='%23p'/%3e%3cuse x='48' y='168' href='%23p'/%3e%3cuse x='56' y='104' href='%23p'/%3e%3cuse x='56' y='112' href='%23p'/%3e%3cuse x='56' y='136' href='%23p'/%3e%3cuse x='56' y='152' href='%23p'/%3e%3cuse x='56' y='160' href='%23p'/%3e%3cuse x='56' y='168' href='%23p'/%3e%3cuse x='64' y='96' href='%23p'/%3e%3cuse x='64' y='104' href='%23p'/%3e%3cuse x='64' y='112' href='%23p'/%3e%3cuse x='64' y='120' href='%23p'/%3e%3cuse x='64' y='136' href='%23p'/%3e%3cuse x='64' y='152' href='%23p'/%3e%3cuse x='64' y='160' href='%23p'/%3e%3cuse x='64' y='168' href='%23p'/%3e%3cuse x='72' y='104' href='%23p'/%3e%3cuse x='72' y='112' href='%23p'/%3e%3cuse x='72' y='120' href='%23p'/%3e%3cuse x='72' y='128' href='%23p'/%3e%3cuse x='72' y='136' href='%23p'/%3e%3cuse x='72' y='144' href='%23p'/%3e%3cuse x='72' y='160' href='%23p'/%3e%3cuse x='80' y='128' href='%23p'/%3e%3cuse x='80' y='136' href='%23p'/%3e%3cuse x='80' y='152' href='%23p'/%3e%3cuse x='80' y='168' href='%23p'/%3e%3cuse x='88' y='104' href='%23p'/%3e%3cuse x='88' y='128' href='%23p'/%3e%3cuse x='88' y='152' href='%23p'/%3e%3cuse x='96' y='96' href='%23p'/%3e%3cuse x='96' y='112' href='%23p'/%3e%3cuse x='96' y='120' href='%23p'/%3e%3cuse x='96' y='128' href='%23p'/%3e%3cuse x='96' y='136' href='%23p'/%3e%3cuse x='96' y='144' href='%23p'/%3e%3cuse x='96' y='152' href='%23p'/%3e%3cuse x='96' y='160' href='%23p'/%3e%3cuse x='96' y='168' href='%23p'/%3e%3cuse x='104' y='104' href='%23p'/%3e%3cuse x='104' y='120' href='%23p'/%3e%3cuse x='104' y='128' href='%23p'/%3e%3cuse x='104' y='136' href='%23p'/%3e%3cuse x='104' y='160' href='%23p'/%3e%3cuse x='112' y='104' href='%23p'/%3e%3cuse x='112' y='120' href='%23p'/%3e%3cuse x='112' y='128' href='%23p'/%3e%3cuse x='112' y='136' href='%23p'/%3e%3cuse x='112' y='144' href='%23p'/%3e%3cuse x='112' y='152' href='%23p'/%3e%3cuse x='112' y='160' href='%23p'/%3e%3cuse x='112' y='168' href='%23p'/%3e%3cuse x='120' y='104' href='%23p'/%3e%3cuse x='120' y='120' href='%23p'/%3e%3cuse x='120' y='136' href='%23p'/%3e%3cuse x='120' y='144' href='%23p'/%3e%3cuse x='120' y='152' href='%23p'/%3e%3cuse x='120' y='160' href='%23p'/%3e%3cuse x='120' y='168' href='%23p'/%3e%3cuse x='128' y='104' href='%23p'/%3e%3cuse x='128' y='136' href='%23p'/%3e%3cuse x='128' y='152' href='%23p'/%3e%3cuse x='128' y='160' href='%23p'/%3e%3cuse x='128' y='168' href='%23p'/%3e%3cuse x='136' y='136' href='%23p'/%3e%3cuse x='136' y='144' href='%23p'/%3e%3cuse x='136' y='160' href='%23p'/%3e%3cuse x='144' y='136' href='%23p'/%3e%3cuse x='144' y='144' href='%23p'/%3e%3cuse x='144' y='152' href='%23p'/%3e%3cuse x='144' y='160' href='%23p'/%3e%3cuse x='144' y='168' href='%23p'/%3e%3cuse x='152' y='128' href='%23p'/%3e%3cuse x='152' y='136' href='%23p'/%3e%3cuse x='152' y='144' href='%23p'/%3e%3cuse x='152' y='152' href='%23p'/%3e%3cuse x='152' y='160' href='%23p'/%3e%3cuse x='152' y='168' href='%23p'/%3e%3cuse x='160' y='128' href='%23p'/%3e%3cuse x='160' y='152' href='%23p'/%3e%3cuse x='160' y='168' href='%23p'/%3e%3cuse x='168' y='136' href='%23p'/%3e%3cuse x='168' y='144' href='%23p'/%3e%3cuse x='168' y='152' href='%23p'/%3e%3cuse x='168' y='160' href='%23p'/%3e%3cuse x='168' y='168' href='%23p'/%3e%3c/g%3e%3c/svg%3e";
  
  // Эффект для таймера обратного отсчета
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    
    // Обновляем таймер каждую секунду
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    // Имитация успешной оплаты после истечения половины таймера (для демонстрации)
    if (timeLeft === 10) {
      setIsProcessing(true);
      // Имитируем небольшую задержку перед успешным платежом
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(true);
        }
      }, 1500);
    }

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
  }, [timeLeft, onSuccess]);

  // Форматирование времени для отображения
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Отмена платежа
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Имитация "ручной" проверки платежа
  const handleCheckPayment = () => {
    setIsProcessing(true);
    // Имитация проверки платежа с небольшой задержкой
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(true);
      }
    }, 1500);
  };

  return (
    <div className="qr-payment-container">
      <h2>Оплата заказа</h2>
      
      {isProcessing ? (
        <div className="payment-processing">
          <div className="payment-spinner"></div>
          <p>Проверка платежа...</p>
        </div>
      ) : isExpired ? (
        <div className="payment-expired">
          <div className="expired-icon">⚠️</div>
          <h3>Время ожидания истекло</h3>
          <p>Время ожидания оплаты истекло. Вы можете попробовать снова или выбрать другой способ оплаты.</p>
          <div className="expired-actions">
            <button onClick={handleCheckPayment} className="check-payment-button">
              Проверить оплату
            </button>
            <button onClick={handleCancel} className="cancel-payment-button">
              Отменить платеж
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="qr-code-wrapper">
            <img src={qrCodeUrl} alt="QR-код для оплаты" className="qr-code" />
            
            <div className="qr-instructions">
              <p>Отсканируйте QR-код с помощью приложения вашего банка для оплаты</p>
              <div className="timer-container">
                <div className="timer-icon">⏱️</div>
                <div className="timer">{formatTime(timeLeft)}</div>
              </div>
            </div>
          </div>
          
          <div className="payment-details">
            <div className="payment-row">
              <span className="label">Товар:</span>
              <span className="value">{product?.name || "Товар"}</span>
            </div>
            <div className="payment-row">
              <span className="label">Сумма:</span>
              <span className="value">{product?.price || "0"}</span>
            </div>
            <div className="payment-row">
              <span className="label">Номер заказа:</span>
              <span className="value">#{Math.floor(Math.random() * 10000)}</span>
            </div>
          </div>
          
          <div className="payment-actions">
            <button onClick={handleCheckPayment} className="check-payment-button">
              Я оплатил
            </button>
            <button onClick={handleCancel} className="cancel-payment-button">
              Отменить
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodePayment;