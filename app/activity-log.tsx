import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Switch, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { MapPin, Clock, Calendar, ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import { ActivityLog } from "@/types";
import Button from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import NoteInput from "@/components/NoteInput";

export default function ActivityLogScreen() {
  const router = useRouter();
  const { addActivityLog } = useHealthStore();
  
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
  
  const handleSave = () => {
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: activityType,
      duration: parseInt(duration) || 0,
      distance: parseFloat(distance) || 0,
      calories: parseInt(calories) || 0,
      date: `${date}T${time}:00`,
      isOutdoor,
      location: isOutdoor ? location : "",
      notes,
    };
    
    addActivityLog(newActivity);
    Alert.alert("Success", "Activity logged successfully");
    router.back();
  };
  
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
      case "swimming":
        caloriesPerMinute = 9; // ~9 calories per minute for swimming
        break;
      case "hiking":
        caloriesPerMinute = 6; // ~6 calories per minute for hiking
        break;
      default:
        caloriesPerMinute = 5; // Default value
    }
    
    const estimatedCalories = Math.round(durationNum * caloriesPerMinute);
    setCalories(estimatedCalories.toString());
  };
  
  // Update calories when activity type, duration, or distance changes
  React.useEffect(() => {
    calculateCalories();
  }, [activityType, duration, distance]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: "Log Activity",
          headerBackTitle: "Health",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Log Your Activity</Text>
        <Text style={styles.subtitle}>Track your workouts and activities</Text>
      </View>
      
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
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>
        
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
        
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Outdoor Activity?</Text>
          <Switch
            trackColor={{ false: colors.inactive, true: colors.primary }}
            thumbColor="#FFFFFF"
            value={isOutdoor}
            onValueChange={setIsOutdoor}
          />
        </View>
        
        {isOutdoor && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.dateInputContainer}>
              <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.dateInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
              />
            </View>
          </View>
        )}
        
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
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  notesContainer: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
});