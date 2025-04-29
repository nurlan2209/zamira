// src/store/index.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useUserStore = create(
  // Используем middleware:
  // 1. persist - для сохранения состояния в localStorage
  // 2. devtools - для отладки с Redux DevTools
  devtools(
    persist(
      (set) => ({
        // Состояние пользователя
        user: null,
        
        // Функция для установки данных пользователя
        setUser: (userData) => set({ user: userData }),
        
        // Функция для обновления данных пользователя
        updateUser: (updatedFields) => set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null
        })),
        
        // Функция для очистки данных пользователя (выход)
        clearUser: () => set({ user: null })
      }),
      {
        name: "user-storage", // Название для localStorage
        // Не сохраняем токены в localStorage через Zustand
        partialize: (state) => ({ 
          user: state.user 
            ? {
                id: state.user.id,
                username: state.user.username,
                email: state.user.email,
                first_name: state.user.first_name,
                last_name: state.user.last_name
              } 
            : null 
        })
      }
    )
  )
);

export default useUserStore;