import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Keyboard } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Plus, Calendar, TrendingUp, ChevronDown, Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import { useMacroStore } from "@/store/macroStore";
import Button from "@/components/Button";
import WeightTracker from "@/components/WeightTracker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

export default function WeightLogScreen() {
  const router = useRouter();
  const { weightLogs, addWeightLog, removeWeightLog } = useHealthStore();
  const { userProfile } = useMacroStore();
  
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Sort weight logs by date (newest first)
  const sortedLogs = [...weightLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleAddWeight = () => {
    if (!weight) {
      Alert.alert("Error", "Please enter a weight");
      return;
    }
    
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert("Error", "Please enter a valid weight");
      return;
    }
    
    const newLog = {
      id: Date.now().toString(),
      date: date.toISOString(),
      weight: weightValue,
      notes: notes,
    };
    
    addWeightLog(newLog);
    setWeight("");
    setNotes("");
    setDate(new Date());
    Keyboard.dismiss();
    
    Alert.alert("Success", "Weight log added successfully");
  };
  
  const handleDeleteLog = (id: string) => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to delete this weight log?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => removeWeightLog(id),
          style: "destructive",
        },
      ]
    );
  };
  
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };
  
  const handleGoBack = () => {
    router.navigate("/(tabs)");
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Weight Log",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <WeightTracker 
          standalone={true} 
          onDeleteWeight={(id) => handleDeleteLog(id)}
          onBackPress={handleGoBack}
        />
        
        <View style={styles.addLogContainer}>
          <Text style={styles.sectionTitle}>Add New Weight Log</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.weightInputContainer}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="0.0"
              />
            </View>
            
            <View style={styles.datePickerContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.dateText}>
                  {date.toLocaleDateString()}
                </Text>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.notesContainer}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about your weight measurement"
              multiline
            />
          </View>
          
          <Button
            title="Add Weight Log"
            onPress={handleAddWeight}
            icon={<Plus size={18} color="#FFFFFF" />}
            style={styles.addButton}
          />
        </View>
        
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Weight History</Text>
          
          {sortedLogs.length > 0 ? (
            sortedLogs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logInfo}>
                  <Text style={styles.logWeight}>{log.weight} kg</Text>
                  <Text style={styles.logDate}>
                    {new Date(log.date).toLocaleDateString()}
                  </Text>
                  {log.notes && (
                    <Text style={styles.logNotes}>{log.notes}</Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteLog(log.id)}
                >
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No weight logs yet. Add your first log above.
            </Text>
          )}
        </View>
      </ScrollView>
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  addLogContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weightInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  datePickerContainer: {
    flex: 1,
    marginLeft: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  weightInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    height: 80,
    textAlignVertical: "top",
  },
  addButton: {
    marginTop: 8,
  },
  historyContainer: {
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
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logInfo: {
    flex: 1,
  },
  logWeight: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  logDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  logNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    padding: 16,
  },
});