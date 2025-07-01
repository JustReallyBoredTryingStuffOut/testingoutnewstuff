import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { Play, Pause, Award, RefreshCw, Watch, AlertTriangle, Bluetooth, Zap } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import useStepCounter from "@/hooks/useStepCounter";

type StepCounterProps = {
  compact?: boolean;
};

export default function StepCounter({ compact = false }: StepCounterProps) {
  const { healthGoals, isAppleWatchConnected } = useHealthStore();
  const { 
    currentStepCount, 
    isPedometerAvailable, 
    isTracking, 
    error, 
    errorType,
    startTracking, 
    stopTracking,
    manualSync,
    isUsingConnectedDevice,
    deviceName,
    useMockData,
    retryPedometerConnection,
    bluetoothState,
    permissionStatus,
    dataSource,
    healthKitAvailable,
    healthKitAuthorized,
    isSyncing
  } = useStepCounter();
  
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (currentStepCount / healthGoals.dailySteps) * 100);
  
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, compact && styles.compactContainer]}>
        <Text style={styles.notAvailableText}>
          Step counting is not available on web
        </Text>
      </View>
    );
  }
  
  const handleSync = async () => {
    if (!isUsingConnectedDevice && dataSource !== "healthKit" && !useMockData) {
      Alert.alert("No Data Source", "No connected device or health data source to sync with");
      return;
    }
    
    const success = await manualSync();
    
    if (success) {
      // Success is already handled in the hook
    } else {
      Alert.alert(
        "Sync Failed", 
        "Could not sync with your health data source. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleRetry = async () => {
    setIsRetrying(true);
    const success = await retryPedometerConnection();
    setIsRetrying(false);
    
    if (success) {
      Alert.alert("Success", "Step counter connection restored successfully!");
      startTracking();
    } else {
      Alert.alert(
        "Step Counter Unavailable", 
        "Could not connect to the step counter. This may be due to device restrictions or privacy settings. The app will use sample data instead.",
        [
          { text: "Use Sample Data", onPress: startTracking }
        ]
      );
    }
  };
  
  // Get data source display name
  const getDataSourceName = () => {
    if (isUsingConnectedDevice && deviceName) return deviceName;
    if (dataSource === "healthKit") return "Apple Health";
    if (dataSource === "pedometer") return "Device Pedometer";
    if (useMockData) return "Sample Data";
    return "Unknown";
  };
  
  // For error states that need user attention
  if (error && !useMockData && !isTracking) {
    return (
      <View style={[styles.container, compact && styles.compactContainer]}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={24} color={colors.warning} style={styles.errorIcon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
        
        {/* Show HealthKit status for iOS */}
        {Platform.OS === 'ios' && (
          <View style={styles.healthKitStatusContainer}>
            <View style={styles.healthKitStatusContent}>
              <Zap size={16} color={healthKitAvailable ? colors.primary : colors.error} />
              <Text style={[
                styles.healthKitStatusText, 
                { color: healthKitAvailable ? colors.primary : colors.error }
              ]}>
                Apple Health: {healthKitAvailable ? "Available" : "Not Available"}
              </Text>
            </View>
            
            {healthKitAvailable && (
              <View style={styles.healthKitStatusContent}>
                <AlertTriangle size={16} color={healthKitAuthorized ? colors.primary : colors.warning} />
                <Text style={[
                  styles.healthKitStatusText, 
                  { color: healthKitAuthorized ? colors.primary : colors.warning }
                ]}>
                  Permissions: {healthKitAuthorized ? "Granted" : "Required"}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* Show Bluetooth status for iOS */}
        {Platform.OS === 'ios' && (
          <View style={styles.bluetoothStatusContainer}>
            <View style={styles.bluetoothStatusContent}>
              <Bluetooth size={16} color={bluetoothState === "poweredOn" ? colors.primary : colors.error} />
              <Text style={[
                styles.bluetoothStatusText, 
                { color: bluetoothState === "poweredOn" ? colors.primary : colors.error }
              ]}>
                Bluetooth: {bluetoothState === "poweredOn" ? "On" : "Off"}
              </Text>
            </View>
            
            <View style={styles.bluetoothStatusContent}>
              <AlertTriangle size={16} color={permissionStatus === "granted" ? colors.primary : colors.warning} />
              <Text style={[
                styles.bluetoothStatusText, 
                { color: permissionStatus === "granted" ? colors.primary : colors.warning }
              ]}>
                Permissions: {permissionStatus === "granted" ? "Granted" : "Required"}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.errorActions}>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <RefreshCw size={16} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mockDataButton}
            onPress={startTracking}
          >
            <Text style={styles.mockDataButtonText}>Use Sample Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactContent}>
          <Award size={20} color={colors.primary} />
          <Text style={styles.compactSteps}>{currentStepCount.toLocaleString()}</Text>
          <Text style={styles.compactLabel}>steps</Text>
          
          {dataSource !== "pedometer" && (
            <View style={styles.compactDeviceContainer}>
              {dataSource === "healthKit" ? (
                <Zap size={14} color={colors.textSecondary} />
              ) : isUsingConnectedDevice ? (
                <Watch size={14} color={colors.textSecondary} />
              ) : (
                <AlertTriangle size={14} color={colors.warning} />
              )}
              <Text style={styles.compactDeviceText}>{getDataSourceName()}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.compactProgressContainer}>
          <View style={styles.compactProgressBar}>
            <View 
              style={[
                styles.compactProgressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.compactGoal}>
            {Math.round(progressPercentage)}% of {healthGoals.dailySteps.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Steps</Text>
        <View style={styles.headerButtons}>
          {(isUsingConnectedDevice || dataSource === "healthKit" || useMockData) && (
            <TouchableOpacity
              style={styles.syncButton}
              onPress={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <RefreshCw size={16} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.trackingButton,
              isTracking ? styles.trackingActiveButton : {}
            ]}
            onPress={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? (
              <Pause size={16} color="#FFFFFF" />
            ) : (
              <Play size={16} color="#FFFFFF" />
            )}
            <Text style={styles.trackingButtonText}>
              {isTracking ? "Pause" : "Track"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsCount}>
          {currentStepCount.toLocaleString()}
        </Text>
        <Text style={styles.stepsLabel}>steps today</Text>
        
        {useMockData && (
          <View style={styles.mockDataBadge}>
            <Text style={styles.mockDataLabel}>Using sample data</Text>
          </View>
        )}
        
        {dataSource === "healthKit" && (
          <View style={styles.dataSourceContainer}>
            <Zap size={16} color={colors.primary} />
            <Text style={styles.dataSourceText}>
              Data from Apple Health
            </Text>
          </View>
        )}
        
        {isUsingConnectedDevice && (
          <View style={styles.deviceContainer}>
            <Watch size={16} color={colors.textSecondary} />
            <Text style={styles.deviceText}>
              Data from {deviceName}
            </Text>
          </View>
        )}
        
        {/* Show HealthKit status for iOS */}
        {Platform.OS === 'ios' && dataSource === "healthKit" && (
          <View style={styles.healthKitStatusRow}>
            <View style={[
              styles.healthKitStatusBadge,
              { backgroundColor: "rgba(76, 217, 100, 0.1)" }
            ]}>
              <Zap size={12} color="#4CD964" />
              <Text style={[
                styles.healthKitStatusBadgeText, 
                { color: "#4CD964" }
              ]}>
                Apple Health Connected
              </Text>
            </View>
          </View>
        )}
        
        {/* Show Bluetooth status for iOS */}
        {Platform.OS === 'ios' && !isUsingConnectedDevice && dataSource !== "healthKit" && (
          <View style={styles.bluetoothStatusRow}>
            <View style={[
              styles.bluetoothStatusBadge,
              { backgroundColor: bluetoothState === "poweredOn" ? "rgba(76, 217, 100, 0.1)" : "rgba(255, 59, 48, 0.1)" }
            ]}>
              <Bluetooth size={12} color={bluetoothState === "poweredOn" ? "#4CD964" : "#FF3B30"} />
              <Text style={[
                styles.bluetoothStatusBadgeText, 
                { color: bluetoothState === "poweredOn" ? "#4CD964" : "#FF3B30" }
              ]}>
                {bluetoothState === "poweredOn" ? "Bluetooth On" : "Bluetooth Off"}
              </Text>
            </View>
            
            {Platform.OS === 'ios' && (
              <View style={[
                styles.bluetoothStatusBadge,
                { backgroundColor: permissionStatus === "granted" ? "rgba(76, 217, 100, 0.1)" : "rgba(255, 149, 0, 0.1)" }
              ]}>
                <AlertTriangle size={12} color={permissionStatus === "granted" ? "#4CD964" : "#FF9500"} />
                <Text style={[
                  styles.bluetoothStatusBadgeText, 
                  { color: permissionStatus === "granted" ? "#4CD964" : "#FF9500" }
                ]}>
                  {permissionStatus === "granted" ? "Permissions OK" : "Permissions Needed"}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {error && useMockData && (
          <TouchableOpacity 
            style={styles.errorInfoContainer}
            onPress={handleRetry}
          >
            <AlertTriangle size={14} color={colors.warning} />
            <Text style={styles.errorInfoText}>
              {error.includes("CMErrorDomain") || error.includes("cmerrordomain") 
                ? "Pedometer unavailable. Tap to retry." 
                : "Pedometer error. Tap to retry."}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>
            {Math.round(progressPercentage)}% of daily goal
          </Text>
          <Text style={styles.goalText}>
            Goal: {healthGoals.dailySteps.toLocaleString()} steps
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  trackingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  trackingActiveButton: {
    backgroundColor: colors.warning,
  },
  trackingButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 4,
  },
  syncButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stepsContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  stepsCount: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.text,
  },
  stepsLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  deviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: colors.highlight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  deviceText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dataSourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(76, 217, 100, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dataSourceText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  mockDataBadge: {
    marginTop: 8,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  mockDataLabel: {
    fontSize: 12,
    color: "#FF9500",
    fontStyle: "italic",
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  goalText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    alignItems: "center",
    padding: 16,
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  errorActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  mockDataButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mockDataButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  notAvailableText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    padding: 16,
  },
  compactContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  compactSteps: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
    marginRight: 4,
  },
  compactLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  compactDeviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: colors.highlight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  compactDeviceText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  compactMockContainer: {
    marginLeft: 8,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  compactMockText: {
    fontSize: 10,
    color: "#FF9500",
  },
  compactProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginRight: 8,
    overflow: "hidden",
  },
  compactProgressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  compactGoal: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  errorInfoText: {
    fontSize: 12,
    color: colors.warning,
    marginLeft: 4,
  },
  bluetoothStatusContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  bluetoothStatusContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bluetoothStatusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  bluetoothStatusRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 8,
  },
  bluetoothStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  bluetoothStatusBadgeText: {
    fontSize: 10,
    marginLeft: 4,
  },
  healthKitStatusContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  healthKitStatusContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  healthKitStatusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  healthKitStatusRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 8,
  },
  healthKitStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  healthKitStatusBadgeText: {
    fontSize: 10,
    marginLeft: 4,
  },
});