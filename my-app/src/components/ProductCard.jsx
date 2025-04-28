import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

/**
 * Компонент карточки товара для отображения на страницах каталога и главной
 * @param {Object} product - данные о товаре
 * @param {boolean} showDetails - показывать ли кнопку подробнее
 */
const ProductCard = ({ product, showDetails = true }) => {
  if (!product) return null;

  const { id, name, price, img } = product;

  return (
    <div className="product-card">
      <Link to={`/product/${id}`}>
        <img src={img} alt={name} className="product-card-image" />
      </Link>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>
        
        {showDetails && (
          <Link to={`/product/${id}`} className="details-button">
            Подробнее
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;