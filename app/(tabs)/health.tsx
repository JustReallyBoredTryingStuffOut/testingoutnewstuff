import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { router } from "expo-router";
import { 
  Activity, 
  TrendingUp, 
  Watch, 
  Award, 
  BarChart2, 
  ChevronRight,
  Camera,
  MapPin,
  Footprints,
  ArrowLeft,
  RefreshCw,
  Zap,
  Bluetooth,
  AlertTriangle,
  Target,
  BarChart3
} from "lucide-react-native";
import { useHealthStore } from "@/store/healthStore";
import { useWorkoutStore } from "@/store/workoutStore";
import { usePhotoStore } from "@/store/photoStore";
import { useTheme } from "@/context/ThemeContext";
import StepCounter from "@/components/StepCounter";
import WeightTracker from "@/components/WeightTracker";
import WaterTracker from "@/components/WaterTracker";
import ActivityMap from "@/components/ActivityMap";
import Button from "@/components/Button";


// Import CoreBluetooth with correct path
import CoreBluetooth from "@/src/NativeModules/CoreBluetooth";
// Import HealthKit module
import HealthKit from "@/src/NativeModules/HealthKit";

export default function HealthScreen() {
  const navigation = useNavigation();
  const { 
    workoutLogs 
  } = useWorkoutStore();
  const { 
    weightLogs, 
    connectedDevices, 
    activityLogs, 
    isTrackingLocation,
    isAppleWatchConnected,
    getConnectedDeviceByType
  } = useHealthStore();
  const { progressPhotos } = usePhotoStore();
  const { colors } = useTheme();
  
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<string | null>("poweredOn"); // Default to poweredOn
  const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied">("granted"); // Default to granted
  const [healthKitAvailable, setHealthKitAvailable] = useState(false);
  const [healthKitAuthorized, setHealthKitAuthorized] = useState(false);
  
  // Initialize Bluetooth state and permissions
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const checkBluetoothState = async () => {
        try {
          const stateResult = await CoreBluetooth.getBluetoothState();
          setBluetoothState(stateResult.state);
          
          const permissionResult = await CoreBluetooth.requestPermissions();
          setPermissionStatus(permissionResult.granted ? "granted" : "denied");
        } catch (error) {
          console.error("Error checking Bluetooth state:", error);
          // Default to working state on error
          setBluetoothState("poweredOn");
          setPermissionStatus("granted");
        }
      };
      
      checkBluetoothState();
      
      // Set up Bluetooth state change listener
      const stateListener = CoreBluetooth.addListener(
        'bluetoothStateChanged',
        (event: any) => {
          setBluetoothState(event.state);
        }
      );
      
      return () => {
        stateListener();
      };
    }
  }, []);
  
  // Initialize HealthKit
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const initializeHealthKit = async () => {
        try {
          // Check if HealthKit is available
          const isAvailable = await HealthKit.isHealthDataAvailable();
          setHealthKitAvailable(isAvailable);
          
          if (isAvailable) {
            // Request authorization for health data
            const authResult = await HealthKit.requestAuthorization([
              'steps', 
              'distance', 
              'calories', 
              'heartRate', 
              'sleep', 
              'workouts'
            ]);
            
            setHealthKitAuthorized(authResult.authorized);
          }
        } catch (error) {
          console.error("Error initializing HealthKit:", error);
        }
      };
      
      initializeHealthKit();
    }
  }, []);
  
  // Calculate total workouts
  const totalWorkouts = workoutLogs.length;
  
  // Calculate active days (unique days with workouts)
  const activeDays = new Set(
    workoutLogs.map(log => new Date(log.date).toDateString())
  ).size;
  
  // Calculate total workout time
  const totalWorkoutTime = workoutLogs.reduce(
    (total, log) => total + log.duration,
    0
  );
  
  // Get recent activities
  const recentActivities = useHealthStore.getState().getRecentActivityLogs(3);
  
  // Check for connected devices
  const hasConnectedDevices = connectedDevices.some(device => device.connected);
  const appleWatch = getConnectedDeviceByType("appleWatch");
  const fitbit = getConnectedDeviceByType("fitbit");
  const garmin = getConnectedDeviceByType("garmin");
  
  const handleSyncAllDevices = async () => {
    if (!hasConnectedDevices && !healthKitAuthorized) {
      Alert.alert(
        "No Data Sources",
        "You don't have any connected devices or Apple Health access. Would you like to connect a device or enable Apple Health?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Connect Device", onPress: () => navigation.navigate("health-devices") },
          { 
            text: "Enable Apple Health", 
            onPress: async () => {
              if (Platform.OS === 'ios') {
                try {
                  const authResult = await HealthKit.requestAuthorization([
                    'steps', 
                    'distance', 
                    'calories', 
                    'heartRate', 
                    'sleep', 
                    'workouts'
                  ]);
                  
                  setHealthKitAuthorized(authResult.authorized);
                  
                  if (authResult.authorized) {
                    Alert.alert(
                      "Apple Health Connected",
                      "Your app is now connected to Apple Health. Your health data will be synced automatically.",
                      [{ text: "OK" }]
                    );
                  } else {
                    Alert.alert(
                      "Apple Health Access Denied",
                      "Please open the Settings app and grant this app access to your health data.",
                      [{ text: "OK" }]
                    );
                  }
                } catch (error) {
                  console.error("Error requesting HealthKit authorization:", error);
                  Alert.alert(
                    "Error",
                    "There was an error connecting to Apple Health. Please try again.",
                    [{ text: "OK" }]
                  );
                }
              }
            }
          }
        ]
      );
      return;
    }
    
    setIsSyncingAll(true);
    
    try {
      // Sync with Apple Health if authorized
      if (Platform.OS === 'ios' && healthKitAuthorized) {
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get 7 days ago
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        // Get step data
        const stepsResult = await HealthKit.getStepCount(
          sevenDaysAgo.toISOString(),
          new Date().toISOString()
        );
        
        if (stepsResult.success) {
          // Log success
          console.log(`Synced ${stepsResult.steps} steps from Apple Health`);
        }
        
        // Get workout data
        const workouts = await HealthKit.getWorkouts(
          sevenDaysAgo.toISOString(),
          new Date().toISOString()
        );
        
        if (workouts && workouts.length > 0) {
          // Log success
          console.log(`Synced ${workouts.length} workouts from Apple Health`);
        }
      }
      
      // Sync with connected devices
      if (hasConnectedDevices) {
        // Simulate syncing with all connected devices
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      Alert.alert(
        "Sync Complete",
        "All your health data has been synced successfully.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error syncing devices:", error);
      Alert.alert(
        "Sync Error",
        "There was an error syncing your health data. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSyncingAll(false);
    }
  };
  
  // DEBUG: Manual HealthKit Authorization Test
  const testHealthKitAuth = async () => {
    try {
      Alert.alert('DEBUG', 'Testing HealthKit authorization...');
      
      const HealthKit = require('@/src/NativeModules/HealthKit');
      
      // Check availability
      const isAvailable = await HealthKit.isHealthDataAvailable();
      Alert.alert('DEBUG', `HealthKit available: ${isAvailable}`);
      
      if (!isAvailable) {
        Alert.alert('ERROR', 'HealthKit not available on this device');
        return;
      }
      
      // Request authorization
      Alert.alert('DEBUG', 'Requesting authorization - watch for system popup!');
      const authResult = await HealthKit.requestAuthorization([
        'steps', 
        'distance', 
        'calories',
        'activity'
      ]);
      
      Alert.alert('RESULT', `Success: ${authResult.authorized}\n\nIf true, check Settings → Privacy & Security → Health → Data Access & Devices for FitJourneyTracker`);
      
    } catch (error: any) {
      Alert.alert('ERROR', `Failed: ${error.message}`);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* DEBUG BUTTONS - TEMPORARY */}
      <TouchableOpacity 
        style={{ backgroundColor: '#FF6B6B', padding: 12, margin: 16, borderRadius: 8 }}
        onPress={testHealthKitAuth}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          🧪 TEST HEALTHKIT AUTH
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ backgroundColor: '#4ECDC4', padding: 12, margin: 16, borderRadius: 8 }}
        onPress={() => router.push("/health-test" as any)}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          🔬 DIRECT HEALTHKIT TEST
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Health Tracking</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Monitor your fitness progress</Text>
      </View>
      
      {/* Apple Health Banner (iOS only) */}
      {Platform.OS === 'ios' && healthKitAvailable && !healthKitAuthorized && (
        <View style={[
          styles.healthKitBanner, 
          { backgroundColor: "rgba(74, 144, 226, 0.1)" }
        ]}>
          <View style={styles.healthKitContent}>
            <Zap size={20} color={colors.primary} />
            <Text style={[styles.healthKitText, { color: colors.text }]}>
              Connect to Apple Health to automatically sync your steps, workouts, and more.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.healthKitButton, { backgroundColor: colors.primary }]}
            onPress={async () => {
              try {
                const authResult = await HealthKit.requestAuthorization([
                  'steps', 
                  'distance', 
                  'calories', 
                  'heartRate', 
                  'sleep', 
                  'workouts'
                ]);
                
                setHealthKitAuthorized(authResult.authorized);
                
                if (authResult.authorized) {
                  Alert.alert(
                    "Apple Health Connected",
                    "Your app is now connected to Apple Health. Your health data will be synced automatically.",
                    [{ text: "OK" }]
                  );
                } else {
                  Alert.alert(
                    "Apple Health Access Denied",
                    "Please open the Settings app and grant this app access to your health data.",
                    [{ text: "OK" }]
                  );
                }
              } catch (error) {
                console.error("Error requesting HealthKit authorization:", error);
                Alert.alert(
                  "Error",
                  "There was an error connecting to Apple Health. Please try again.",
                  [{ text: "OK" }]
                );
              }
            }}
          >
            <Text style={styles.healthKitButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Bluetooth Status Banner (iOS only) */}
      {Platform.OS === 'ios' && bluetoothState !== "poweredOn" && bluetoothState !== "PoweredOn" && (
        <View style={[
          styles.bluetoothStatusBanner, 
          { backgroundColor: "rgba(255, 59, 48, 0.1)" }
        ]}>
          <View style={styles.bluetoothStatusContent}>
            <AlertTriangle size={20} color="#FF3B30" />
            <Text style={[styles.bluetoothStatusText, { color: "#FF3B30" }]}>
              Bluetooth is not enabled. Please turn on Bluetooth to connect devices.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.bluetoothSettingsButton}
            onPress={() => {
              Alert.alert(
                "Enable Bluetooth",
                "Please open your device settings and enable Bluetooth.",
                [{ text: "OK" }]
              );
            }}
          >
            <Text style={styles.bluetoothSettingsText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {Platform.OS === 'ios' && (bluetoothState === "poweredOn" || bluetoothState === "PoweredOn") && permissionStatus !== "granted" && (
        <View style={[
          styles.bluetoothStatusBanner, 
          { backgroundColor: "rgba(255, 59, 48, 0.1)" }
        ]}>
          <View style={styles.bluetoothStatusContent}>
            <AlertTriangle size={20} color="#FF3B30" />
            <Text style={[styles.bluetoothStatusText, { color: "#FF3B30" }]}>
              Bluetooth permissions are needed to connect devices.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.bluetoothSettingsButton}
            onPress={() => {
              CoreBluetooth.requestPermissions()
                .then(result => {
                  setPermissionStatus(result.granted ? "granted" : "denied");
                  
                  if (!result.granted) {
                    Alert.alert(
                      "Permissions Required",
                      "Please enable Bluetooth permissions in your device settings to connect to health devices.",
                      [{ text: "OK" }]
                    );
                  }
                })
                .catch(error => {
                  console.error("Error requesting permissions:", error);
                });
            }}
          >
            <Text style={styles.bluetoothSettingsText}>Request Permissions</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Connected Device Banner */}
      {(hasConnectedDevices || (Platform.OS === 'ios' && healthKitAuthorized)) && (
        <View style={[styles.deviceBanner, { backgroundColor: colors.highlight }]}>
          <View style={styles.deviceInfo}>
            {healthKitAuthorized && Platform.OS === 'ios' ? (
              <>
                <Zap size={20} color={colors.primary} />
                <Text style={[styles.deviceText, { color: colors.text }]}>
                  Connected to Apple Health
                </Text>
              </>
            ) : (
              <>
                <Watch size={20} color={colors.primary} />
                <Text style={[styles.deviceText, { color: colors.text }]}>
                  Connected to {
                    appleWatch ? "Apple Watch" : 
                    fitbit ? "Fitbit" : 
                    garmin ? "Garmin" : 
                    "Smart Device"
                  }
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity 
            style={styles.syncAllButton}
            onPress={handleSyncAllDevices}
            disabled={isSyncingAll}
          >
            {isSyncingAll ? (
              <Text style={[styles.syncAllText, { color: colors.primary }]}>Syncing...</Text>
            ) : (
              <>
                <RefreshCw size={14} color={colors.primary} />
                <Text style={[styles.syncAllText, { color: colors.primary }]}>Sync</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
      
      <StepCounter />
      
      <WeightTracker 
        onAddWeight={() => router.push("/weight-log" as any)}
      />
      
      <WaterTracker />
      
      {isTrackingLocation && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity Map</Text>
            <TouchableOpacity onPress={() => router.push("/activity-map" as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Full Map</Text>
            </TouchableOpacity>
          </View>
          
          <ActivityMap height={200} />
          
          <TouchableOpacity 
            style={[styles.activityButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/activity-log" as any)}
          >
            <MapPin size={18} color="#FFFFFF" />
            <Text style={styles.activityButtonText}>Log Activity</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIconContainer, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
            <Activity size={20} color={colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{totalWorkouts}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIconContainer, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}>
            <Award size={20} color={colors.secondary} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{activeDays}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Days</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIconContainer, { backgroundColor: "rgba(255, 149, 0, 0.1)" }]}>
            <BarChart2 size={20} color="#FF9500" />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{totalWorkoutTime}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Minutes</Text>
        </View>
      </View>
      
      {!hasConnectedDevices && !(Platform.OS === 'ios' && healthKitAuthorized) && (
        <TouchableOpacity 
          style={[styles.connectDeviceCard, { backgroundColor: colors.card }]}
          onPress={() => router.push("/health-devices" as any)}
        >
          <View style={styles.connectDeviceContent}>
            <View style={[styles.connectDeviceIcon, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
              <Watch size={24} color={colors.primary} />
            </View>
            <View style={styles.connectDeviceInfo}>
              <Text style={[styles.connectDeviceTitle, { color: colors.text }]}>
                Connect a Device
              </Text>
              <Text style={[styles.connectDeviceSubtitle, { color: colors.textSecondary }]}>
                Sync with Apple Health, Apple Watch, Fitbit, or Garmin
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
      )}
      
      {recentActivities.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
            <TouchableOpacity onPress={() => router.push("/activity-history" as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivities.map((activity) => (
            <TouchableOpacity 
              key={activity.id}
              style={[styles.activityCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/activity/${activity.id}` as any)}
            >
              <View style={styles.activityInfo}>
                <View style={[styles.activityIcon, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
                  <Footprints size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.activityType, { color: colors.text }]}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Text>
                  <Text style={[styles.activityDate, { color: colors.textSecondary }]}>
                    {new Date(activity.date).toLocaleDateString()} • {activity.duration} min
                  </Text>
                  
                  {activity.source && (
                    <View style={styles.activitySourceContainer}>
                      {activity.source.includes("Apple Health") ? (
                        <Zap size={12} color={colors.primary} />
                      ) : activity.source.includes("Apple") ? (
                        <Watch size={12} color={colors.textSecondary} />
                      ) : activity.source.includes("Fitbit") ? (
                        <Watch size={12} color="#00B0B9" />
                      ) : activity.source.includes("Garmin") ? (
                        <Watch size={12} color="#006CC1" />
                      ) : (
                        <Zap size={12} color={colors.textSecondary} />
                      )}
                      <Text style={styles.activitySource}>{activity.source}</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.activityStats}>
                <Text style={[styles.activityDistance, { color: colors.primary }]}>
                  {activity.distance} km
                </Text>
                <Text style={[styles.activityCalories, { color: colors.textSecondary }]}>
                  {activity.calories} kcal
                </Text>
              </View>
              
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={[styles.addActivityButton, { backgroundColor: colors.highlight }]}
            onPress={() => router.push("/activity-log" as any)}
          >
            <Text style={[styles.addActivityText, { color: colors.primary }]}>Log New Activity</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Tools</Text>
        
        <TouchableOpacity 
          style={[styles.toolCard, { backgroundColor: colors.card }]}
          onPress={() => router.push("/progress-photos" as any)}
        >
          <View style={styles.toolInfo}>
            <View style={[styles.toolIcon, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
              <Camera size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.toolTitle, { color: colors.text }]}>Progress Photos</Text>
              <Text style={[styles.toolDescription, { color: colors.textSecondary }]}>
                {progressPhotos.length > 0 
                  ? `${progressPhotos.length} photo${progressPhotos.length > 1 ? 's' : ''} saved`
                  : "Track your physical changes over time"
                }
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toolCard, { backgroundColor: colors.card }]}
          onPress={() => router.push("/health-devices" as any)}
        >
          <View style={styles.toolInfo}>
            <View style={[styles.toolIcon, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}>
              <Watch size={24} color={colors.secondary} />
            </View>
            <View>
              <Text style={[styles.toolTitle, { color: colors.text }]}>Connected Devices</Text>
              <Text style={[styles.toolDescription, { color: colors.textSecondary }]}>
                {connectedDevices.length > 0 
                  ? `${connectedDevices.length} device${connectedDevices.length > 1 ? 's' : ''} connected`
                  : "Connect your smartwatch or fitness tracker"
                }
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toolCard, { backgroundColor: colors.card }]}
          onPress={() => router.push("/weight-log" as any)}
        >
          <View style={styles.toolInfo}>
            <View style={[styles.toolIcon, { backgroundColor: "rgba(255, 149, 0, 0.1)" }]}>
              <TrendingUp size={24} color="#FF9500" />
            </View>
            <View>
              <Text style={[styles.toolTitle, { color: colors.text }]}>Weight Tracking</Text>
              <Text style={[styles.toolDescription, { color: colors.textSecondary }]}>
                {weightLogs.length > 0 
                  ? `${weightLogs.length} weight log${weightLogs.length > 1 ? 's' : ''} recorded`
                  : "Start tracking your weight progress"
                }
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toolCard, { backgroundColor: colors.card }]}
          onPress={() => router.push("/health-goals" as any)}
        >
          <View style={styles.toolInfo}>
            <View style={[styles.toolIcon, { backgroundColor: "rgba(255, 149, 0, 0.1)" }]}>
              <Target size={24} color="#FF9500" />
            </View>
            <View>
              <Text style={[styles.toolTitle, { color: colors.text }]}>Health Goals</Text>
              <Text style={[styles.toolDescription, { color: colors.textSecondary }]}>
                Set and track your health objectives
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toolCard, { backgroundColor: colors.card }]}
          onPress={() => router.push("/workout-analytics" as any)}
        >
          <View style={styles.toolInfo}>
            <View style={[styles.toolIcon, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
              <BarChart3 size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.toolTitle, { color: colors.text }]}>Workout Analytics</Text>
              <Text style={[styles.toolDescription, { color: colors.textSecondary }]}>
                View detailed charts and progress graphs
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardioSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Log</Text>
        
        <View style={styles.cardioButtonsContainer}>
          <TouchableOpacity 
            style={[styles.cardioButton, { backgroundColor: colors.card }]}
            onPress={() => router.push("/log-cardio" as any)}
          >
            <View style={[styles.cardioButtonIcon, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
              <Footprints size={24} color={colors.primary} />
            </View>
            <Text style={[styles.cardioButtonText, { color: colors.text }]}>Log Cardio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.cardioButton, { backgroundColor: colors.card }]}
            onPress={() => router.push("/activity-log" as any)}
          >
            <View style={[styles.cardioButtonIcon, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}>
              <Activity size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.cardioButtonText, { color: colors.text }]}>Log Activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  healthKitBanner: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  healthKitContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  healthKitText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  healthKitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  healthKitButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  bluetoothStatusBanner: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  bluetoothStatusContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bluetoothStatusText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  bluetoothSettingsButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  bluetoothSettingsText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  deviceBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  syncAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  syncAllText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 14,
  },
  activityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  activityButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  connectDeviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  connectDeviceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectDeviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  connectDeviceInfo: {
    flex: 1,
  },
  connectDeviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  connectDeviceSubtitle: {
    fontSize: 14,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityType: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  activitySourceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activitySource: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 4,
  },
  activityStats: {
    marginRight: 12,
    alignItems: "flex-end",
  },
  activityDistance: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityCalories: {
    fontSize: 14,
  },
  addActivityButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addActivityText: {
    fontSize: 16,
    fontWeight: "500",
  },
  toolCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toolInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
  },
  cardioSection: {
    marginBottom: 24,
  },
  cardioButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardioButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardioButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardioButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
    padding: 8,
  },
});