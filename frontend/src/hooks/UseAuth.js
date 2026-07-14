import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const { user, token, isAuthenticated, login, signup, logout, setAuth } =
    useAuthStore();
  return { user, token, isAuthenticated, login, signup, logout, setAuth };
}
