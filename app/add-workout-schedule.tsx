import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable, Keyboard, Platform, Switch, Animated } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Calendar, Clock, ChevronDown, Check, ArrowLeft, X, Repeat, CalendarDays } from "lucide-react-native";
import { useWorkoutStore } from "@/store/workoutStore";
import { useNotificationStore } from "@/store/notificationStore";
import Button from "@/components/Button";
import WorkoutCard from "@/components/WorkoutCard";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTheme } from "@/context/ThemeContext";

// Success Toast Component
const SuccessToast = ({ 
  visible, 
  message, 
  onHide 
}: { 
  visible: boolean; 
  message: string; 
  onHide: () => void; 
}) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.successToast,
        {
          backgroundColor: colors.primary,
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Check size={20} color={colors.white} />
      <Text style={[styles.successToastText, { color: colors.white }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

export default function AddWorkoutScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const { workouts, scheduleWorkout } = useWorkoutStore();
  const { scheduleWorkoutNotification } = useNotificationStore();
  
  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [workoutType, setWorkoutType] = useState<'specific' | 'flexible'>('specific');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [scheduleType, setScheduleType] = useState<'one-time' | 'recurring'>('one-time');
  const [reminder, setReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState(15);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Success toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Set the workout ID from params if available
  useEffect(() => {
    if (params.workoutId) {
      setSelectedWorkoutId(params.workoutId as string);
    }
    
    // Check if a date was passed in params
    if (params.selectedDate) {
      try {
        const date = new Date(params.selectedDate as string);
        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
          setSelectedDay(date.getDay());
          // Default to one-time schedule when a specific date is selected
          setScheduleType('one-time');
        }
      } catch (error) {
        console.error("Error parsing date from params:", error);
      }
    }
  }, [params.workoutId, params.selectedDate]);
  
  // Days of the week
  const days = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];
  
  // Format time for display
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${formattedMinutes} ${ampm}`;
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedTime;
    setShowTimePicker(Platform.OS === "ios");
    setSelectedTime(currentDate);
  };
  
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setShowDatePicker(Platform.OS === "ios");
      setSelectedDate(date);
      // Also update the day of week based on the selected date
      setSelectedDay(date.getDay());
    }
  };
  
  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setShowEndDatePicker(Platform.OS === "ios");
      setRecurrenceEndDate(date);
    }
  };
  
  const handleSave = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    // Validation: Only require workout selection for specific workouts
    if (workoutType === 'specific' && !selectedWorkoutId) {
      Alert.alert("Error", "Please select a workout");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedWorkout = workouts.find(w => w.id === selectedWorkoutId);
      const workoutName = workoutType === 'specific' 
        ? selectedWorkout?.name || 'Unknown Workout'
        : 'Flexible Session';
      
      const newScheduledWorkout = await scheduleWorkout({
        workoutId: workoutType === 'specific' ? selectedWorkoutId : null,
        workoutName,
        workoutType,
        day: selectedDay,
        date: selectedDate,
        time: selectedTime,
        scheduleType,
        recurrenceFrequency,
        recurrenceEndDate: hasEndDate ? recurrenceEndDate : null,
        reminder,
        reminderTime,
      });
      
      // Schedule notification if reminder is enabled
      if (reminder && newScheduledWorkout) {
        try {
          const notificationDate = new Date(selectedDate);
          notificationDate.setHours(selectedTime.getHours());
          notificationDate.setMinutes(selectedTime.getMinutes());
          notificationDate.setSeconds(0);
          notificationDate.setMilliseconds(0);
          
          // Subtract reminder time
          notificationDate.setMinutes(notificationDate.getMinutes() - reminderTime);
          
          await scheduleWorkoutNotification(
            newScheduledWorkout.id,
            newScheduledWorkout.workoutName,
            notificationDate
          );
        } catch (notificationError) {
          console.error("Error scheduling notification:", notificationError);
          // Continue even if notification scheduling fails
        }
      }
      
      // Show success message and navigate back
      setIsSubmitting(false);
      
      let toastMessage = "";
      if (workoutType === 'flexible') {
        toastMessage = scheduleType === 'one-time' 
          ? "Flexible workout session added to schedule"
          : "Flexible workout sessions added to schedule";
      } else {
        toastMessage = scheduleType === 'one-time' 
          ? "Workout added to schedule"
          : "Workouts added to schedule";
      }
      
      setSuccessMessage(toastMessage);
      setShowSuccessToast(true);
      
      // Navigate back after showing the toast
      setTimeout(() => {
        router.back();
      }, 1000);
      
    } catch (error) {
      console.error("Error scheduling workout:", error);
      Alert.alert(
        "Error", 
        "There was a problem scheduling your workout. Please try again."
      );
      setIsSubmitting(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const selectedWorkout = workouts.find(w => w.id === selectedWorkoutId);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Add to Schedule",
          headerBackTitle: "Schedule",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Schedule a Workout</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Add a workout to your schedule</Text>
        </View>
        
        {/* Workout Type Selection */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Workout Type</Text>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            Choose between a specific workout or a flexible session where you'll decide what to do when you arrive at the gym.
          </Text>
          
          <View style={styles.workoutTypeContainer}>
            <TouchableOpacity
              style={[
                styles.workoutTypeButton,
                { backgroundColor: colors.background },
                workoutType === 'specific' && [styles.selectedWorkoutType, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setWorkoutType('specific')}
            >
              <Text
                style={[
                  styles.workoutTypeText,
                  { color: workoutType === 'specific' ? colors.white : colors.text }
                ]}
              >
                Specific Workout
              </Text>
              <Text
                style={[
                  styles.workoutTypeSubtext,
                  { color: workoutType === 'specific' ? colors.white + '80' : colors.textSecondary }
                ]}
              >
                Choose a predefined workout
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.workoutTypeButton,
                { backgroundColor: colors.background },
                workoutType === 'flexible' && [styles.selectedWorkoutType, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setWorkoutType('flexible')}
            >
              <Text
                style={[
                  styles.workoutTypeText,
                  { color: workoutType === 'flexible' ? colors.white : colors.text }
                ]}
              >
                Flexible Session
              </Text>
              <Text
                style={[
                  styles.workoutTypeSubtext,
                  { color: workoutType === 'flexible' ? colors.white + '80' : colors.textSecondary }
                ]}
              >
                Decide when you arrive
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Workout Selection - Only show for specific workouts */}
        {workoutType === 'specific' && (
          <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Workout</Text>
            
            <View style={styles.workoutSelector}>
              {selectedWorkout ? (
                <View style={styles.selectedWorkoutContainer}>
                  <WorkoutCard workout={selectedWorkout} />
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => setShowWorkoutSelector(true)}
                  >
                    <Text style={[styles.changeButtonText, { color: colors.primary }]}>Change Workout</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.selectWorkoutButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => setShowWorkoutSelector(true)}
                >
                  <Text style={[styles.selectWorkoutText, { color: colors.textSecondary }]}>Tap to select a workout</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        {/* Schedule Type Selection */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Schedule Type</Text>
          
          <View style={styles.scheduleTypeContainer}>
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                { backgroundColor: colors.background },
                scheduleType === 'one-time' && [styles.selectedScheduleType, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setScheduleType('one-time')}
            >
              <Calendar 
                size={20} 
                color={scheduleType === 'one-time' ? colors.white : colors.textSecondary} 
                style={styles.scheduleTypeIcon}
              />
              <Text
                style={[
                  styles.scheduleTypeText,
                  { color: scheduleType === 'one-time' ? colors.white : colors.text }
                ]}
              >
                One-time
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                { backgroundColor: colors.background },
                scheduleType === 'recurring' && [styles.selectedScheduleType, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setScheduleType('recurring')}
            >
              <Repeat 
                size={20} 
                color={scheduleType === 'recurring' ? colors.white : colors.textSecondary} 
                style={styles.scheduleTypeIcon}
              />
              <Text
                style={[
                  styles.scheduleTypeText,
                  { color: scheduleType === 'recurring' ? colors.white : colors.text }
                ]}
              >
                Recurring
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Day/Date Selection based on schedule type */}
        {scheduleType === 'recurring' ? (
          <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Day</Text>
            
            <View style={styles.daysContainer}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayButton,
                    { backgroundColor: colors.background },
                    selectedDay === day.id && [styles.selectedDayButton, { backgroundColor: colors.primary }],
                  ]}
                  onPress={() => setSelectedDay(day.id)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: colors.text },
                      selectedDay === day.id && [styles.selectedDayText, { color: "#FFFFFF" }],
                    ]}
                  >
                    {day.name.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Recurrence Frequency */}
            <View style={styles.recurrenceContainer}>
              <Text style={[styles.recurrenceLabel, { color: colors.text }]}>Repeat</Text>
              <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
                <Picker
                  selectedValue={recurrenceFrequency}
                  onValueChange={(itemValue) => setRecurrenceFrequency(itemValue)}
                  style={styles.picker}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item label="Weekly" value="weekly" color={Platform.OS === 'android' ? colors.text : undefined} />
                  <Picker.Item label="Every 2 weeks" value="biweekly" color={Platform.OS === 'android' ? colors.text : undefined} />
                  <Picker.Item label="Monthly" value="monthly" color={Platform.OS === 'android' ? colors.text : undefined} />
                </Picker>
              </View>
            </View>
            
            {/* End Date Option */}
            <View style={styles.endDateContainer}>
              <View style={styles.endDateToggleRow}>
                <Text style={[styles.endDateLabel, { color: colors.text }]}>Set end date</Text>
                <Switch
                  value={hasEndDate}
                  onValueChange={setHasEndDate}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={hasEndDate ? colors.white : colors.background}
                />
              </View>
              
              {hasEndDate && (
                <TouchableOpacity 
                  style={[styles.dateSelector, { backgroundColor: colors.background }]}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <CalendarDays size={20} color={colors.primary} />
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {recurrenceEndDate ? formatDate(recurrenceEndDate) : "Select end date"}
                  </Text>
                  <ChevronDown size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
              
              {Platform.OS === 'ios' && showEndDatePicker && (
                <View style={[styles.iosDatePickerContainer, { backgroundColor: colors.card }]}>
                  <DateTimePicker
                    value={recurrenceEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // Default to 30 days from now
                    mode="date"
                    display="spinner"
                    minimumDate={new Date()}
                    onChange={handleEndDateChange}
                  />
                  <Button 
                    title="Done" 
                    onPress={() => setShowEndDatePicker(false)}
                    style={styles.doneButton}
                  />
                </View>
              )}
              
              {Platform.OS === 'android' && showEndDatePicker && (
                <DateTimePicker
                  value={recurrenceEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleEndDateChange}
                />
              )}
              
              {Platform.OS === 'web' && showEndDatePicker && (
                <View style={[styles.webDatePickerContainer, { backgroundColor: colors.card }]}>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={recurrenceEndDate ? recurrenceEndDate.toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        setRecurrenceEndDate(new Date(e.target.value));
                      }
                    }}
                    style={webInputStyle}
                  />
                  <Button 
                    title="Done" 
                    onPress={() => setShowEndDatePicker(false)}
                    style={styles.doneButton}
                  />
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
            
            <TouchableOpacity 
              style={[styles.dateSelector, { backgroundColor: colors.background }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(selectedDate)}</Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {Platform.OS === 'ios' && showDatePicker && (
              <View style={[styles.iosDatePickerContainer, { backgroundColor: colors.card }]}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={handleDateChange}
                />
                <Button 
                  title="Done" 
                  onPress={() => setShowDatePicker(false)}
                  style={styles.doneButton}
                />
              </View>
            )}
            
            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
            
            {Platform.OS === 'web' && showDatePicker && (
              <View style={[styles.webDatePickerContainer, { backgroundColor: colors.card }]}>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (e.target.value) {
                      const newDate = new Date(e.target.value);
                      setSelectedDate(newDate);
                      setSelectedDay(newDate.getDay());
                    }
                  }}
                  style={webInputStyle}
                />
                <Button 
                  title="Done" 
                  onPress={() => setShowDatePicker(false)}
                  style={styles.doneButton}
                />
              </View>
            )}
          </View>
        )}
        
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Time</Text>
          
          <TouchableOpacity 
            style={[styles.timeSelector, { backgroundColor: colors.background }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(selectedTime)}</Text>
            <ChevronDown size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {Platform.OS === 'ios' && showTimePicker && (
            <View style={[styles.iosTimePickerContainer, { backgroundColor: colors.card }]}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChange}
              />
              <Button 
                title="Done" 
                onPress={() => setShowTimePicker(false)}
                style={styles.doneButton}
              />
            </View>
          )}
          
          {Platform.OS === 'android' && showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}
          
          {Platform.OS === 'web' && showTimePicker && (
            <View style={[styles.webTimePickerContainer, { backgroundColor: colors.card }]}>
              <input
                type="time"
                value={`${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newDate = new Date(selectedTime);
                  newDate.setHours(hours);
                  newDate.setMinutes(minutes);
                  setSelectedTime(newDate);
                }}
                style={webInputStyle}
              />
              <Button 
                title="Done" 
                onPress={() => setShowTimePicker(false)}
                style={styles.doneButton}
              />
            </View>
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <View style={styles.reminderHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Reminder</Text>
            <TouchableOpacity 
              style={styles.reminderToggle}
              onPress={() => setReminder(!reminder)}
            >
              <View style={[
                styles.toggleButton,
                reminder ? [styles.toggleActive, { backgroundColor: colors.primary }] : [styles.toggleInactive, { backgroundColor: colors.border }]
              ]}>
                {reminder && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.toggleText, { color: colors.text }]}>
                {reminder ? "On" : "Off"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {reminder && (
            <View style={styles.reminderTimeContainer}>
              <Text style={[styles.reminderLabel, { color: colors.text }]}>Remind me</Text>
              <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
                <Picker
                  selectedValue={reminderTime}
                  onValueChange={(itemValue) => setReminderTime(itemValue)}
                  style={styles.picker}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item label="5 minutes before" value={5} color={Platform.OS === 'android' ? colors.text : undefined} />
                  <Picker.Item label="10 minutes before" value={10} color={Platform.OS === 'android' ? colors.text : undefined} />
                  <Picker.Item label="15 minutes before" value={15} color={Platform.OS === 'android' ? colors.text : undefined} />
                  <Picker.Item label="30 minutes before" value={30} color={Platform.OS === 'android' ? colors.text : undefined} />
                  <Picker.Item label="1 hour before" value={60} color={Platform.OS === 'android' ? colors.text : undefined} />
                </Picker>
              </View>
            </View>
          )}
        </View>
        
        <Button
          title={isSubmitting ? "Adding to Schedule..." : "Add to Schedule"}
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isSubmitting || (workoutType === 'specific' && !selectedWorkoutId)}
        />
        
        {/* Added back button at the bottom */}
        <Button
          title="Back to Schedule"
          onPress={handleGoBack}
          variant="outline"
          style={styles.bottomBackButton}
          disabled={isSubmitting}
        />
      </ScrollView>
      
      {/* Workout Selector Modal */}
      <Modal
        visible={showWorkoutSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWorkoutSelector(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => {
            setShowWorkoutSelector(false);
            Keyboard.dismiss();
          }}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.background }]} onPress={e => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Workout</Text>
              <TouchableOpacity 
                onPress={() => setShowWorkoutSelector(false)}
                style={styles.modalCloseButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {workouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={[
                    styles.workoutOption,
                    { backgroundColor: colors.card },
                    selectedWorkoutId === workout.id && { borderWidth: 2, borderColor: colors.primary }
                  ]}
                  onPress={() => {
                    setSelectedWorkoutId(workout.id);
                    setShowWorkoutSelector(false);
                  }}
                >
                  <View style={styles.workoutOptionContent}>
                    <Text style={[styles.workoutOptionName, { color: colors.text }]}>{workout.name}</Text>
                    <Text style={[styles.workoutOptionDetails, { color: colors.textSecondary }]}>
                      {workout.duration} min • {workout.category} • {workout.difficulty}
                    </Text>
                  </View>
                  
                  {selectedWorkoutId === workout.id && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <Button
                title="Create New Workout"
                onPress={() => {
                  setShowWorkoutSelector(false);
                  router.push("/create-workout");
                }}
                variant="outline"
                style={styles.createWorkoutButton}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      
      {/* Success Toast */}
      <SuccessToast
        visible={showSuccessToast}
        message={successMessage}
        onHide={() => setShowSuccessToast(false)}
      />
    </View>
  );
}

// Define web input style as a separate object to fix type issues
const webInputStyle = {
  fontSize: 16,
  padding: 8,
  borderRadius: 8,
  borderWidth: 1,
  marginBottom: 16,
  width: "100%",
  maxWidth: 200,
  borderColor: "#ccc"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  workoutSelector: {
    minHeight: 120,
  },
  selectedWorkoutContainer: {
    marginBottom: 8,
  },
  changeButton: {
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectWorkoutButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  selectWorkoutText: {
    fontSize: 16,
  },
  workoutList: {
    paddingBottom: 8,
  },
  workoutItem: {
    width: 160,
    marginRight: 12,
  },
  workoutCard: {
    borderRadius: 8,
    padding: 12,
    height: 100,
    justifyContent: "space-between",
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "600",
  },
  workoutDuration: {
    fontSize: 14,
  },
  workoutCategory: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Schedule Type Styles
  scheduleTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  scheduleTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectedScheduleType: {
  },
  scheduleTypeIcon: {
    marginRight: 8,
  },
  scheduleTypeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Day Selection Styles
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayButton: {
    width: "31%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedDayButton: {
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedDayText: {
  },
  // Recurrence Styles
  recurrenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  recurrenceLabel: {
    fontSize: 16,
    marginRight: 12,
    width: 80,
  },
  // End Date Styles
  endDateContainer: {
    marginTop: 16,
  },
  endDateToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  endDateLabel: {
    fontSize: 16,
  },
  // Date Selector Styles
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  iosDatePickerContainer: {
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  webDatePickerContainer: {
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  // Time Selector Styles
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  iosTimePickerContainer: {
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  webTimePickerContainer: {
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  doneButton: {
    marginTop: 8,
    width: 120,
  },
  // Reminder Styles
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reminderToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  toggleActive: {
  },
  toggleInactive: {
  },
  toggleText: {
    fontSize: 14,
  },
  reminderTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderLabel: {
    fontSize: 16,
    marginRight: 12,
    width: 80,
  },
  pickerContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    height: 50, // Fixed height to prevent stretching
  },
  picker: {
    height: 50,
    width: '100%', // Ensure picker doesn't stretch beyond container
  },
  // Button Styles
  saveButton: {
    marginTop: 16,
  },
  bottomBackButton: {
    marginTop: 12,
  },
  backButton: {
    padding: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: "70%",
  },
  workoutOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutOptionContent: {
    flex: 1,
  },
  workoutOptionName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  workoutOptionDetails: {
    fontSize: 14,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  createWorkoutButton: {
    width: "100%",
  },
  // Workout Type Styles
  workoutTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  workoutTypeButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedWorkoutType: {
  },
  workoutTypeText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  workoutTypeSubtext: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 16,
  },
  successToast: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  successToastText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});