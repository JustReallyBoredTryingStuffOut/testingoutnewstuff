import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import { MacroGoals } from "@/types";
import { useGamificationStore } from "@/store/gamificationStore";
import { Trophy, Info } from "lucide-react-native";
import { useRouter } from "expo-router";
import MacroInfoModal from "./MacroInfoModal";
import { useTheme } from "@/context/ThemeContext";

interface MacroSummaryProps {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: MacroGoals | null;
}

export default function MacroSummary({ current, goals }: MacroSummaryProps) {
  const { gamificationEnabled, achievements } = useGamificationStore();
  const router = useRouter();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const { colors } = useTheme();
  
  // Check if goals are valid
  const hasValidGoals = goals && 
    goals.calories > 0 && 
    goals.protein > 0 && 
    goals.carbs > 0 && 
    goals.fat > 0;
  
  // If no valid goals, show a message to set them up
  if (!hasValidGoals) {
    return (
      <View style={styles.container}>
        <View style={[styles.noGoalsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.noGoalsTitle, { color: colors.text }]}>No Nutrition Goals Set</Text>
          <Text style={[styles.noGoalsDescription, { color: colors.textSecondary }]}>
            Set up your daily macro goals to track your nutrition progress and get personalized recommendations.
          </Text>
          <TouchableOpacity 
            style={[styles.setupGoalsButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/health-goals")}
          >
            <Text style={[styles.setupGoalsButtonText, { color: colors.white }]}>Set Up Nutrition Goals</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  // Calculate remaining macros
  const remaining = {
    calories: Math.max(0, goals.calories - current.calories),
    protein: Math.max(0, goals.protein - current.protein),
    carbs: Math.max(0, goals.carbs - current.carbs),
    fat: Math.max(0, goals.fat - current.fat),
  };

  // Calculate percentages
  const percentages = {
    calories: Math.min(100, (current.calories / goals.calories) * 100 || 0),
    protein: Math.min(100, (current.protein / goals.protein) * 100 || 0),
    carbs: Math.min(100, (current.carbs / goals.carbs) * 100 || 0),
    fat: Math.min(100, (current.fat / goals.fat) * 100 || 0),
  };
  
  // Get nutrition achievements
  const nutritionAchievements = achievements.filter(a => 
    a.category === "nutrition" && !a.completed
  );
  
  // Check if we're close to any nutrition achievements
  const proteinGoalAchievement = nutritionAchievements.find(a => a.id === "nutrition-protein-goal");
  const balancedMacrosAchievement = nutritionAchievements.find(a => a.id === "nutrition-balanced-10");
  
  // Generate motivational messages
  const getMotivationalMessage = () => {
    // Check if all macros are at least 90% complete
    const allMacrosNearlyComplete = 
      percentages.protein >= 90 && 
      percentages.carbs >= 90 && 
      percentages.fat >= 90;
    
    if (allMacrosNearlyComplete) {
      return "Great job! You've nearly hit all your macro targets for today! 🎯";
    }
    
    // Check if protein is highest
    if (percentages.protein >= percentages.carbs && percentages.protein >= percentages.fat) {
      if (percentages.protein >= 90) {
        return "Excellent protein intake today! Your muscles thank you! 💪";
      } else if (percentages.protein >= 70) {
        return "You're doing well with protein today. Keep it up! 💪";
      } else {
        return "Focus on getting more protein to support your fitness goals! 🥩";
      }
    }
    
    // Check if carbs are highest
    if (percentages.carbs >= percentages.protein && percentages.carbs >= percentages.fat) {
      if (percentages.carbs >= 90) {
        return "You've fueled up well with carbs today! Great energy source! 🍚";
      } else if (percentages.carbs >= 70) {
        return "Good carb intake today. Keeping your energy levels up! 🍞";
      } else {
        return "Consider adding more complex carbs for sustained energy! 🌾";
      }
    }
    
    // Check if fats are highest
    if (percentages.fat >= 90) {
      return "You're doing great with healthy fats today! 🥑";
    } else if (percentages.fat >= 70) {
      return "Good fat intake today. Important for hormone health! 🧠";
    } else {
      return "Don't forget healthy fats - they're essential for your body! 🫒";
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <View style={[styles.calorieSection, { borderBottomColor: colors.border }]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.calorieTitle, { color: colors.text }]}>Calories</Text>
            <TouchableOpacity 
              onPress={() => setInfoModalVisible(true)}
              style={styles.infoButton}
              accessibilityLabel="Nutrition information"
              accessibilityHint="Opens a modal with information about how nutrition goals are calculated"
            >
              <Info size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.calorieNumbers}>
            <Text style={[styles.calorieConsumed, { color: colors.text }]}>{current.calories}</Text>
            <Text style={[styles.calorieDivider, { color: colors.textSecondary }]}>/</Text>
            <Text style={[styles.calorieGoal, { color: colors.textSecondary }]}>{goals.calories}</Text>
          </View>
          <Text style={[styles.calorieRemaining, { color: colors.textSecondary }]}>
            {remaining.calories} kcal remaining
          </Text>

          <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressBar,
                { width: `${percentages.calories}%`, backgroundColor: colors.calorieColor },
              ]}
            />
          </View>
        </View>

        <View style={styles.macroSection}>
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <View
                style={[styles.macroIndicator, { backgroundColor: colors.macroProtein }]}
              />
              <Text style={[styles.macroTitle, { color: colors.text }]}>Protein</Text>
            </View>
            <Text style={[styles.macroValue, { color: colors.text }]}>
              {current.protein}g / {goals.protein}g
            </Text>
            {proteinGoalAchievement && gamificationEnabled && (
              <View style={styles.achievementProgress}>
                <Trophy size={12} color={colors.primary} />
                <Text style={[styles.achievementText, { color: colors.primary }]}>
                  {proteinGoalAchievement.progress}/{proteinGoalAchievement.target} days
                </Text>
              </View>
            )}
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <View
                style={[styles.macroIndicator, { backgroundColor: colors.macroCarbs }]}
              />
              <Text style={[styles.macroTitle, { color: colors.text }]}>Carbs</Text>
            </View>
            <Text style={[styles.macroValue, { color: colors.text }]}>
              {current.carbs}g / {goals.carbs}g
            </Text>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <View
                style={[styles.macroIndicator, { backgroundColor: colors.macroFat }]}
              />
              <Text style={[styles.macroTitle, { color: colors.text }]}>Fat</Text>
            </View>
            <Text style={[styles.macroValue, { color: colors.text }]}>
              {current.fat}g / {goals.fat}g
            </Text>
          </View>
        </View>
        
        {gamificationEnabled && (
          <View style={[styles.motivationContainer, { backgroundColor: colors.backgroundLight }]}>
            <Text style={[styles.motivationText, { color: colors.text }]}>{getMotivationalMessage()}</Text>
            
            {balancedMacrosAchievement && (
              <TouchableOpacity style={[styles.achievementButton, { backgroundColor: colors.backgroundLight, borderColor: colors.border }]}>
                <Trophy size={14} color={colors.primary} />
                <Text style={[styles.achievementButtonText, { color: colors.primary }]}>
                  {balancedMacrosAchievement.progress}/{balancedMacrosAchievement.target} balanced days
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      <MacroInfoModal 
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calorieSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoButton: {
    marginLeft: 8,
    padding: 2,
  },
  calorieNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  calorieConsumed: {
    fontSize: 28,
    fontWeight: "700",
  },
  calorieDivider: {
    fontSize: 20,
    marginHorizontal: 4,
  },
  calorieGoal: {
    fontSize: 20,
  },
  calorieRemaining: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  macroSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  macroItem: {
    flex: 1,
  },
  macroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  achievementProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  achievementText: {
    fontSize: 12,
    marginLeft: 4,
  },
  motivationContainer: {
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  motivationText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
  achievementButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  achievementButtonText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  noGoalsCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  noGoalsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noGoalsDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  setupGoalsButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  setupGoalsButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});