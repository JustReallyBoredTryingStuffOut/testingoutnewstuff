import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Clock, Dumbbell, ChevronRight, Zap } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Workout } from "@/types";

type WorkoutCardProps = {
  workout: Workout & { isRecommended?: boolean };
  onPress?: () => void;
};

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/workout/${workout.id}`);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        workout.isRecommended && styles.recommendedContainer
      ]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {workout.isRecommended && (
              <View style={styles.recommendedBadge}>
                <Zap size={12} color="#FFFFFF" />
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
            <Text style={styles.title}>{workout.name}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getBadgeColor(workout.difficulty) }]}>
            <Text style={styles.badgeText}>{workout.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{workout.duration} min</Text>
          </View>
          
          <View style={styles.stat}>
            <Dumbbell size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.arrow}>
        <ChevronRight size={20} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const getBadgeColor = (difficulty: "beginner" | "intermediate" | "advanced") => {
  switch (difficulty) {
    case "beginner":
      return "#4CD964";
    case "intermediate":
      return "#FFCC00";
    case "advanced":
      return "#FF3B30";
    default:
      return colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendedContainer: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    marginTop: 4,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  arrow: {
    justifyContent: "center",
  },
});