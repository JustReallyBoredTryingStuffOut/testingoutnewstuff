import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Nutrition, Meal, Food } from '../types';

interface NutritionState {
  nutritionLogs: Nutrition[];
  currentNutrition: Nutrition | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getNutritionByDate: (date: Date) => Nutrition | null;
  addNutritionLog: (nutrition: Nutrition) => void;
  updateNutritionLog: (id: string, updates: Partial<Nutrition>) => void;
  deleteNutritionLog: (id: string) => void;
  addMealToNutrition: (nutritionId: string, meal: Meal) => void;
  removeMealFromNutrition: (nutritionId: string, mealId: string) => void;
  calculateDailyNutrition: (date: Date) => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    waterIntake: number;
  };
  clearError: () => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      nutritionLogs: [],
      currentNutrition: null,
      isLoading: false,
      error: null,

      getNutritionByDate: (date: Date) => {
        const { nutritionLogs } = get();
        const dateString = date.toISOString().split('T')[0];
        return nutritionLogs.find(nutrition => 
          nutrition.date.toISOString().split('T')[0] === dateString
        ) || null;
      },

      addNutritionLog: (nutrition: Nutrition) => {
        set(state => ({
          nutritionLogs: [...state.nutritionLogs, nutrition],
          currentNutrition: nutrition
        }));
      },

      updateNutritionLog: (id: string, updates: Partial<Nutrition>) => {
        set(state => ({
          nutritionLogs: state.nutritionLogs.map(nutrition => 
            nutrition.id === id ? { ...nutrition, ...updates } : nutrition
          ),
          currentNutrition: state.currentNutrition?.id === id 
            ? { ...state.currentNutrition, ...updates }
            : state.currentNutrition
        }));
      },

      deleteNutritionLog: (id: string) => {
        set(state => ({
          nutritionLogs: state.nutritionLogs.filter(nutrition => nutrition.id !== id),
          currentNutrition: state.currentNutrition?.id === id ? null : state.currentNutrition
        }));
      },

      addMealToNutrition: (nutritionId: string, meal: Meal) => {
        set(state => ({
          nutritionLogs: state.nutritionLogs.map(nutrition => 
            nutrition.id === nutritionId 
              ? { ...nutrition, meals: [...nutrition.meals, meal] }
              : nutrition
          )
        }));
      },

      removeMealFromNutrition: (nutritionId: string, mealId: string) => {
        set(state => ({
          nutritionLogs: state.nutritionLogs.map(nutrition => 
            nutrition.id === nutritionId 
              ? { ...nutrition, meals: nutrition.meals.filter(meal => meal.id !== mealId) }
              : nutrition
          )
        }));
      },

      calculateDailyNutrition: (date: Date) => {
        const { nutritionLogs } = get();
        const dateString = date.toISOString().split('T')[0];
        const dayNutrition = nutritionLogs.find(nutrition => 
          nutrition.date.toISOString().split('T')[0] === dateString
        );

        if (!dayNutrition) {
          return { calories: 0, protein: 0, carbs: 0, fat: 0, waterIntake: 0 };
        }

        return {
          calories: dayNutrition.totalCalories,
          protein: dayNutrition.totalProtein,
          carbs: dayNutrition.totalCarbs,
          fat: dayNutrition.totalFat,
          waterIntake: dayNutrition.waterIntake
        };
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'nutrition-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 