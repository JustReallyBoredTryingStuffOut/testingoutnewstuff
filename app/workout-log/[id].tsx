import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ArrowLeft, Clock, Dumbbell, Trash2, Edit, Copy, Calendar } from "lucide-react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useWorkoutStore } from "@/store/workoutStore";
import { useTheme } from "@/context/ThemeContext";

export default function WorkoutLogDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { 
    workoutLogs, 
    workouts, 
    exercises, 
    deleteWorkoutLog,
    copyWorkoutToCustom
  } = useWorkoutStore();
  
  const [workoutLog, setWorkoutLog] = useState<any>(null);
  const [workout, setWorkout] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const log = workoutLogs.find(log => log.id === id);
      if (log) {
        setWorkoutLog(log);
        const workoutData = workouts.find(w => w.id === log.workoutId);
        setWorkout(workoutData);
      }
    }
  }, [id, workoutLogs, workouts]);
  
  if (!workoutLog || !workout) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{
            title: "Workout Log",
            headerShown: true,
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Workout log not found
          </Text>
        </View>
      </View>
    );
  }
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Workout Log",
      "Are you sure you want to delete this workout log? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            try {
              deleteWorkoutLog(workoutLog.id);
              router.back();
            } catch (error) {
              console.error("Error deleting workout log:", error);
              Alert.alert("Error", "Failed to delete workout log");
            }
          }
        }
      ]
    );
  };
  
  const handleCopyWorkout = () => {
    const newId = copyWorkoutToCustom(workout.id);
    if (newId) {
      Alert.alert(
        "Success", 
        "Workout copied to your custom workouts",
        [{ text: "OK" }]
      );
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Workout Log",
          headerShown: true,
        }}
      />
      
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.workoutName, { color: colors.text }]}>
            {workout.name}
          </Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {formatDate(workoutLog.date)}
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {workoutLog.duration} min
              </Text>
            </View>
            <View style={styles.statItem}>
              <Dumbbell size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {workoutLog.exercises.length} exercises
              </Text>
            </View>
          </View>
          
          {workoutLog.rating && (
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { color: colors.text }]}>
                Rating: {workoutLog.rating.rating}/5
              </Text>
              {workoutLog.rating.comment && (
                <Text style={[styles.ratingComment, { color: colors.textSecondary }]}>
                  "{workoutLog.rating.comment}"
                </Text>
              )}
            </View>
          )}
        </View>
        
        {/* Exercises */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
          
          {workoutLog.exercises.map((exerciseLog: any, index: number) => {
            const exercise = exercises.find(e => e.id === exerciseLog.exerciseId);
            return (
              <View key={index} style={[styles.exerciseItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.exerciseName, { color: colors.text }]}>
                  {exercise?.name || "Unknown Exercise"}
                </Text>
                
                <View style={styles.setsList}>
                  {exerciseLog.sets.map((set: any, setIndex: number) => (
                    <Text key={setIndex} style={[styles.setInfo, { color: colors.textSecondary }]}>
                      Set {setIndex + 1}: {set.weight} kg × {set.reps} reps
                    </Text>
                  ))}
                  {exerciseLog.sets.length === 0 && (
                    <Text style={[styles.noSetsText, { color: colors.textLight }]}>
                      No sets recorded
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Notes */}
        {workoutLog.notes && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>
              {workoutLog.notes}
            </Text>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={handleDelete}
          >
            <Trash2 size={16} color={colors.white} />
            <Text style={[styles.actionButtonText, { color: colors.white }]}>
              Delete Log
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.highlight }]}
            onPress={handleCopyWorkout}
          >
            <Copy size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Save as Custom
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/workout/${workout.id}`)}
          >
            <Dumbbell size={16} color={colors.white} />
            <Text style={[styles.actionButtonText, { color: colors.white }]}>
              Start Workout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  ratingContainer: {
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  ratingComment: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  exerciseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  setsList: {
    marginLeft: 8,
  },
  setInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  noSetsText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
}); 