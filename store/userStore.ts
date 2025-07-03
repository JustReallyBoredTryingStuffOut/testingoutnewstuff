import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user: User) => {
        set({ user });
      },

      updateUser: (updates: Partial<User>) => {
        set(state => ({
          user: state.user ? { ...state.user, ...updates, updatedAt: new Date() } : null
        }));
      },

      logout: () => {
        set({ user: null });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 