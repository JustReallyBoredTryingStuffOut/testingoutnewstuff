import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Switch, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Navigation, 
  Home, 
  Map, 
  Target, 
  BarChart, 
  Check, 
  ChevronLeft,
  Watch,
  Smartphone,
  Zap
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import { ActivityLog } from "@/types";
import Button from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import NoteInput from "@/components/NoteInput";

export default function LogCardioScreen() {
  const router = useRouter();
  const { 
    addActivityLog, 
    healthGoals, 
    connectedDevices,
    isAppleWatchConnected,
    getConnectedDeviceByType,
    importDataFromDevice
  } = useHealthStore();
  
  const [activityType, setActivityType] = useState("walking");
  const [duration, setDuration] = useState("30");
  const [distance, setDistance] = useState("2.5");
  const [calories, setCalories] = useState("150");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(
    new Date().toTimeString().split(" ")[0].substring(0, 5)
  );
  const [isOutdoor, setIsOutdoor] = useState(true);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [useConnectedDevice, setUseConnectedDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [heartRate, setHeartRate] = useState({ avg: 0, max: 0, min: 0 });
  
  // Check for connected devices that can track cardio
  const connectedCardioDevices = connectedDevices.filter(
    device => device.connected && 
    (device.type === "appleWatch" || device.type === "fitbit" || device.type === "garmin")
  );
  
  // Set default selected device if available
  useEffect(() => {
    if (connectedCardioDevices.length > 0 && !selectedDevice) {
      setSelectedDevice(connectedCardioDevices[0].id);
    }
  }, [connectedCardioDevices]);
  
  // Mock routes
  const routes = [
    {
      id: "r1",
      name: "Park Loop",
      distance: 2.5,
      estimatedTime: 30,
      difficulty: "Easy",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: "r2",
      name: "Riverside Trail",
      distance: 4.2,
      estimatedTime: 50,
      difficulty: "Moderate",
      imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: "r3",
      name: "Mountain View Path",
      distance: 3.8,
      estimatedTime: 45,
      difficulty: "Moderate",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];
  
  // Calculate calories based on activity type, duration, and distance
  const calculateCalories = () => {
    const durationNum = parseInt(duration) || 0;
    const distanceNum = parseFloat(distance) || 0;
    
    let caloriesPerMinute = 0;
    
    switch (activityType) {
      case "walking":
        caloriesPerMinute = 4; // ~4 calories per minute for walking
        break;
      case "running":
        caloriesPerMinute = 10; // ~10 calories per minute for running
        break;
      case "cycling":
        caloriesPerMinute = 8; // ~8 calories per minute for cycling
        break;
      default:
        caloriesPerMinute = 5; // Default value
    }
    
    const estimatedCalories = Math.round(durationNum * caloriesPerMinute);
    setCalories(estimatedCalories.toString());
  };
  
  // Calculate recommended duration for weight loss
  const getRecommendedDuration = () => {
    // Basic calculation - in reality would be more complex based on user's stats
    switch (activityType) {
      case "walking":
        return 45; // 45 minutes of walking
      case "running":
        return 30; // 30 minutes of running
      case "cycling":
        return 40; // 40 minutes of cycling
      default:
        return 30;
    }
  };
  
  // Update calories when activity type, duration, or distance changes
  useEffect(() => {
    calculateCalories();
  }, [activityType, duration, distance]);
  
  // When route is selected, update distance and duration
  useEffect(() => {
    if (selectedRoute) {
      setDistance(selectedRoute.distance.toString());
      setDuration(selectedRoute.estimatedTime.toString());
      setLocation(selectedRoute.name);
    }
  }, [selectedRoute]);
  
  const handleSave = () => {
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: activityType,
      date: `${date}T${time}:00`,
      duration: parseInt(duration) || 0,
      distance: parseFloat(distance) || 0,
      calories: parseInt(calories) || 0,
      notes,
      isOutdoor,
      location: isOutdoor ? location : "",
      route: selectedRoute ? {
        id: selectedRoute.id,
        name: selectedRoute.name,
      } : undefined,
      heartRate: heartRate.avg > 0 ? heartRate : undefined,
      source: useConnectedDevice && selectedDevice ? 
        connectedDevices.find(d => d.id === selectedDevice)?.name || "Connected Device" : 
        "Manual Entry"
    };
    
    addActivityLog(newActivity);
    Alert.alert("Success", "Activity logged successfully");
    router.back();
  };

  const handleGoBack = () => {
    router.back();
  };
  
  const handleSyncFromDevice = async () => {
    if (!selectedDevice) {
      Alert.alert("Error", "Please select a device to sync from");
      return;
    }
    
    setIsSyncing(true);
    
    try {
      // Get the selected date
      const selectedDate = new Date(`${date}T${time}:00`);
      
      // Set date range for sync (1 day before and after the selected date)
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 1);
      
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);
      
      // Import activity data from the device
      const success = await importDataFromDevice(
        selectedDevice,
        "activities",
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      if (success) {
        // Simulate finding an activity that matches the selected type and date
        setTimeout(() => {
          // Generate mock activity data
          const mockDuration = Math.floor(20 + Math.random() * 40);
          const mockDistance = parseFloat((1 + Math.random() * 5).toFixed(2));
          const mockCalories = Math.floor(mockDuration * (activityType === "running" ? 10 : activityType === "cycling" ? 8 : 5));
          const mockAvgHR = Math.floor(120 + Math.random() * 40);
          
          setDuration(mockDuration.toString());
          setDistance(mockDistance.toString());
          setCalories(mockCalories.toString());
          setHeartRate({
            avg: mockAvgHR,
            max: mockAvgHR + Math.floor(Math.random() * 20),
            min: mockAvgHR - Math.floor(Math.random() * 20)
          });
          
          Alert.alert(
            "Activity Found",
            `Found a ${activityType} activity from your device. The details have been filled in.`,
            [{ text: "OK" }]
          );
          
          setIsSyncing(false);
        }, 1500);
      } else {
        Alert.alert(
          "No Activities Found",
          "No matching activities were found on your device for the selected date and type.",
          [{ text: "OK" }]
        );
        setIsSyncing(false);
      }
    } catch (error) {
      console.error("Error syncing from device:", error);
      Alert.alert(
        "Sync Error",
        "An error occurred while trying to sync from your device.",
        [{ text: "OK" }]
      );
      setIsSyncing(false);
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: "Log Cardio Activity",
          headerBackTitle: "Health",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Log Your Cardio</Text>
        <Text style={styles.subtitle}>Track your walking, running, or cycling</Text>
      </View>
      
      {connectedCardioDevices.length > 0 && (
        <View style={styles.deviceSection}>
          <View style={styles.deviceToggleContainer}>
            <Text style={styles.deviceToggleLabel}>Use connected device</Text>
            <Switch
              value={useConnectedDevice}
              onValueChange={setUseConnectedDevice}
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {useConnectedDevice && (
            <>
              <View style={styles.devicePickerContainer}>
                <Text style={styles.label}>Select Device</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedDevice}
                    onValueChange={(itemValue) => setSelectedDevice(itemValue)}
                    style={styles.picker}
                  >
                    {connectedCardioDevices.map(device => (
                      <Picker.Item 
                        key={device.id} 
                        label={device.name} 
                        value={device.id} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <Button
                title={isSyncing ? "Syncing..." : "Sync Activity from Device"}
                onPress={handleSyncFromDevice}
                loading={isSyncing}
                icon={<Zap size={18} color={colors.primary} />}
                variant="outline"
                style={styles.syncButton}
              />
              
              {heartRate.avg > 0 && (
                <View style={styles.heartRateContainer}>
                  <Text style={styles.heartRateTitle}>Heart Rate Data</Text>
                  <View style={styles.heartRateStats}>
                    <View style={styles.heartRateStat}>
                      <Text style={styles.heartRateLabel}>AVG</Text>
                      <Text style={styles.heartRateValue}>{heartRate.avg}</Text>
                      <Text style={styles.heartRateUnit}>bpm</Text>
                    </View>
                    <View style={styles.heartRateStat}>
                      <Text style={styles.heartRateLabel}>MAX</Text>
                      <Text style={styles.heartRateValue}>{heartRate.max}</Text>
                      <Text style={styles.heartRateUnit}>bpm</Text>
                    </View>
                    <View style={styles.heartRateStat}>
                      <Text style={styles.heartRateLabel}>MIN</Text>
                      <Text style={styles.heartRateValue}>{heartRate.min}</Text>
                      <Text style={styles.heartRateUnit}>bpm</Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      )}
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activity Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={activityType}
              onValueChange={(itemValue) => setActivityType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Walking" value="walking" />
              <Picker.Item label="Running" value="running" />
              <Picker.Item label="Cycling" value="cycling" />
              <Picker.Item label="Swimming" value="swimming" />
              <Picker.Item label="Hiking" value="hiking" />
              <Picker.Item label="Rowing" value="rowing" />
              <Picker.Item label="Elliptical" value="elliptical" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.locationToggle}>
          <View style={styles.locationOption}>
            <TouchableOpacity
              style={[
                styles.locationButton,
                isOutdoor ? styles.locationButtonActive : styles.locationButtonInactive
              ]}
              onPress={() => setIsOutdoor(true)}
            >
              <Map size={20} color={isOutdoor ? colors.primary : colors.textSecondary} />
              <Text style={[
                styles.locationButtonText,
                isOutdoor ? styles.locationButtonTextActive : styles.locationButtonTextInactive
              ]}>
                Outdoor
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationOption}>
            <TouchableOpacity
              style={[
                styles.locationButton,
                !isOutdoor ? styles.locationButtonActive : styles.locationButtonInactive
              ]}
              onPress={() => setIsOutdoor(false)}
            >
              <Home size={20} color={!isOutdoor ? colors.primary : colors.textSecondary} />
              <Text style={[
                styles.locationButtonText,
                !isOutdoor ? styles.locationButtonTextActive : styles.locationButtonTextInactive
              ]}>
                Indoor
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {!isOutdoor && (
          <View style={styles.indoorInfo}>
            <Text style={styles.indoorInfoText}>
              {activityType === "walking" ? "Treadmill" : 
               activityType === "running" ? "Treadmill" : 
               activityType === "cycling" ? "Stationary Bike" :
               activityType === "rowing" ? "Rowing Machine" :
               activityType === "elliptical" ? "Elliptical Trainer" :
               "Indoor Activity"}
            </Text>
          </View>
        )}
        
        {isOutdoor && (
          <View style={styles.inputGroup}>
            <View style={styles.locationHeader}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity onPress={() => setShowRoutes(!showRoutes)}>
                <Text style={styles.suggestText}>
                  {showRoutes ? "Hide Routes" : "Suggest Routes"}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateInputContainer}>
              <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.dateInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
              />
            </View>
            
            {showRoutes && (
              <View style={styles.routesContainer}>
                <Text style={styles.routesTitle}>Recommended Routes</Text>
                
                {routes.map((route) => (
                  <TouchableOpacity
                    key={route.id}
                    style={[
                      styles.routeCard,
                      selectedRoute?.id === route.id && styles.selectedRouteCard
                    ]}
                    onPress={() => setSelectedRoute(route)}
                  >
                    <Image 
                      source={{ uri: route.imageUrl }} 
                      style={styles.routeImage} 
                    />
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeName}>{route.name}</Text>
                      <View style={styles.routeStats}>
                        <View style={styles.routeStat}>
                          <Navigation size={14} color={colors.textSecondary} />
                          <Text style={styles.routeStatText}>{route.distance} km</Text>
                        </View>
                        <View style={styles.routeStat}>
                          <Clock size={14} color={colors.textSecondary} />
                          <Text style={styles.routeStatText}>{route.estimatedTime} min</Text>
                        </View>
                      </View>
                      <Text style={styles.routeDifficulty}>{route.difficulty}</Text>
                    </View>
                    {selectedRoute?.id === route.id && (
                      <View style={styles.selectedIndicator}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="Duration in minutes"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Distance (km)</Text>
          <TextInput
            style={styles.input}
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
            placeholder="Distance in kilometers"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Calories Burned</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            placeholder="Estimated calories burned"
          />
        </View>
        
        <View style={styles.dateTimeContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dateInputContainer}>
              <Calendar size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.dateInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
          
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.dateInputContainer}>
              <Clock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.dateInput}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.notesContainer}>
          <Text style={styles.label}>Notes</Text>
          <NoteInput
            initialValue={notes}
            onSave={setNotes}
            placeholder="Add notes about this activity..."
            multiline
          />
        </View>
      </View>
      
      <View style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <Target size={20} color={colors.primary} />
          <Text style={styles.recommendationTitle}>Recommendation</Text>
        </View>
        
        <Text style={styles.recommendationText}>
          For optimal weight management, we recommend at least {getRecommendedDuration()} minutes of {activityType} 
          {activityType === "walking" ? " at a brisk pace" : 
           activityType === "running" ? " at a moderate pace" : 
           " at a steady pace"}.
        </Text>
        
        <View style={styles.recommendationStats}>
          <View style={styles.recommendationStat}>
            <BarChart size={16} color={colors.primary} />
            <Text style={styles.recommendationStatText}>
              Burns ~{Math.round(getRecommendedDuration() * 
                (activityType === "walking" ? 4 : 
                 activityType === "running" ? 10 : 8))} calories
            </Text>
          </View>
          <View style={styles.recommendationStat}>
            <Clock size={16} color={colors.primary} />
            <Text style={styles.recommendationStatText}>
              {getRecommendedDuration()} minutes
            </Text>
          </View>
        </View>
      </View>
      
      {connectedCardioDevices.length > 0 && !useConnectedDevice && (
        <View style={styles.deviceTip}>
          <Watch size={20} color={colors.primary} />
          <Text style={styles.deviceTipText}>
            Tip: Enable "Use connected device" to import activity data directly from your {
              connectedCardioDevices[0].type === "appleWatch" ? "Apple Watch" :
              connectedCardioDevices[0].type === "fitbit" ? "Fitbit" :
              connectedCardioDevices[0].type === "garmin" ? "Garmin" :
              "smart device"
            }
          </Text>
        </View>
      )}
      
      <Button
        title="Save Activity"
        onPress={handleSave}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  deviceSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  deviceToggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  devicePickerContainer: {
    marginBottom: 16,
  },
  syncButton: {
    marginBottom: 16,
  },
  heartRateContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
  },
  heartRateTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  heartRateStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  heartRateStat: {
    alignItems: "center",
  },
  heartRateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  heartRateValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  heartRateUnit: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  locationToggle: {
    flexDirection: "row",
    marginBottom: 16,
  },
  locationOption: {
    flex: 1,
    paddingHorizontal: 4,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  locationButtonActive: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
  },
  locationButtonInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  locationButtonTextActive: {
    color: colors.primary,
  },
  locationButtonTextInactive: {
    color: colors.textSecondary,
  },
  indoorInfo: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  indoorInfoText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  dateTimeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  inputIcon: {
    marginRight: 8,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  notesContainer: {
    marginBottom: 8,
  },
  routesContainer: {
    marginTop: 16,
  },
  routesTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 12,
  },
  routeCard: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedRouteCard: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  routeImage: {
    width: 80,
    height: 80,
  },
  routeInfo: {
    flex: 1,
    padding: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  routeStats: {
    flexDirection: "row",
    marginBottom: 4,
  },
  routeStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  routeStatText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  routeDifficulty: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  recommendationStats: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recommendationStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  recommendationStatText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  deviceTip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  deviceTipText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  saveButton: {
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
});