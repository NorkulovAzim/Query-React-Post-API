import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (username, password) => {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username,
            password,
          });

          const { token, ...userData } = response.data;

          set({
            isAuthenticated: true,
            user: userData,
            token: token,
          });

          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          return true;
        } catch (error) {
          console.error("Login error:", error);
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },

      logout: () => {
        delete axios.defaults.headers.common["Authorization"];

        set({ isAuthenticated: false, user: null, token: null });
      },

      fetchUserProfile: async () => {
        try {
          const state = get();
          if (!state.token) return null;

          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });

          set({ user: response.data });
          return response.data;
        } catch (error) {
          console.error("Fetch user profile error:", error);
          if (error.response?.status === 401) {
            get().logout();
          }
          throw new Error(
            error.response?.data?.message || "Failed to fetch user profile"
          );
        }
      },

      initializeAuth: async () => {
        const state = get();
        if (state.token) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${state.token}`;

          try {
            await state.fetchUserProfile();
          } catch {
            state.logout();
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

useAuthStore.getState().initializeAuth();

export default useAuthStore;
