// src/store/index.js
import { create } from "zustand";

// Исправлено хранилище для предотвращения бесконечных циклов обновлений
const useUserStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
}));

export default useUserStore;