import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import '../styles/OrderHistory.css';

const OrderHistory = ({ orders = [] }) => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Обработчик для переключения активного заказа
  const toggleOrderDetails = async (orderId) => {
    if (activeOrder === orderId) {
      // Если уже открыт, то закрываем
      setActiveOrder(null);
      return;
    }
    
    // Если детали уже загружены, то просто открываем
    if (orderDetails[orderId]) {
      setActiveOrder(orderId);
      return;
    }
    
    // Если детали не загружены, загружаем их
    try {
      setIsLoading(true);
      setError(null);
      
      const details = await orderService.getOrderDetails(orderId);
      
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: details
      }));
      
      setActiveOrder(orderId);
    } catch (err) {
      console.error("Ошибка при загрузке деталей заказа:", err);
      setError(`Не удалось загрузить детали заказа: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик для отмены заказа
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Вы уверены, что хотите отменить заказ?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await orderService.cancelOrder(orderId);
      
      // Обновляем статус заказа локально
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' } 
          : order
      );
      
      // Обновляем состояние
      setActiveOrder(null);
    } catch (err) {
      console.error("Ошибка при отмене заказа:", err);
      setError(`Не удалось отменить заказ: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для получения статуса заказа на русском
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Ожидает оплаты',
      'paid': 'Оплачен',
      'processing': 'Обрабатывается',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  // Функция для получения класса статуса заказа
  const getStatusClass = (status) => {
    const statusClassMap = {
      'pending': 'status-pending',
      'paid': 'status-paid',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusClassMap[status] || '';
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Отображаем сообщение, если у пользователя еще нет заказов
  if (!orders || orders.length === 0) {
    return (
      <div className="order-history-empty">
        <h2>У вас пока нет заказов</h2>
        <p>Ваша история заказов будет отображаться здесь после совершения покупок.</p>
        <Link to="/" className="browse-products-button">Перейти к покупкам</Link>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2>История заказов</h2>
      
      {error && <div className="order-error">{error}</div>}
      
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <div 
              className="order-header" 
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div className="order-basic-info">
                <span className="order-number">Заказ #{order.id}</span>
                <span className="order-date">
                  {formatDate(order.created_at)}
                </span>
              </div>
              
              <div className="order-summary">
                <span className="order-total">{order.total_price?.toFixed(2) || 0} ₸</span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <button className="toggle-details-button" aria-label="Показать/скрыть детали заказа">
                {activeOrder === order.id ? '▲' : '▼'}
              </button>
            </div>
            
            {activeOrder === order.id && (
              <div className="order-details">
                {isLoading ? (
                  <div className="order-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка деталей заказа...</p>
                  </div>
                ) : (
                  <>
                    <div className="order-details-section">
                      <h3>Детали заказа</h3>
                      <div className="order-info-grid">
                        <div className="order-info-row">
                          <span className="info-label">Номер заказа:</span>
                          <span className="info-value">#{order.id}</span>
                        </div>
                        <div className="order-info-row">
                          <span className="info-label">Дата заказа:</span>
                          <span className="info-value">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                        <div className="order-info-row">
                          <span className="info-label">Статус:</span>
                          <span className={`info-value ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="order-info-row">
                          <span className="info-label">Сумма заказа:</span>
                          <span className="info-value">{order.total_price?.toFixed(2) || 0} ₸</span>
                        </div>
                        <div className="order-info-row">
                          <span className="info-label">Адрес доставки:</span>
                          <span className="info-value">{order.shipping_address || "Не указан"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-details-section">
                      <h3>Товары в заказе</h3>
                      <div className="order-items-list">
                        {orderDetails[order.id]?.items?.map((item, index) => (
                          <div key={index} className="order-product-item">
                            <div className="product-image">
                              {item.product && item.product.img ? (
                                <img src={item.product.img} alt={item.product.name || 'Товар'} />
                              ) : (
                                <div className="image-placeholder">Нет изображения</div>
                              )}
                            </div>
                            <div className="product-details">
                              <h4>{item.product ? item.product.name : 'Товар'}</h4>
                              <div className="product-meta">
                                <span className="product-size">Размер: {item.selected_size || 'N/A'}</span>
                                <span className="product-quantity">Количество: {item.quantity || 1}</span>
                                <span className="product-price">
                                  {item.product ? item.product.price : 'Цена не указана'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {(!orderDetails[order.id] || !orderDetails[order.id].items || orderDetails[order.id].items.length === 0) && (
                          <p className="no-items-message">Информация о товарах в заказе недоступна</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="order-details-section">
                      <h3>Отслеживание заказа</h3>
                      <div className="tracking-timeline">
                        <div className={`tracking-step ${order.status !== 'cancelled' ? 'completed' : 'cancelled'}`}>
                          <div className="tracking-marker"></div>
                          <div className="tracking-info">
                            <span className="tracking-title">Заказ создан</span>
                            <span className="tracking-date">
                              {formatDate(order.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`tracking-step ${['paid', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : order.status === 'cancelled' ? 'cancelled' : ''}`}>
                          <div className="tracking-marker"></div>
                          <div className="tracking-info">
                            <span className="tracking-title">Оплачен</span>
                            <span className="tracking-date">
                              {['paid', 'processing', 'shipped', 'delivered'].includes(order.status) 
                                ? formatDate(order.updated_at || order.created_at)
                                : '-'}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`tracking-step ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : order.status === 'cancelled' ? 'cancelled' : ''}`}>
                          <div className="tracking-marker"></div>
                          <div className="tracking-info">
                            <span className="tracking-title">В обработке</span>
                            <span className="tracking-date">
                              {['processing', 'shipped', 'delivered'].includes(order.status) 
                                ? formatDate(order.updated_at || order.created_at)
                                : '-'}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`tracking-step ${['shipped', 'delivered'].includes(order.status) ? 'completed' : order.status === 'cancelled' ? 'cancelled' : ''}`}>
                          <div className="tracking-marker"></div>
                          <div className="tracking-info">
                            <span className="tracking-title">Отправлен</span>
                            <span className="tracking-date">
                              {['shipped', 'delivered'].includes(order.status) 
                                ? formatDate(order.updated_at || order.created_at)
                                : '-'}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`tracking-step ${order.status === 'delivered' ? 'completed' : order.status === 'cancelled' ? 'cancelled' : ''}`}>
                          <div className="tracking-marker"></div>
                          <div className="tracking-info">
                            <span className="tracking-title">Доставлен</span>
                            <span className="tracking-date">
                              {order.status === 'delivered' 
                                ? formatDate(order.updated_at || order.created_at)
                                : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <button 
                          className="cancel-order-button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Отмена..." : "Отменить заказ"}
                        </button>
                      )}
                      
                      <Link 
                        to="/"
                        className="reorder-button"
                      >
                        Продолжить покупки
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;