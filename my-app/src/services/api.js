/**
 * Сервис для работы с API бэкенда
 */

const API_URL = 'http://localhost:8000/api';
// Оставляем возможность переключения на мок-данные для тестирования
const USE_MOCK_DATA = false;

// Вспомогательные функции для работы с API
const handleResponse = async (response) => {
  if (!response.ok) {
    // Если статус ответа не 2xx, пытаемся получить текст ошибки из ответа
    const errorText = await response.text();
    let errorMessage = response.statusText;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || JSON.stringify(errorJson);
    } catch (e) {
      // Если не удалось распарсить JSON, используем текст как есть
      errorMessage = errorText || response.statusText;
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
};

// Вспомогательная функция для отладки запросов к API
const debugFetch = async (url, options = {}) => {
  console.log(`Отправка запроса к: ${url}`);
  console.log('Заголовки:', options.headers || {});
  if (options.body) {
    console.log('Тело запроса:', options.body);
  }
  
  try {
    const response = await fetch(url, options);
    console.log(`Получен ответ от ${url}:`, response.status, response.statusText);
    return response;
  } catch (error) {
    console.error(`Ошибка при запросе к ${url}:`, error);
    throw error;
  }
};

// Сервис для работы с продуктами
const productService = {
  /**
   * Получение списка всех товаров с возможностью фильтрации по категории
   * @param {string} category - категория товаров (опционально)
   * @returns {Promise<Array>} - список товаров
   */
  getProducts: async (category = null) => {
    if (USE_MOCK_DATA) {
      return getMockProducts(category);
    }
    
    try {
      const url = category 
        ? `${API_URL}/products?category=${encodeURIComponent(category)}` 
        : `${API_URL}/products`;
      
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ошибка при получении данных с сервера, используем локальные данные:', error);
      return getMockProducts(category);
    }
  },

  /**
   * Получение информации о конкретном товаре по ID
   * @param {number} id - ID товара
   * @returns {Promise<Object>} - данные о товаре
   */
  getProductById: async (id) => {
    if (USE_MOCK_DATA) {
      return getMockProductById(id);
    }
    
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ошибка при получении данных с сервера, используем локальные данные:', error);
      return getMockProductById(id);
    }
  },

  /**
   * Поиск товаров по названию
   * @param {string} query - строка поиска
   * @returns {Promise<Array>} - список найденных товаров
   */
  searchProducts: async (query) => {
    if (USE_MOCK_DATA) {
      return searchMockProducts(query);
    }
    
    try {
      const response = await fetch(`${API_URL}/products/search?query=${encodeURIComponent(query)}`);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ошибка при получении данных с сервера, используем локальные данные:', error);
      return searchMockProducts(query);
    }
  },

  /**
   * Добавление отзыва к товару
   * @param {number} productId - ID товара
   * @param {string} user - имя пользователя
   * @param {string} review - текст отзыва
   * @returns {Promise<Object>} - обновленные данные о товаре
   */
  addReview: async (productId, user, review) => {
    if (USE_MOCK_DATA) {
      // Имитация добавления отзыва в демо-режиме
      const product = getMockProductById(productId);
      if (product) {
        product.reviews.push({ user, review });
      }
      return product;
    }
    
    const token = localStorage.getItem('token');
    
    const response = await debugFetch(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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
    if (USE_MOCK_DATA) {
      // Имитация успешной регистрации
      return {
        id: 999,
        username: userData.username,
        email: userData.email,
        is_active: true
      };
    }
    
    const response = await debugFetch(`${API_URL}/users`, {
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
    if (USE_MOCK_DATA) {
      // Имитация успешного входа
      return {
        access_token: "mock_token_for_demo_purposes",
        token_type: "bearer"
      };
    }
    
    // Для FastAPI требуется отправка формы в формате x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await debugFetch(`${API_URL}/users/token`, {
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
    if (USE_MOCK_DATA) {
      // Имитация данных пользователя
      return {
        id: 1,
        username: "demo_user",
        email: "demo@example.com",
        first_name: "Демо",
        last_name: "Пользователь",
        is_active: true
      };
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    // Проверяем формат токена
    console.log('Используемый токен:', token);
    
    const response = await debugFetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    return handleResponse(response);
  },

  /**
   * Получение данных пользователя по ID
   * @returns {Promise<Object>} - данные пользователя
   */
  getUserById: async (userId) => {
    if (USE_MOCK_DATA) {
      return {
        id: userId,
        username: "user" + userId,
        email: `user${userId}@example.com`,
        is_active: true
      };
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }
    
    const response = await debugFetch(`${API_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
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
    if (USE_MOCK_DATA) {
      // Имитация обновления данных пользователя
      return {
        id: userId,
        username: userData.username || "demo_user",
        email: userData.email || "demo@example.com",
        first_name: userData.first_name || "Демо",
        last_name: userData.last_name || "Пользователь",
        phone_number: userData.phone_number || "+7777777777",
        address: userData.address || "Тестовый адрес",
        city: userData.city || "Астана",
        is_active: true
      };
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await debugFetch(`${API_URL}/users/${userId}`, {
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
    if (USE_MOCK_DATA) {
      // Имитация создания заказа
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        user_id: 1,
        total_price: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: "pending",
        shipping_address: orderData.shipping_address,
        payment_details: orderData.payment_details,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: orderData.items
      };
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await debugFetch(`${API_URL}/orders`, {
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
    if (USE_MOCK_DATA) {
      // Имитация списка заказов
      return [
        {
          id: 1,
          user_id: 1,
          total_price: 190.0,
          status: "delivered",
          shipping_address: "г. Астана, ул. Абая 1",
          created_at: "2025-04-20T10:30:00Z",
          updated_at: "2025-04-22T14:15:00Z",
          items: [
            {
              product_id: 1,
              quantity: 1,
              selected_size: "M"
            }
          ]
        },
        {
          id: 2,
          user_id: 1,
          total_price: 380.0,
          status: "shipped",
          shipping_address: "г. Астана, ул. Абая 1",
          created_at: "2025-04-25T15:45:00Z",
          updated_at: "2025-04-26T09:20:00Z",
          items: [
            {
              product_id: 5,
              quantity: 1,
              selected_size: "L"
            },
            {
              product_id: 10,
              quantity: 1,
              selected_size: "M"
            }
          ]
        }
      ];
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await debugFetch(`${API_URL}/orders`, {
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
    if (USE_MOCK_DATA) {
      // Имитация данных заказа
      const mockOrders = await orderService.getUserOrders();
      return mockOrders.find(order => order.id === orderId) || null;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    const response = await debugFetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

export { productService, userService, orderService };