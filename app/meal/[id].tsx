import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Clock, Dumbbell, Award, Zap, Calendar, BarChart, ArrowLeft } from "lucide-react-native";
import { useWorkoutStore } from "@/store/workoutStore";
import { useAiStore } from "@/store/aiStore";
import { useTheme } from "@/context/ThemeContext";
import ExerciseCard from "@/components/ExerciseCard";
import Button from "@/components/Button";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    workouts, 
    exercises,
    startWorkout, 
    workoutLogs,
    getAverageWorkoutDuration,
    getRecommendedWorkouts
  } = useWorkoutStore();
  const { analyzeWorkoutDurations } = useAiStore();
  
  const [showStats, setShowStats] = useState(false);
  
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Workout not found</Text>
        <Button 
          title="Back to Workouts" 
          onPress={() => router.navigate("/(tabs)/workouts")}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  // Get workout stats
  const completedLogs = workoutLogs.filter(
    log => log.workoutId === workout.id && log.completed
  );
  
  const averageDuration = getAverageWorkoutDuration(workout.id);
  const lastCompletedDate = completedLogs.length > 0 
    ? new Date(completedLogs[completedLogs.length - 1].date).toLocaleDateString()
    : "Never";
  
  const totalCompletions = completedLogs.length;
  
  // Check if this workout is recommended
  const recommendedWorkouts = getRecommendedWorkouts();
  const isRecommended = recommendedWorkouts.some(w => w.id === workout.id);
  
  const handleStartWorkout = () => {
    startWorkout(workout.id);
    router.push("/active-workout");
  };
  
  const handleScheduleWorkout = () => {
    // Pass the workout ID to the scheduling screen
    router.push({
      pathname: "/add-workout-schedule",
      params: { workoutId: workout.id }
    });
  };
  
  const handleAnalyzeWorkouts = () => {
    // Analyze workout logs for this specific workout
    const relevantLogs = workoutLogs.filter(log => log.workoutId === workout.id);
    
    if (relevantLogs.length < 2) {
      Alert.alert(
        "Not Enough Data",
        "Complete this workout at least twice to see analysis and recommendations."
      );
      return;
    }
    
    analyzeWorkoutDurations(relevantLogs);
    router.push("/goals"); // Navigate to goals page where analysis can be viewed
  };

  const handleGoBack = () => {
    router.navigate("/(tabs)/workouts");
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: workout.name,
          headerBackTitle: "Workouts",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back to workouts"
              accessibilityHint="Returns to the workouts list"
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {isRecommended && (
            <View style={[styles.recommendedBanner, { backgroundColor: colors.primary }]}>
              <Zap size={16} color="#FFFFFF" />
              <Text style={styles.recommendedText}>Recommended for you</Text>
            </View>
          )}
          
          <Text style={[styles.title, { color: colors.text }]}>{workout.name}</Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{workout.duration || 0} min</Text>
            </View>
            
            <View style={styles.stat}>
              <Dumbbell size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{workout.exercises?.length || 0} exercises</Text>
            </View>
            
            <View style={styles.stat}>
              <Award size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{workout.difficulty || 'Unknown'}</Text>
            </View>
          </View>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>{workout.description}</Text>
          
          {totalCompletions > 0 && (
            <TouchableOpacity 
              style={[styles.statsCard, { backgroundColor: colors.card }]}
              onPress={() => setShowStats(!showStats)}
            >
              <View style={styles.statsHeader}>
                <View style={styles.statsHeaderLeft}>
                  <BarChart size={16} color={colors.primary} />
                  <Text style={[styles.statsTitle, { color: colors.text }]}>Your Stats</Text>
                </View>
                <Text style={[styles.statsToggle, { color: colors.primary }]}>
                  {showStats ? "Hide" : "Show"}
                </Text>
              </View>
              
              {showStats && (
                <View style={styles.statsContent}>
                  <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Average Duration</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{averageDuration} min</Text>
                  </View>
                  
                  <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{totalCompletions} times</Text>
                  </View>
                  
                  <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Last Completed</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{lastCompletedDate}</Text>
                  </View>
                  
                  {totalCompletions >= 2 && (
                    <TouchableOpacity 
                      style={styles.analyzeButton}
                      onPress={handleAnalyzeWorkouts}
                    >
                      <Text style={[styles.analyzeButtonText, { color: colors.primary }]}>
                        Analyze My Performance
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
          
          {workout.exercises && workout.exercises.length > 0 ? (
            workout.exercises
              .filter(exerciseItem => exerciseItem && exerciseItem.id) // Filter out null/undefined exercises
              .map((exerciseItem, index) => {
              const exercise = exercises.find(e => e.id === exerciseItem.id);
              if (!exercise) return null;
              
              return (
                <View key={exercise.id} style={styles.exerciseContainer}>
                  <View style={[styles.exerciseNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  <ExerciseCard exercise={exercise} />
                </View>
              );
            })
          ) : (
            <Text style={[styles.noExercisesText, { color: colors.textSecondary }]}>
              No exercises found for this workout.
            </Text>
          )}
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Button
          title="Start Workout"
          onPress={handleStartWorkout}
          size="large"
          style={styles.startButton}
        />
        <Button
          title="Add to Schedule"
          onPress={handleScheduleWorkout}
          variant="outline"
          style={styles.scheduleButton}
        />
        <TouchableOpacity 
          style={styles.backToWorkoutsButton}
          onPress={handleGoBack}
          accessibilityLabel="Back to workouts"
          accessibilityHint="Returns to the workouts list"
        >
          <Text style={[styles.backToWorkoutsText, { color: colors.textSecondary }]}>
            Back to Workouts
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Increased to accommodate the back button
  },
  header: {
    marginBottom: 24,
  },
  recommendedBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  statsToggle: {
    fontSize: 14,
  },
  statsContent: {
    marginTop: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  analyzeButton: {
    marginTop: 16,
    alignItems: "center",
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 16,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 16,
  },
  startButton: {
    width: "100%",
    marginBottom: 8,
  },
  scheduleButton: {
    width: "100%",
    marginBottom: 8,
  },
  backToWorkoutsButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  backToWorkoutsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  backButton: {
    padding: 8,
  },
  noExercisesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
});