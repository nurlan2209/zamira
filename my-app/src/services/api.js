/**
 * Сервис для работы с API бэкенда
 */

const API_URL = 'http://localhost:8000/api';
// Отключаем использование мок-данных
const USE_MOCK_DATA = false;

// Вспомогательные функции для работы с API
const handleResponse = async (response) => {
  if (!response.ok) {
    // Если статус ответа не 2xx, пытаемся получить текст ошибки из ответа
    const errorText = await response.text();
    let errorMessage;
    
    try {
      // Пытаемся разобрать ошибку как JSON
      const errorJson = JSON.parse(errorText);
      
      // Проверяем различные форматы ошибок FastAPI
      if (errorJson.detail) {
        errorMessage = typeof errorJson.detail === 'string' 
          ? errorJson.detail 
          : JSON.stringify(errorJson.detail);
      } else if (errorJson.message) {
        errorMessage = errorJson.message;
      } else {
        errorMessage = JSON.stringify(errorJson);
      }
    } catch (e) {
      // Если не удалось распарсить JSON, используем текст как есть
      errorMessage = errorText || `Ошибка сервера: ${response.status}`;
    }
    
    console.error(`API error (${response.status}):`, errorMessage);
    throw new Error(errorMessage);
  }
  
  // Для пустых ответов (например, при статусе 204 No Content)
  if (response.status === 204) {
    return {};
  }
  
  try {
    return await response.json();
  } catch (e) {
    console.warn('Ответ не содержит JSON:', e);
    return {};
  }
};

// Функция для выполнения запросов с авторизацией
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Объединяем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Если получаем 401 Unauthorized, очищаем токен и перенаправляем на страницу входа
    if (response.status === 401) {
      console.warn('Токен авторизации недействителен или истек');
      localStorage.removeItem('token');
      
      // Если мы находимся в браузере, можно перенаправить на страницу входа
      if (typeof window !== 'undefined') {
        // Перенаправление можно реализовать при необходимости
        // window.location.href = '/auth';
      }
    }
    
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
    try {
      const url = category 
        ? `${API_URL}/products?category=${encodeURIComponent(category)}` 
        : `${API_URL}/products`;
      
      const response = await fetchWithAuth(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
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
      const response = await fetchWithAuth(`${API_URL}/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении товара по ID:', error);
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
      const response = await fetchWithAuth(`${API_URL}/products/search?query=${encodeURIComponent(query)}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при поиске товаров:', error);
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
    try {
      const response = await fetchWithAuth(`${API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, review }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
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
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
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
    // Для FastAPI требуется отправка формы в формате x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_URL}/users/token`, {
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

    try {
      const response = await fetchWithAuth(`${API_URL}/users/me`);
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      // Если получаем ошибку 401 (Unauthorized), очищаем токен
      if (error.message.includes('401')) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  /**
   * Получение данных пользователя по ID
   * @param {number} userId - ID пользователя
   * @returns {Promise<Object>} - данные пользователя
   */
  getUserById: async (userId) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
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
    try {
      // Удаляем пустые поля, чтобы они не перезаписывали существующие значения
      const cleanedData = {};
      for (const key in userData) {
        if (userData[key] !== null && userData[key] !== undefined) {
          cleanedData[key] = userData[key];
        }
      }
      
      const response = await fetchWithAuth(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
      throw error;
    }
  },
  
  /**
   * Изменение пароля пользователя
   * @param {number} userId - ID пользователя
   * @param {string} currentPassword - текущий пароль
   * @param {string} newPassword - новый пароль
   * @returns {Promise<Object>} - результат операции
   */
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      throw error;
    }
  }
};

/**
 * Сервис для работы с заказами
 */
const orderService = {
/**
 * Создание нового заказа
 * @param {Object} orderData - данные заказа
 * @returns {Promise<Object>} - созданный заказ
 */
createOrder: async (orderData) => {
  try {
    console.log("Создание заказа с данными:", orderData);
    
    // Получаем текущий токен
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Не авторизован. Пожалуйста, войдите снова.");
    }
    
    // Добавляем обработку сетевых ошибок
    try {
      // Сначала получаем данные пользователя
      const userResponse = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          // Если токен недействителен, удаляем его и выбрасываем ошибку
          localStorage.removeItem("token");
          throw new Error("Токен авторизации истек или недействителен. Пожалуйста, войдите снова.");
        }
        throw new Error(`Ошибка при получении данных пользователя: ${userResponse.status}`);
      }
      
      const userData = await userResponse.json();
      const userId = userData.id;
      
      if (!userId) {
        throw new Error("Не удалось получить ID пользователя");
      }
      
      // Затем создаем заказ
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...orderData,
          user_id: userId
        }),
      });
      
      // Проверка на сетевую ошибку
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Полный ответ сервера:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.log("Детали ошибки:", errorData);
          errorMessage = typeof errorData.detail === 'object' 
            ? JSON.stringify(errorData.detail) 
            : errorData.detail || JSON.stringify(errorData);
        } catch (e) {
          errorMessage = errorText;
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      // Перехватываем сетевые ошибки
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('Сетевая ошибка при создании заказа:', error);
        throw new Error('Не удалось соединиться с сервером. Пожалуйста, проверьте подключение к интернету и доступность сервера.');
      }
      throw error;
    }
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
    try {
      const response = await fetchWithAuth(`${API_URL}/orders/`);
      
      // Проверка статуса ответа
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при получении заказов:', errorText);
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении заказов пользователя:', error);
      // Возвращаем пустой массив вместо ошибки для лучшего UX
      return [];
    }
  },
    /**
   * Получение информации о конкретном заказе
   * @param {number} orderId - ID заказа
   * @returns {Promise<Object>} - данные заказа
   */
    getOrderById: async (orderId) => {
      try {
        const response = await fetchWithAuth(`${API_URL}/orders/${orderId}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Ошибка при получении заказа ${orderId}:`, errorText);
          throw new Error('Не удалось получить данные заказа');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Ошибка при получении данных заказа:', error);
        throw error;
      }
    },
     /**
   * Получение детальной информации о заказе, включая товары
   * @param {number} orderId - ID заказа
   * @returns {Promise<Object>} - детальные данные заказа
   */
  getOrderDetails: async (orderId) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/orders/${orderId}/details`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ошибка при получении деталей заказа ${orderId}:`, errorText);
        throw new Error('Не удалось получить детали заказа');
      }
      
      const data = await response.json();
      console.log(`Получены детали заказа ${orderId}:`, data);
      return data;
    } catch (error) {
      console.error('Ошибка при получении деталей заказа:', error);
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
    try {
      const response = await fetchWithAuth(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ошибка при обновлении статуса заказа ${orderId}:`, errorText);
        throw new Error('Не удалось обновить статус заказа');
      }
      
      return await response.json();
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
      try {
        // Используем метод обновления статуса для отмены
        return await orderService.updateOrderStatus(orderId, 'cancelled');
      } catch (error) {
        console.error('Ошибка при отмене заказа:', error);
        throw error;
      }
    }
};

export { productService, userService, orderService };