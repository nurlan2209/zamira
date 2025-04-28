import React, { useState } from "react";

function Modal({ show, closeModal, isLogin, handleSubmit }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Отправить данные на сервер в зависимости от типа формы
    await handleSubmit({ username, email, password }, isLogin);
    closeModal(); // Закрытие модального окна после отправки формы
  };

  if (!show) return null; // Не рендерить, если модальное окно не открыто

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleFormSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
