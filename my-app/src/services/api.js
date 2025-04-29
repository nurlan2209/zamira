/**
 * Сервис для работы с API бэкенда
 */

const API_URL = 'http://localhost:8000/api';
// По умолчанию всегда используем реальное API, но можем переключиться на мок-данные, если сервер недоступен
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

// Хранилище для мок-данных о продуктах (на случай недоступности API)
const mockProducts = [
  {
    id: 1,
    name: "Shadow Ember",
    price: "$190",
    actual_price: 190.0,
    img: "https://i.pinimg.com/736x/9d/4f/94/9d4f94d406f3bb64676b9cdea594839d.jpg",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: [
      {"user": "Айгуль", "review": "Очень красивый худи, комфортный и стильный!"},
      {"user": "Руслан", "review": "Ткань приятная, но немного маломерит."}
    ],
    description: "Стильный худи Shadow Ember из премиальной ткани. Идеально подойдет для создания модного повседневного образа."
  },
  {
    id: 2,
    name: "Frost Pulse",
    price: "$49",
    actual_price: 49.0,
    img: "https://i.pinimg.com/736x/66/bc/11/66bc1140083fd5a840e66c4634e02270.jpg",
    category: "Hoodies",
    sizes: ["S", "M", "L"],
    rating: 4.0,
    reviews: [
      {"user": "Мадина", "review": "Очень приятная ткань, но в районе талии немного широковато."},
      {"user": "Данияр", "review": "Хороший худи, но материал мог бы быть плотнее."}
    ],
    description: "Легкий худи Frost Pulse идеально подойдет для прохладных летних вечеров."
  },
  {
    id: 10,
    name: "Carbon Veil",
    price: "$190",
    actual_price: 190.0,
    img: "https://i.pinimg.com/736x/79/29/0f/79290fe785787fbc80dfc172cec8a747.jpg",
    category: "Bottom",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: [
      {"user": "Айгуль", "review": "Удобные штаны, хороший материал!"},
      {"user": "Руслан", "review": "Хорошо сидят на фигуре."}
    ],
    description: "Штаны в стиле карго с удобными боковыми карманами, выполненные из прочной ткани."
  }
];

// Получение данных о товаре по ID из мок-данных
const getMockProductById = (id) => {
  id = parseInt(id);
  return mockProducts.find(product => product.id === id) || null;
};

// Поиск товаров по названию в мок-данных
const searchMockProducts = (query) => {
  query = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(query) || 
    product.category.toLowerCase().includes(query)
  );
};

// Фильтрация товаров по категории в мок-данных
const getMockProducts = (category) => {
  if (!category) {
    return mockProducts;
  }
  return mockProducts.filter(product => product.category === category);
};

// Сервис для работы с продуктами
const productService = {
  /**
   * Получение списка всех товаров с возможностью фильтрации по категории
   * @param {string} category - категория товаров (опционально)
   * @returns {Promise<Array>} - список товаров
   */
  getProducts: async (category = null) => {
    try {
      const url = category 
        ? `${API_URL}/products?category=${encodeURIComponent(category)}` 
        : `${API_URL}/products`;
      
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ошибка при получении данных с сервера, используем локальные данные:', error);
      
      // Если не удалось получить данные с сервера, используем мок-данные
      if (USE_MOCK_DATA) {
        return getMockProducts(category);
      }
      
      throw error;
    }
  },

  /**
   * Получение информации о конкретном товаре по ID
   * @param {number} id - ID товара
   * @returns {Promise<Object>} - данные о товаре
   */
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ошибка при получении данных с сервера:', error);
      
      // Если не удалось получить данные с сервера, используем мок-данные
      if (USE_MOCK_DATA) {
        return getMockProductById(id);
      }
      
      throw error;
    }
  },

  /**
   * Поиск товаров по названию
   * @param {string} query - строка поиска
   * @returns {Promise<Array>} - список найденных товаров
   */
  searchProducts: async (query) => {
    try {
      const response = await fetch(`${API_URL}/products/search?query=${encodeURIComponent(query)}`);
      return handleResponse(response);
    } catch (error) {
      console.warn('Ошибка при получении данных с сервера:', error);
      
      // Если не удалось получить данные с сервера, используем мок-данные
      if (USE_MOCK_DATA) {
        return searchMockProducts(query);
      }
      
      throw error;
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
    const token = localStorage.getItem('token');
    
    try {
      const response = await debugFetch(`${API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ user, review }),
      });
      return handleResponse(response);
    } catch (error) {
      console.warn('Ошибка при добавлении отзыва:', error);
      
      // Если включен режим мок-данных и произошла ошибка
      if (USE_MOCK_DATA) {
        const product = getMockProductById(productId);
        if (product) {
          product.reviews.push({ user, review });
          return product;
        }
      }
      
      throw error;
    }
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
    try {
      const response = await debugFetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      
      // Всегда возвращаем мок-данные при включенном режиме
      if (USE_MOCK_DATA) {
        console.log('Using mock data for registration');
        return {
          id: 999,
          username: userData.username,
          email: userData.email,
          is_active: true
        };
      }
      
      throw error;
    }
  },

  /**
   * Аутентификация пользователя и получение токена
   * @param {string} username - имя пользователя
   * @param {string} password - пароль
   * @returns {Promise<Object>} - данные аутентификации с токеном
   */
  login: async (username, password) => {
    // Если режим мок-данных включен, сразу возвращаем мок-токен
    if (USE_MOCK_DATA) {
      console.log('Using mock data for login');
      return {
        access_token: "mock_token_for_demo_purposes",
        token_type: "bearer"
      };
    }

    // Для FastAPI требуется отправка формы в формате x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await debugFetch(`${API_URL}/users/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
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

    // Если режим мок-данных включен, сразу возвращаем мок-пользователя
    if (USE_MOCK_DATA) {
      console.log('Using mock data for current user');
      return {
        id: 1,
        username: "user",
        email: "user@example.com",
        first_name: "Иван",
        last_name: "Петров",
        phone_number: "+7777777777",
        address: "ул. Абая, 1",
        city: "Астана",
        is_active: true
      };
    }

    try {
      const response = await debugFetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      throw error;
    }
  },

  /**
   * Получение данных пользователя по ID
   * @param {number} userId - ID пользователя
   * @returns {Promise<Object>} - данные пользователя
   */
  getUserById: async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }
    
    try {
      const response = await debugFetch(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      
      // Если включен режим мок-данных и произошла ошибка
      if (USE_MOCK_DATA) {
        return {
          id: userId,
          username: "user",
          email: `user@example.com`,
          first_name: "Иван",
          last_name: "Петров",
          phone_number: "+7777777777",
          address: "ул. Абая, 1",
          city: "Астана",
          is_active: true
        };
      }
      
      throw error;
    }
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

    try {
      console.log('Отправка запроса на обновление пользователя:', userData);
      
      const response = await debugFetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      const updatedUser = await handleResponse(response);
      console.log('Получены обновленные данные пользователя:', updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
      throw error;
    }
  },
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

    try {
      const response = await debugFetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw error;
    }
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

    try {
      const response = await debugFetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении заказов пользователя:', error);
      throw error;
    }
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

    try {
      const response = await debugFetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении данных заказа:', error);
      throw error;
    }
  },

  /**
   * Обновление статуса заказа
   * @param {number} orderId - ID заказа
   * @param {string} status - новый статус
   * @returns {Promise<Object>} - обновленные данные заказа
   */
  updateOrderStatus: async (orderId, status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    try {
      const response = await debugFetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
      throw error;
    }
  },

  /**
   * Отмена заказа
   * @param {number} orderId - ID заказа
   * @returns {Promise<Object>} - результат операции
   */
  cancelOrder: async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Пользователь не аутентифицирован');
    }

    try {
      const response = await debugFetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при отмене заказа:', error);
      throw error;
    }
  }
};

export { productService, userService, orderService };