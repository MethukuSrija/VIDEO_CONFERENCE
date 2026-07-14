import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/api";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.login({ email, password });
          localStorage.setItem("token", data.access_token);
          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
          return data;
        } catch (e) {
          set({
            error: e.response?.data?.detail || "Login failed",
            isLoading: false,
          });
          throw e;
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.signup({ name, email, password });
          localStorage.setItem("token", data.access_token);
          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
          return data;
        } catch (e) {
          set({
            error: e.response?.data?.detail || "Signup failed",
            isLoading: false,
          });
          throw e;
        }
      },

      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "auth-storage" },
  ),
);
