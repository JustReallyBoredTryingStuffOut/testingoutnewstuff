import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeightLog, StepLog, HealthGoals, HealthDevice, ActivityLog, WaterIntake, DeviceSync, DeviceData } from "@/types";
import { Platform } from "react-native";

interface HealthState {
  weightLogs: WeightLog[];
  stepLogs: StepLog[];
  activityLogs: ActivityLog[];
  healthGoals: HealthGoals;
  connectedDevices: HealthDevice[];
  isTrackingSteps: boolean;
  isTrackingLocation: boolean;
  waterIntake: WaterIntake[];
  stepCount: number;
  deviceSyncHistory: DeviceSync[];
  lastDeviceSync: string | null;
  
  // Actions
  addWeightLog: (log: WeightLog) => void;
  updateWeightLog: (log: WeightLog) => void;
  removeWeightLog: (id: string) => void;
  deleteWeightLog: (id: string) => void; // Alias for removeWeightLog
  
  addStepLog: (log: StepLog) => void;
  updateStepLog: (log: StepLog) => void;
  clearStepLogs: () => void;
  
  addActivityLog: (log: ActivityLog) => void;
  updateActivityLog: (log: ActivityLog) => void;
  removeActivityLog: (id: string) => void;
  
  updateHealthGoals: (goals: HealthGoals) => void;
  
  addDevice: (device: HealthDevice) => void;
  updateDevice: (device: HealthDevice) => void;
  removeDevice: (id: string) => void;
  
  setIsTrackingSteps: (isTracking: boolean) => void;
  setIsTrackingLocation: (isTracking: boolean) => void;
  
  // Water intake tracking
  addWaterIntake: (amount: number) => void;
  updateWaterIntake: (id: string, amount: number) => void;
  removeWaterIntake: (id: string) => void;
  
  // Step count tracking
  updateStepCount: (count: number) => void;
  
  // Device sync methods
  syncDeviceData: (deviceId: string, data: DeviceData) => void;
  recordDeviceSync: (deviceId: string, deviceName: string, dataTypes: string[]) => void;
  getLastSyncTimeForDevice: (deviceId: string) => string | null;
  getDeviceSyncHistory: (deviceId: string) => DeviceSync[];
  
  // Calculations
  calculateWeightProgress: () => {
    currentWeight: number;
    startWeight: number;
    targetWeight: number;
    weightLost: number;
    percentComplete: number;
    remainingWeight: number;
  };
  
  getStepsForDate: (date: string) => StepLog | undefined;
  getStepsForWeek: () => StepLog[];
  getStepsForMonth: () => StepLog[];
  
  getWeightTrend: (days: number) => {
    dates: string[];
    weights: number[];
  };
  
  getActivityLogsByType: (type: string) => ActivityLog[];
  getActivityLogsByDate: (startDate: string, endDate: string) => ActivityLog[];
  getRecentActivityLogs: (count: number) => ActivityLog[];
  
  calculateTotalDistance: (type?: string) => number;
  calculateTotalCaloriesBurned: (type?: string) => number;
  calculateTotalDuration: (type?: string) => number;
  
  // Water intake calculations
  getWaterIntakeForDate: (date: string) => number;
  getWaterIntakeForWeek: () => { dates: string[], amounts: number[] };
  getWaterIntakeForMonth: () => { dates: string[], amounts: number[] };
  
  // Device-specific methods
  isAppleWatchConnected: () => boolean;
  getConnectedDeviceById: (deviceId: string) => HealthDevice | undefined;
  getConnectedDeviceByType: (type: string) => HealthDevice | undefined;
  getDevicesByType: (type: string) => HealthDevice[];
  importDataFromDevice: (deviceId: string, dataType: string, startDate: string, endDate: string) => Promise<boolean>;
}

const defaultHealthGoals: HealthGoals = {
  dailySteps: 10000,
  weeklyWorkouts: 4,
  targetWeight: 0, // Will be set based on user profile
  targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      weightLogs: [],
      stepLogs: [],
      activityLogs: [],
      healthGoals: defaultHealthGoals,
      connectedDevices: [],
      isTrackingSteps: false,
      isTrackingLocation: false,
      waterIntake: [], // Initialize with empty array
      stepCount: 0, // Initialize with 0
      deviceSyncHistory: [], // Track device sync history
      lastDeviceSync: null, // Last device sync timestamp
      
      addWeightLog: (log) => set((state) => ({
        weightLogs: [...state.weightLogs, log]
      })),
      
      updateWeightLog: (log) => set((state) => ({
        weightLogs: state.weightLogs.map(l => l.id === log.id ? log : l)
      })),
      
      removeWeightLog: (id) => set((state) => ({
        weightLogs: state.weightLogs.filter(l => l.id !== id)
      })),
      
      // Alias for removeWeightLog for backward compatibility
      deleteWeightLog: (id) => set((state) => ({
        weightLogs: state.weightLogs.filter(l => l.id !== id)
      })),
      
      addStepLog: (log) => set((state) => {
        // Check if a log for this date already exists
        const existingLogIndex = state.stepLogs.findIndex(
          l => new Date(l.date).toDateString() === new Date(log.date).toDateString()
        );
        
        if (existingLogIndex >= 0) {
          // Update existing log
          const updatedLogs = [...state.stepLogs];
          updatedLogs[existingLogIndex] = log;
          return { stepLogs: updatedLogs };
        } else {
          // Add new log
          return { stepLogs: [...state.stepLogs, log] };
        }
      }),
      
      updateStepLog: (log) => set((state) => ({
        stepLogs: state.stepLogs.map(l => l.id === log.id ? log : l)
      })),
      
      clearStepLogs: () => set({ stepLogs: [] }),
      
      addActivityLog: (log) => set((state) => ({
        activityLogs: [...state.activityLogs, log]
      })),
      
      updateActivityLog: (log) => set((state) => ({
        activityLogs: state.activityLogs.map(l => l.id === log.id ? log : l)
      })),
      
      removeActivityLog: (id) => set((state) => ({
        activityLogs: state.activityLogs.filter(l => l.id !== id)
      })),
      
      updateHealthGoals: (goals) => set({ healthGoals: goals }),
      
      addDevice: (device) => set((state) => ({
        connectedDevices: [...state.connectedDevices, device]
      })),
      
      updateDevice: (device) => set((state) => ({
        connectedDevices: state.connectedDevices.map(d => d.id === device.id ? device : d)
      })),
      
      removeDevice: (id) => set((state) => ({
        connectedDevices: state.connectedDevices.filter(d => d.id !== id)
      })),
      
      setIsTrackingSteps: (isTracking) => set({ isTrackingSteps: isTracking }),
      
      setIsTrackingLocation: (isTracking) => set({ isTrackingLocation: isTracking }),
      
      // Water intake tracking
      addWaterIntake: (amount) => set((state) => ({
        waterIntake: [...state.waterIntake, {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          amount
        }]
      })),
      
      updateWaterIntake: (id, amount) => set((state) => ({
        waterIntake: state.waterIntake.map(entry => 
          entry.id === id ? { ...entry, amount } : entry
        )
      })),
      
      removeWaterIntake: (id) => set((state) => ({
        waterIntake: state.waterIntake.filter(entry => entry.id !== id)
      })),
      
      // Step count tracking
      updateStepCount: (count) => set({ stepCount: count }),
      
      // Device sync methods
      syncDeviceData: (deviceId, data) => set((state) => {
        const device = state.connectedDevices.find(d => d.id === deviceId);
        if (!device) return state;
        
        let updatedStepLogs = [...state.stepLogs];
        let updatedActivityLogs = [...state.activityLogs];
        
        // Process step data
        if (data.steps && data.steps.length > 0) {
          data.steps.forEach(stepData => {
            const existingLogIndex = updatedStepLogs.findIndex(
              l => new Date(l.date).toDateString() === new Date(stepData.date).toDateString()
            );
            
            if (existingLogIndex >= 0) {
              // Update existing log if device data has more steps
              if (stepData.steps > updatedStepLogs[existingLogIndex].steps) {
                updatedStepLogs[existingLogIndex] = {
                  ...updatedStepLogs[existingLogIndex],
                  steps: stepData.steps,
                  distance: stepData.distance || updatedStepLogs[existingLogIndex].distance,
                  calories: stepData.calories || updatedStepLogs[existingLogIndex].calories,
                  source: device.name,
                  deviceId: device.id
                };
              }
            } else {
              // Add new log
              updatedStepLogs.push({
                id: Date.now().toString() + Math.random().toString(),
                date: stepData.date,
                steps: stepData.steps,
                distance: stepData.distance || calculateDistance(stepData.steps),
                calories: stepData.calories || calculateCaloriesBurned(stepData.steps),
                source: device.name,
                deviceId: device.id
              });
            }
          });
        }
        
        // Process activity data
        if (data.activities && data.activities.length > 0) {
          data.activities.forEach(activityData => {
            // Check if this activity already exists
            const existingActivity = updatedActivityLogs.find(
              a => a.externalId === activityData.externalId
            );
            
            if (!existingActivity) {
              // Add new activity log
              updatedActivityLogs.push({
                id: Date.now().toString() + Math.random().toString(),
                type: activityData.type,
                date: activityData.date,
                duration: activityData.duration,
                distance: activityData.distance,
                calories: activityData.calories,
                notes: activityData.notes || "",
                isOutdoor: activityData.isOutdoor || false,
                location: activityData.location || "",
                source: device.name,
                deviceId: device.id,
                externalId: activityData.externalId,
                heartRate: activityData.heartRate,
                elevationGain: activityData.elevationGain,
                route: activityData.route
              });
            }
          });
        }
        
        // Update device last synced time
        const updatedDevices = state.connectedDevices.map(d => 
          d.id === deviceId ? { ...d, lastSynced: new Date().toISOString() } : d
        );
        
        // Record sync in history
        const syncTypes = [];
        if (data.steps && data.steps.length > 0) syncTypes.push("steps");
        if (data.activities && data.activities.length > 0) syncTypes.push("activities");
        
        const newSyncRecord: DeviceSync = {
          id: Date.now().toString(),
          deviceId,
          deviceName: device.name,
          timestamp: new Date().toISOString(),
          dataTypes: syncTypes,
          recordCount: (data.steps?.length || 0) + (data.activities?.length || 0)
        };
        
        return {
          stepLogs: updatedStepLogs,
          activityLogs: updatedActivityLogs,
          connectedDevices: updatedDevices,
          deviceSyncHistory: [...state.deviceSyncHistory, newSyncRecord],
          lastDeviceSync: new Date().toISOString()
        };
      }),
      
      recordDeviceSync: (deviceId, deviceName, dataTypes) => set((state) => {
        const newSyncRecord: DeviceSync = {
          id: Date.now().toString(),
          deviceId,
          deviceName,
          timestamp: new Date().toISOString(),
          dataTypes,
          recordCount: 0 // Can be updated later if needed
        };
        
        return {
          deviceSyncHistory: [...state.deviceSyncHistory, newSyncRecord],
          lastDeviceSync: new Date().toISOString()
        };
      }),
      
      getLastSyncTimeForDevice: (deviceId) => {
        const { deviceSyncHistory } = get();
        const deviceSyncs = deviceSyncHistory.filter(sync => sync.deviceId === deviceId);
        
        if (deviceSyncs.length === 0) return null;
        
        // Sort by timestamp (newest first)
        deviceSyncs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        return deviceSyncs[0].timestamp;
      },
      
      getDeviceSyncHistory: (deviceId) => {
        const { deviceSyncHistory } = get();
        return deviceSyncHistory.filter(sync => sync.deviceId === deviceId);
      },
      
      calculateWeightProgress: () => {
        const { weightLogs, healthGoals } = get();
        
        if (weightLogs.length === 0) {
          return {
            currentWeight: 0,
            startWeight: 0,
            targetWeight: healthGoals.targetWeight,
            weightLost: 0,
            percentComplete: 0,
            remainingWeight: 0
          };
        }
        
        // Sort logs by date
        const sortedLogs = [...weightLogs].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        const startWeight = sortedLogs[0].weight;
        const currentWeight = sortedLogs[sortedLogs.length - 1].weight;
        const targetWeight = healthGoals.targetWeight;
        
        // Calculate weight lost (can be negative if gained weight)
        const weightLost = startWeight - currentWeight;
        
        // Calculate remaining weight to lose
        const remainingWeight = currentWeight - targetWeight;
        
        // Calculate percent complete
        const totalToLose = startWeight - targetWeight;
        const percentComplete = totalToLose <= 0 ? 0 : Math.min(100, (weightLost / totalToLose) * 100);
        
        return {
          currentWeight,
          startWeight,
          targetWeight,
          weightLost,
          percentComplete,
          remainingWeight
        };
      },
      
      getStepsForDate: (date) => {
        const { stepLogs } = get();
        return stepLogs.find(
          log => new Date(log.date).toDateString() === new Date(date).toDateString()
        );
      },
      
      getStepsForWeek: () => {
        const { stepLogs } = get();
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return stepLogs.filter(
          log => new Date(log.date) >= oneWeekAgo && new Date(log.date) <= today
        );
      },
      
      getStepsForMonth: () => {
        const { stepLogs } = get();
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return stepLogs.filter(
          log => new Date(log.date) >= oneMonthAgo && new Date(log.date) <= today
        );
      },
      
      getWeightTrend: (days) => {
        const { weightLogs } = get();
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - days);
        
        // Filter logs within the date range
        const filteredLogs = weightLogs.filter(
          log => new Date(log.date) >= startDate && new Date(log.date) <= today
        );
        
        // Sort by date
        const sortedLogs = [...filteredLogs].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        // Extract dates and weights
        const dates = sortedLogs.map(log => {
          const date = new Date(log.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
        const weights = sortedLogs.map(log => log.weight);
        
        return { dates, weights };
      },
      
      getActivityLogsByType: (type) => {
        const { activityLogs } = get();
        return activityLogs.filter(log => log.type === type);
      },
      
      getActivityLogsByDate: (startDate, endDate) => {
        const { activityLogs } = get();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return activityLogs.filter(
          log => {
            const logDate = new Date(log.date);
            return logDate >= start && logDate <= end;
          }
        );
      },
      
      getRecentActivityLogs: (count) => {
        const { activityLogs } = get();
        
        // Sort by date (most recent first)
        const sortedLogs = [...activityLogs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Return the specified number of logs
        return sortedLogs.slice(0, count);
      },
      
      calculateTotalDistance: (type) => {
        const { activityLogs } = get();
        const filteredLogs = type 
          ? activityLogs.filter(log => log.type === type)
          : activityLogs;
        
        return filteredLogs.reduce((total, log) => total + log.distance, 0);
      },
      
      calculateTotalCaloriesBurned: (type) => {
        const { activityLogs } = get();
        const filteredLogs = type 
          ? activityLogs.filter(log => log.type === type)
          : activityLogs;
        
        return filteredLogs.reduce((total, log) => total + log.calories, 0);
      },
      
      calculateTotalDuration: (type) => {
        const { activityLogs } = get();
        const filteredLogs = type 
          ? activityLogs.filter(log => log.type === type)
          : activityLogs;
        
        return filteredLogs.reduce((total, log) => total + log.duration, 0);
      },
      
      // Water intake calculations
      getWaterIntakeForDate: (date) => {
        const { waterIntake } = get();
        const targetDate = new Date(date).toDateString();
        
        return waterIntake
          .filter(entry => new Date(entry.date).toDateString() === targetDate)
          .reduce((total, entry) => total + entry.amount, 0);
      },
      
      getWaterIntakeForWeek: () => {
        const { waterIntake } = get();
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // Get entries for the past week
        const weekEntries = waterIntake.filter(
          entry => new Date(entry.date) >= oneWeekAgo && new Date(entry.date) <= today
        );
        
        // Group by date
        const dateMap: Record<string, number> = {};
        
        weekEntries.forEach(entry => {
          const dateStr = new Date(entry.date).toDateString();
          dateMap[dateStr] = (dateMap[dateStr] || 0) + entry.amount;
        });
        
        // Convert to arrays for charting
        const dates = Object.keys(dateMap).map(dateStr => {
          const date = new Date(dateStr);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
        const amounts = Object.values(dateMap);
        
        return { dates, amounts };
      },
      
      getWaterIntakeForMonth: () => {
        const { waterIntake } = get();
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        // Get entries for the past month
        const monthEntries = waterIntake.filter(
          entry => new Date(entry.date) >= oneMonthAgo && new Date(entry.date) <= today
        );
        
        // Group by date
        const dateMap: Record<string, number> = {};
        
        monthEntries.forEach(entry => {
          const dateStr = new Date(entry.date).toDateString();
          dateMap[dateStr] = (dateMap[dateStr] || 0) + entry.amount;
        });
        
        // Convert to arrays for charting
        const dates = Object.keys(dateMap).map(dateStr => {
          const date = new Date(dateStr);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
        const amounts = Object.values(dateMap);
        
        return { dates, amounts };
      },
      
      // Device-specific methods
      isAppleWatchConnected: () => {
        const { connectedDevices } = get();
        return connectedDevices.some(device => 
          device.type === "appleWatch" && device.connected
        );
      },
      
      getConnectedDeviceById: (deviceId) => {
        const { connectedDevices } = get();
        return connectedDevices.find(device => device.id === deviceId);
      },
      
      getConnectedDeviceByType: (type) => {
        const { connectedDevices } = get();
        return connectedDevices.find(device => 
          device.type === type && device.connected
        );
      },
      
      getDevicesByType: (type) => {
        const { connectedDevices } = get();
        return connectedDevices.filter(device => device.type === type);
      },
      
      importDataFromDevice: async (deviceId, dataType, startDate, endDate) => {
        // This would be implemented with actual HealthKit/Google Fit integration
        // For now, we'll simulate a successful import with mock data
        
        const { connectedDevices } = get();
        const device = connectedDevices.find(d => d.id === deviceId);
        
        if (!device || !device.connected) {
          console.error("Device not found or not connected");
          return false;
        }
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Generate mock data based on device type and data type
          const mockData: DeviceData = { 
            deviceId,
            deviceType: device.type
          };
          
          const start = new Date(startDate);
          const end = new Date(endDate);
          const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dataType === "steps" || dataType === "all") {
            mockData.steps = [];
            
            // Generate step data for each day in the range
            for (let i = 0; i <= daysDiff; i++) {
              const currentDate = new Date(start);
              currentDate.setDate(currentDate.getDate() + i);
              
              const steps = Math.floor(5000 + Math.random() * 7000); // Random steps between 5000-12000
              
              mockData.steps.push({
                date: currentDate.toISOString(),
                steps,
                distance: calculateDistance(steps),
                calories: calculateCaloriesBurned(steps)
              });
            }
          }
          
          if (dataType === "activities" || dataType === "all") {
            mockData.activities = [];
            
            // Generate 1-3 random activities in the date range
            const numActivities = Math.floor(1 + Math.random() * 3);
            const activityTypes = ["walking", "running", "cycling", "swimming", "hiking"];
            
            for (let i = 0; i < numActivities; i++) {
              const activityDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
              const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
              const duration = Math.floor(20 + Math.random() * 70); // 20-90 minutes
              const distance = parseFloat((1 + Math.random() * 9).toFixed(2)); // 1-10 km
              const calories = Math.floor(duration * (activityType === "running" ? 10 : activityType === "cycling" ? 8 : 5));
              
              mockData.activities.push({
                externalId: `${device.type}_${Date.now()}_${i}`,
                type: activityType,
                date: activityDate.toISOString(),
                duration,
                distance,
                calories,
                isOutdoor: Math.random() > 0.3, // 70% chance of outdoor
                heartRate: {
                  avg: Math.floor(120 + Math.random() * 40),
                  max: Math.floor(160 + Math.random() * 30),
                  min: Math.floor(80 + Math.random() * 20)
                },
                elevationGain: activityType === "hiking" ? Math.floor(50 + Math.random() * 200) : 0
              });
            }
          }
          
          // Sync the mock data
          get().syncDeviceData(deviceId, mockData);
          
          // Record the sync
          get().recordDeviceSync(
            deviceId, 
            device.name, 
            dataType === "all" ? ["steps", "activities"] : [dataType]
          );
          
          return true;
        } catch (error) {
          console.error("Error importing data from device:", error);
          return false;
        }
      }
    }),
    {
      name: "health-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper functions
const calculateDistance = (steps: number): number => {
  // Average stride length is about 0.762 meters
  // 1 step ≈ 0.762 meters
  const distanceInMeters = steps * 0.762;
  return parseFloat((distanceInMeters / 1000).toFixed(2)); // Convert to km
};

const calculateCaloriesBurned = (steps: number): number => {
  // Very rough estimate: 1 step ≈ 0.04 calories
  return Math.round(steps * 0.04);
};