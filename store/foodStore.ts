import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food } from '../types';

interface FoodState {
  foods: Food[];
  currentFood: Food | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getFoodById: (id: string) => Food | null;
  addFood: (food: Food) => void;
  updateFood: (id: string, updates: Partial<Food>) => void;
  deleteFood: (id: string) => void;
  searchFoods: (query: string) => Food[];
  clearError: () => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      foods: [],
      currentFood: null,
      isLoading: false,
      error: null,

      getFoodById: (id: string) => {
        const { foods } = get();
        return foods.find(food => food.id === id) || null;
      },

      addFood: (food: Food) => {
        set(state => ({
          foods: [...state.foods, food],
          currentFood: food
        }));
      },

      updateFood: (id: string, updates: Partial<Food>) => {
        set(state => ({
          foods: state.foods.map(food => 
            food.id === id ? { ...food, ...updates } : food
          ),
          currentFood: state.currentFood?.id === id 
            ? { ...state.currentFood, ...updates }
            : state.currentFood
        }));
      },

      deleteFood: (id: string) => {
        set(state => ({
          foods: state.foods.filter(food => food.id !== id),
          currentFood: state.currentFood?.id === id ? null : state.currentFood
        }));
      },

      searchFoods: (query: string) => {
        const { foods } = get();
        const lowercaseQuery = query.toLowerCase();
        return foods.filter(food => 
          food.name.toLowerCase().includes(lowercaseQuery) ||
          food.brand?.toLowerCase().includes(lowercaseQuery)
        );
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 