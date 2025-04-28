import React, { useState } from "react";
import "../App.css";

const Navbar = () => {
  const handleCategoryChange = (category) => {
    // Логика обработки изменения категории
    console.log("Категория изменена на:", category);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Навигационное меню + Профиль */}
      <header className="site-header w-full flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-50">
        <nav>
          <ul className="flex gap-4 flex-wrap">
            <li>
              <a href="#" onClick={() => handleCategoryChange("Jewelry")}>
                Jewelry
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleCategoryChange("Bags")}>
                Bags
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleCategoryChange("Tops")}>
                Tops
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleCategoryChange("All")}>
                All
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleCategoryChange("Hoodies")}>
                Hoodies
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleCategoryChange("Bottom")}>
                Bottom
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleCategoryChange("Accessories")}>
                Accessories
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleCategoryChange("More")}>
                More
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
