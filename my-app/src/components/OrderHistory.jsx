import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/OrderHistory.css';

const OrderHistory = ({ orders = [] }) => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState({}); // Хранение выбранного метода доставки для каждого заказа

  // Обработчик для переключения активного заказа
  const toggleOrderDetails = (orderId) => {
    setActiveOrder(activeOrder === orderId ? null : orderId);
  };

  // Обработчик для изменения метода доставки
  const handleDeliveryMethodChange = (orderId, method) => {
    setDeliveryMethod({
      ...deliveryMethod,
      [orderId]: method
    });
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
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="order-summary">
                <span className="order-total">Итого: {order.total_price.toFixed(2)} ₸</span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <button className="toggle-details-button">
                {activeOrder === order.id ? '▲' : '▼'}
              </button>
            </div>
            
            {activeOrder === order.id && (
              <div className="order-details">
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
                        {new Date(order.created_at).toLocaleDateString()}
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
                      <span className="info-value">{order.total_price.toFixed(2)} ₸</span>
                    </div>
                    <div className="order-info-row">
                      <span className="info-label">Адрес доставки:</span>
                      <span className="info-value">{order.shipping_address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-details-section">
                  <h3>Способ доставки</h3>
                  <div className="delivery-options">
                    <label className="delivery-option">
                      <input 
                        type="radio" 
                        name={`delivery-${order.id}`} 
                        value="self" 
                        checked={deliveryMethod[order.id] === 'self'} 
                        onChange={() => handleDeliveryMethodChange(order.id, 'self')}
                      />
                      <div className="delivery-option-content">
                        <span className="delivery-option-title">Самовывоз</span>
                        <span className="delivery-option-desc">Из нашего магазина по адресу: г.Астана, ул. Стильная, 69</span>
                      </div>
                    </label>
                    
                    <label className="delivery-option">
                      <input 
                        type="radio" 
                        name={`delivery-${order.id}`} 
                        value="kazpost" 
                        checked={deliveryMethod[order.id] === 'kazpost'} 
                        onChange={() => handleDeliveryMethodChange(order.id, 'kazpost')}
                      />
                      <div className="delivery-option-content">
                        <span className="delivery-option-title">Казпочта</span>
                        <span className="delivery-option-desc">Доставка по всему Казахстану (3-7 дней)</span>
                      </div>
                    </label>
                  </div>
                  
                  {deliveryMethod[order.id] && (
                    <div className="delivery-confirmation">
                      <button className="confirm-delivery-button">
                        Подтвердить способ доставки
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="order-details-section">
                  <h3>Товары в заказе</h3>
                  <div className="order-items-list">
                    {order.items && order.items.map((item, index) => (
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
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`tracking-step ${['paid', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : order.status === 'cancelled' ? 'cancelled' : ''}`}>
                      <div className="tracking-marker"></div>
                      <div className="tracking-info">
                        <span className="tracking-title">Оплачен</span>
                        <span className="tracking-date">
                          {['paid', 'processing', 'shipped', 'delivered'].includes(order.status) 
                            ? new Date(new Date(order.created_at).getTime() + 1000*60*60).toLocaleDateString()
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
                            ? new Date(new Date(order.created_at).getTime() + 1000*60*60*24).toLocaleDateString()
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
                            ? new Date(new Date(order.created_at).getTime() + 1000*60*60*24*2).toLocaleDateString()
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
                            ? new Date(new Date(order.created_at).getTime() + 1000*60*60*24*5).toLocaleDateString()
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button className="reorder-button">Повторить заказ</button>
                  {order.status === 'pending' && (
                    <button className="cancel-order-button">Отменить заказ</button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;