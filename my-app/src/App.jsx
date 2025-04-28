import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CatalogPage from "./components/CatalogPage";
import ProductPage from "./components/ProductPage";
import PaymentPage from "./components/PaymentPage";
import Modal from "./components/Modal"; // Импорт компонента Modal

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const openModal = (isLoginForm) => {
    setIsLogin(isLoginForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (formData, isLoginForm) => {
    // Здесь можно отправить данные на сервер для регистрации или входа
    const endpoint = isLoginForm ? "/login" : "/register";
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Логика после успешной регистрации/входа
      console.log("Success");
    } else {
      console.error("Error");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage openModal={openModal} />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>

      {/* Модальное окно для регистрации/входа */}
      <Modal
        show={showModal}
        closeModal={closeModal}
        isLogin={isLogin}
        handleSubmit={handleSubmit}
      />
    </Router>
  );
}

export default App;
