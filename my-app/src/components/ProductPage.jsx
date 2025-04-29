import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/api";
import "../ProductePage.css";

export default function ProductPage() {
  const { id } = useParams(); // Получаем ID продукта из URL
  const navigate = useNavigate(); // Хук для навигации
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Загрузка данных о товаре при монтировании компонента или изменении ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(parseInt(id));
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке товара");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeClick = (size) => {
    setSelectedSize(size); // Устанавливаем выбранный размер
  };

  // Функция для обработки клика по кнопке "Заказать"
  const handleOrderClick = () => {
    // Переход на страницу оплаты с передачей товара и выбранного размера
    navigate("/payment", { state: { product, selectedSize } });
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка товара...</p>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="error-container">
        <h2>Произошла ошибка</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Вернуться назад</button>
      </div>
    );
  }

  // Если товар не найден
  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Товар не найден</h2>
        <p>К сожалению, запрашиваемый товар не существует.</p>
        <button onClick={() => navigate("/")}>Вернуться на главную</button>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* Основная информация о товаре */}
      <div className="product-info">
        <div className="product-image">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          {/* Добавил описание товара, если оно есть */}
          <p>{product.description || "Описание товара отсутствует."}</p>
          <p className="price">{product.price}</p>

          {/* Отображение размеров */}
          <div className="sizes">
            <h3>Доступные размеры:</h3>
            <ul>
              {product.sizes.map((size, index) => (
                <li key={index}>
                  <button
                    className={`size-btn ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => handleSizeClick(size)}>
                    {size}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Кнопка заказать */}
          <button
            className="order-button"
            onClick={handleOrderClick}
            disabled={!selectedSize}>
            Заказать
          </button>

          {/* Рейтинг товара */}
          <div className="rating">
            <p>Рейтинг: {product.rating} / 5</p>
            <div className="stars">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`star ${
                    index < Math.round(product.rating) ? "filled" : ""
                  }`}>
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Отзывы */}
      <div className="reviews">
        <h2>Отзывы:</h2>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>{review.user}</strong>: {review.review}
              </p>
              <div className="stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`star ${
                      index < Math.round(product.rating) ? "filled" : ""
                    }`}>
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Отзывов пока нет. Станьте первым, кто оставит отзыв о товаре!</p>
        )}
      </div>
    </div>
  );
}