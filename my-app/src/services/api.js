/**
 * Сервис для работы с API бэкенда
 */

const API_URL = 'http://localhost:8000/api';

// Вспомогательные функции для работы с API
const handleResponse = async (response) => {
  if (!response.ok) {
    // Если статус ответа не 2xx, пытаемся получить текст ошибки из ответа
    const errorText = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      // Если не удалось распарсить JSON, используем текст как есть
      throw new Error(errorText || response.statusText);
    }
    throw new Error(errorJson.detail || response.statusText);
  }
  return response.json();
};

// Сервис для работы с продуктами
const productService = {
  /**
   * Получение списка всех товаров с возможностью фильтрации по категории
   * @param {string} category - категория товаров (опционально)
   * @returns {Promise<Array>} - список товаров
   */
  getProducts: async (category = null) => {
    const url = category 
      ? `${API_URL}/products?category=${encodeURIComponent(category)}` 
      : `${API_URL}/products`;
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Получение информации о конкретном товаре по ID
   * @param {number} id - ID товара
   * @returns {Promise<Object>} - данные о товаре
   */
  getProductById: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return handleResponse(response);
  },

  /**
   * Поиск товаров по названию
   * @param {string} query - строка поиска
   * @returns {Promise<Array>} - список найденных товаров
   */
  searchProducts: async (query) => {
    const response = await fetch(`${API_URL}/products/search?query=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  /**
   * Добавление отзыва к товару
   * @param {number} productId - ID товара
   * @param {string} user - имя пользователя
   * @param {string} review - текст отзыва
   * @returns {Promise<Object>} - обновленные данные о товаре
   */
  addReview: async (productId, user, review) => {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, review }),
    });
    return handleResponse(response);
  }
};

// Сервис для работы с пользователями
const userService = {
  /**
   * Регистрация нового пользователя
   * @param {Object} userData - данные пользователя
   * @returns {Promise<Object>} - данные созданного пользователя
   */
  register: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  /**
   * Аутентификация пользователя и получение токена
   * @param {string} username - имя пользователя
   * @param {string} password - пароль
   * @returns {Promise<Object>} - данные аутентификации с токеном
   */
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/users/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    return handleResponse(response);
  },

  /**
   * Получение данных текущего пользователя
   * @returns {Promise<Object>} - данные пользователя
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  /**
   * Обновление данных пользователя
   * @param {number} userId - ID пользователя
   * @param {Object} userData - новые данные пользователя
   * @returns {Promise<Object>} - обновленные данные пользователя
   */
  updateUser: async (userId, userData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  }
};

// Сервис для работы с заказами
const orderService = {
  /**
   * Создание нового заказа
   * @param {Object} orderData - данные заказа
   * @returns {Promise<Object>} - созданный заказ
   */
  createOrder: async (orderData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  /**
   * Получение списка заказов пользователя
   * @returns {Promise<Array>} - список заказов
   */
  getUserOrders: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  /**
   * Получение информации о конкретном заказе
   * @param {number} orderId - ID заказа
   * @returns {Promise<Object>} - данные заказа
   */
  getOrderById: async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

export { productService, userService, orderService };