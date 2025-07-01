import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Clock, ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useMacroStore } from "@/store/macroStore";
import { useTheme } from "@/context/ThemeContext";
import { MealRecommendation } from "@/types";

interface MealRecommendationsProps {
  dietaryRestrictions?: string[];
  maxCalories?: number;
  minProtein?: number;
  limit?: number;
}

export default function MealRecommendations({
  dietaryRestrictions = [],
  maxCalories,
  minProtein,
  limit = 3
}: MealRecommendationsProps) {
  const router = useRouter();
  const { getMealRecommendations } = useMacroStore();
  const { colors } = useTheme();
  
  // Get meal recommendations based on filters
  const recommendations = getMealRecommendations(
    dietaryRestrictions,
    maxCalories,
    minProtein
  ).slice(0, limit);
  
  if (recommendations.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>No recommendations found</Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Try adjusting your dietary filters
        </Text>
      </View>
    );
  }
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {recommendations.map((meal) => (
        <TouchableOpacity
          key={meal.id}
          style={[styles.mealCard, { backgroundColor: colors.card }]}
          onPress={() => router.push(`/meal/${meal.id}`)}
        >
          {meal.imageUrl && (
            <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
          )}
          
          <View style={styles.mealContent}>
            <Text style={[styles.mealName, { color: colors.text }]}>{meal.name}</Text>
            
            <View style={styles.mealMacros}>
              <Text style={[styles.macroText, { color: colors.textSecondary }]}>
                {meal.calories} kcal
              </Text>
              <Text style={[styles.macroText, { color: colors.textSecondary }]}>
                P: {meal.protein}g
              </Text>
              <Text style={[styles.macroText, { color: colors.textSecondary }]}>
                C: {meal.carbs}g
              </Text>
              <Text style={[styles.macroText, { color: colors.textSecondary }]}>
                F: {meal.fat}g
              </Text>
            </View>
            
            <View style={styles.mealFooter}>
              <View style={styles.timeContainer}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {meal.prepTime + meal.cookTime} min
                </Text>
              </View>
              
              <View style={styles.restrictionsContainer}>
                {meal.dietaryRestrictions.map((restriction) => (
                  <View 
                    key={restriction} 
                    style={[styles.restrictionBadge, { backgroundColor: colors.highlight }]}
                  >
                    <Text style={[styles.restrictionText, { color: colors.primary }]}>
                      {restriction}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.cardArrow}>
            <ChevronRight size={20} color={colors.textLight} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  mealCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealImage: {
    width: "100%",
    height: 140,
  },
  mealContent: {
    padding: 16,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  mealMacros: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  macroText: {
    fontSize: 14,
  },
  mealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  restrictionsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  restrictionBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  restrictionText: {
    fontSize: 10,
    fontWeight: "500",
  },
  cardArrow: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});