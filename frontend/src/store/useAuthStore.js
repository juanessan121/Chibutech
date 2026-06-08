import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      passwordTemporal: false,

      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
          passwordTemporal: userData?.password_temporal || false,
        });
      },

      clearPasswordTemporal: () => set({ passwordTemporal: false }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, passwordTemporal: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
