import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMealStore } from '../../store/mealStore';
import { useFoodStore } from '../../store/foodStore';
import { useNutritionStore } from '../../store/nutritionStore';
import { useUserStore } from '../../store/userStore';
import { Meal, FoodItem } from '../../types/meal';
import { formatDate } from '../../utils/dateUtils';
import { calculateNutrition } from '../../utils/nutritionUtils';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { getMealById, deleteMeal } = useMealStore();
  const { deleteFoodItem } = useFoodStore();
  const { updateNutrition } = useNutritionStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (id) {
      const foundMeal = getMealById(id as string);
      setMeal(foundMeal);
      setLoading(false);
    }
  }, [id, getMealById]);

  const handleDeleteMeal = () => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (meal) {
              // Delete all food items in the meal
              meal.foodItems.forEach(foodItem => {
                deleteFoodItem(foodItem.id);
              });
              
              // Delete the meal
              deleteMeal(meal.id);
              
              // Update nutrition totals
              if (user) {
                const updatedNutrition = calculateNutrition(user.id);
                updateNutrition(updatedNutrition);
              }
              
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleDeleteFoodItem = (foodItem: FoodItem) => {
    Alert.alert(
      'Remove Food Item',
      `Are you sure you want to remove ${foodItem.name} from this meal?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (meal) {
              // Remove food item from meal
              const updatedFoodItems = meal.foodItems.filter(item => item.id !== foodItem.id);
              const updatedMeal = { ...meal, foodItems: updatedFoodItems };
              
              // Update meal in store
              useMealStore.getState().updateMeal(updatedMeal);
              
              // Delete the food item
              deleteFoodItem(foodItem.id);
              
              // Update nutrition totals
              if (user) {
                const updatedNutrition = calculateNutrition(user.id);
                updateNutrition(updatedNutrition);
              }
              
              setMeal(updatedMeal);
            }
          },
        },
      ]
    );
  };

  const getTotalNutrition = () => {
    if (!meal) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return meal.foodItems.reduce((totals, item) => ({
      calories: totals.calories + (item.nutrition.calories || 0),
      protein: totals.protein + (item.nutrition.protein || 0),
      carbs: totals.carbs + (item.nutrition.carbs || 0),
      fat: totals.fat + (item.nutrition.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading meal details...</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Meal not found</Text>
      </View>
    );
  }

  const totalNutrition = getTotalNutrition();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{meal.name}</Text>
        <TouchableOpacity onPress={handleDeleteMeal} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mealInfo}>
          <Text style={styles.dateText}>{formatDate(meal.date)}</Text>
          <Text style={styles.mealTypeText}>{meal.mealType}</Text>
        </View>

        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Total Nutrition</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(totalNutrition.calories)}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(totalNutrition.protein)}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(totalNutrition.carbs)}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(totalNutrition.fat)}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </View>

        <View style={styles.foodItemsSection}>
          <Text style={styles.sectionTitle}>Food Items ({meal.foodItems.length})</Text>
          {meal.foodItems.map((foodItem) => (
            <View key={foodItem.id} style={styles.foodItemCard}>
              <View style={styles.foodItemHeader}>
                <View style={styles.foodItemInfo}>
                  <Text style={styles.foodItemName}>{foodItem.name}</Text>
                  <Text style={styles.foodItemServing}>
                    {foodItem.servingSize} {foodItem.servingUnit}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteFoodItem(foodItem)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.foodItemNutrition}>
                <Text style={styles.foodItemCalories}>
                  {Math.round(foodItem.nutrition.calories || 0)} calories
                </Text>
                <View style={styles.foodItemMacros}>
                  <Text style={styles.macroText}>
                    P: {Math.round(foodItem.nutrition.protein || 0)}g
                  </Text>
                  <Text style={styles.macroText}>
                    C: {Math.round(foodItem.nutrition.carbs || 0)}g
                  </Text>
                  <Text style={styles.macroText}>
                    F: {Math.round(foodItem.nutrition.fat || 0)}g
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {meal.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{meal.notes}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mealInfo: {
    marginTop: 20,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  mealTypeText: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
  },
  nutritionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nutritionTitle: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  foodItemsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 16,
  },
  foodItemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodItemInfo: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  foodItemServing: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  removeButton: {
    padding: 4,
  },
  foodItemNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodItemCalories: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  foodItemMacros: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});