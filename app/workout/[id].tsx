import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Clock, Dumbbell, Award, Zap, BarChart, ArrowLeft } from "lucide-react-native";
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
    workoutLogs,
    startWorkout, 
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
    router.push({
      pathname: "/add-workout-schedule",
      params: { workoutId: workout.id }
    });
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
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{workout.duration} min</Text>
            </View>
            <View style={styles.stat}>
              <Dumbbell size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{workout.exercises.length} exercises</Text>
            </View>
            <View style={styles.stat}>
              <Award size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{workout.difficulty}</Text>
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
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
          {workout.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseContainer}>
              <View style={[styles.exerciseNumber, { backgroundColor: colors.primary }]}> 
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              <ExerciseCard exercise={exercise} />
            </View>
          ))}
        </View>
        <Button 
          title="Start Workout" 
          onPress={handleStartWorkout}
          style={{ marginTop: 24 }}
        />
        <Button 
          title="Add to Schedule" 
          onPress={handleScheduleWorkout}
          style={{ marginTop: 12 }}
          variant="outline"
        />
        <Button 
          title="Back to Workouts" 
          onPress={handleGoBack}
          style={{ marginTop: 12, marginBottom: 24 }}
          variant="text"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  recommendedBanner: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  recommendedText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    color: "#888",
    marginBottom: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exerciseNumberText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 40,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  statsToggle: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsContent: {
    marginTop: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  analyzeButton: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  backButton: {
    marginLeft: 8,
    padding: 4,
  },
});