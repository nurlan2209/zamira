import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Навигационное меню */}
      <header className="site-header">
        <div className="site-title">MØRK</div>
        <nav>
          <ul>
            <li>
              <a href="/catalog">Shop</a>
            </li>
            <li>
              <a href="#">Jewelry</a>
            </li>
            <li>
              <a href="#">Bags</a>
            </li>
            <li>
              <a href="#">Tops</a>
            </li>
            <li>
              <a href="#">Knitwear</a>
            </li>
            <li>
              <a href="#">All</a>
            </li>
            <li>
              <a href="#">Hoodies</a>
            </li>
            <li>
              <a href="#">Bottom</a>
            </li>
            <li>
              <a href="#">Accessories</a>
            </li>
            <li>
              <a href="#">More+</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Поиск и фильтры */}
      <section className="w-full max-w-full px-4 py-12">
        <div className="flex justify-center mb-10">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск..."
          />
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-auto mb-4"
              />
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-600">{product.price}</p>
              <Link to={`/product/${product.id}`} className="details-button">
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 border-t w-full">
        &copy; 2025 DKY STORE. All rights reserved.
      </footer>
    </div>
  );
}
