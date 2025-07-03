import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from '../types';

interface MealState {
  meals: Meal[];
  currentMeal: Meal | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getMealById: (id: string) => Meal | null;
  addMeal: (meal: Meal) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  clearError: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      meals: [],
      currentMeal: null,
      isLoading: false,
      error: null,

      getMealById: (id: string) => {
        const { meals } = get();
        return meals.find(meal => meal.id === id) || null;
      },

      addMeal: (meal: Meal) => {
        set(state => ({
          meals: [...state.meals, meal],
          currentMeal: meal
        }));
      },

      updateMeal: (id: string, updates: Partial<Meal>) => {
        set(state => ({
          meals: state.meals.map(meal => 
            meal.id === id ? { ...meal, ...updates } : meal
          ),
          currentMeal: state.currentMeal?.id === id 
            ? { ...state.currentMeal, ...updates }
            : state.currentMeal
        }));
      },

      deleteMeal: (id: string) => {
        set(state => ({
          meals: state.meals.filter(meal => meal.id !== id),
          currentMeal: state.currentMeal?.id === id ? null : state.currentMeal
        }));
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'meal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 