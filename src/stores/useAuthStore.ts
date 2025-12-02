import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender: string;
  isAdmin: boolean;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: (user: User) => set({ 
        user, 
        isLoggedIn: true, 
        isLoading: false,
        error: null 
      }),

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await fetch('/api/auth/logout', { 
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isLoggedIn: false, 
            isLoading: false,
            error: null 
          });
          localStorage.removeItem('auth-storage');
        }
      },

      setUser: (user: User) => set({ user }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
          });

          if (!response.ok) {
            set({ user: null, isLoggedIn: false, isLoading: false });
            return;
          }

          const data = await response.json();
          if (data.user) {
            set({ 
              user: data.user, 
              isLoggedIn: true, 
              isLoading: false,
              error: null 
            });
          } else {
            set({ 
              user: null, 
              isLoggedIn: false, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ 
            user: null, 
            isLoggedIn: false, 
            isLoading: false 
          });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update profile');
          }

          const data = await response.json();
          set({ 
            user: data.user, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Profile update error:', error);
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update profile'
          });
          throw error;
        }
      },

      deleteAccount: async (password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/auth/delete-account', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete account');
          }

          set({ 
            user: null, 
            isLoggedIn: false, 
            isLoading: false,
            error: null 
          });
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.error('Delete account error:', error);
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete account'
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);