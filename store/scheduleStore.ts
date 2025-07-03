import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Schedule, ScheduledWorkout, ScheduledMeal } from '../types';

interface ScheduleState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getScheduleByDate: (userId: string, date: Date) => ScheduleItem[];
  addScheduleItem: (item: ScheduleItem) => void;
  deleteScheduleItem: (itemId: string) => void;
  updateScheduleItem: (itemId: string, updates: Partial<ScheduleItem>) => void;
  setCurrentSchedule: (schedule: Schedule | null) => void;
  clearError: () => void;
}

interface ScheduleItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'workout' | 'meal' | 'reminder';
  isCompleted: boolean;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: [],
      currentSchedule: null,
      isLoading: false,
      error: null,

      getScheduleByDate: (userId: string, date: Date) => {
        // This would typically fetch from a database
        // For now, return empty array
        return [];
      },

      addScheduleItem: (item: ScheduleItem) => {
        set(state => ({
          schedules: [...state.schedules, {
            id: Date.now().toString(),
            userId: item.userId,
            name: item.title,
            description: item.description,
            workouts: [],
            nutrition: [],
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }]
        }));
      },

      deleteScheduleItem: (itemId: string) => {
        set(state => ({
          schedules: state.schedules.filter(s => s.id !== itemId),
          currentSchedule: state.currentSchedule?.id === itemId ? null : state.currentSchedule
        }));
      },

      updateScheduleItem: (itemId: string, updates: Partial<ScheduleItem>) => {
        set(state => ({
          schedules: state.schedules.map(s => 
            s.id === itemId ? { ...s, ...updates, updatedAt: new Date() } : s
          ),
          currentSchedule: state.currentSchedule?.id === itemId 
            ? { ...state.currentSchedule, ...updates, updatedAt: new Date() }
            : state.currentSchedule
        }));
      },

      setCurrentSchedule: (schedule: Schedule | null) => {
        set({ currentSchedule: schedule });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 