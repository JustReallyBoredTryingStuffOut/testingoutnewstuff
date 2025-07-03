import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WaterTrackingMode = "full" | "minimal" | "disabled";

interface SettingsState {
  // Water tracking preferences
  waterTrackingMode: WaterTrackingMode;
  waterTrackingEnabled: boolean;
  
  // Notification preferences
  waterRemindersEnabled: boolean;
  workoutRemindersEnabled: boolean;
  achievementNotificationsEnabled: boolean;
  
  // UI preferences
  showWeeklyProgress: boolean;
  showDailyQuests: boolean;
  showMacroTracking: boolean;
  
  // Privacy preferences
  shareDataWithDevices: boolean;
  allowAnalytics: boolean;
  
  // Actions
  setWaterTrackingMode: (mode: WaterTrackingMode) => void;
  setWaterTrackingEnabled: (enabled: boolean) => void;
  setWaterRemindersEnabled: (enabled: boolean) => void;
  setWorkoutRemindersEnabled: (enabled: boolean) => void;
  setAchievementNotificationsEnabled: (enabled: boolean) => void;
  setShowWeeklyProgress: (show: boolean) => void;
  setShowDailyQuests: (show: boolean) => void;
  setShowMacroTracking: (show: boolean) => void;
  setShareDataWithDevices: (share: boolean) => void;
  setAllowAnalytics: (allow: boolean) => void;
  
  // Bulk actions
  resetToDefaults: () => void;
}

const defaultSettings = {
  waterTrackingMode: "full" as WaterTrackingMode,
  waterTrackingEnabled: true,
  waterRemindersEnabled: true,
  workoutRemindersEnabled: true,
  achievementNotificationsEnabled: true,
  showWeeklyProgress: true,
  showDailyQuests: true,
  showMacroTracking: true,
  shareDataWithDevices: false,
  allowAnalytics: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      setWaterTrackingMode: (mode) => set({ 
        waterTrackingMode: mode,
        waterTrackingEnabled: mode !== "disabled"
      }),
      
      setWaterTrackingEnabled: (enabled) => set({ 
        waterTrackingEnabled: enabled,
        waterTrackingMode: enabled ? "full" : "disabled"
      }),
      
      setWaterRemindersEnabled: (enabled) => set({ waterRemindersEnabled: enabled }),
      
      setWorkoutRemindersEnabled: (enabled) => set({ workoutRemindersEnabled: enabled }),
      
      setAchievementNotificationsEnabled: (enabled) => set({ achievementNotificationsEnabled: enabled }),
      
      setShowWeeklyProgress: (show) => set({ showWeeklyProgress: show }),
      
      setShowDailyQuests: (show) => set({ showDailyQuests: show }),
      
      setShowMacroTracking: (show) => set({ showMacroTracking: show }),
      
      setShareDataWithDevices: (share) => set({ shareDataWithDevices: share }),
      
      setAllowAnalytics: (allow) => set({ allowAnalytics: allow }),
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 