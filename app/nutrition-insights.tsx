import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Modal
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Calendar, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Info, 
  AlertCircle,
  Coffee,
  UtensilsCrossed,
  Soup,
  X
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useMacroStore } from '@/store/macroStore';
import { MacroLog } from '@/types';
import Button from '@/components/Button';

// Helper function to group logs by date
const groupLogsByDate = (logs: MacroLog[]) => {
  const grouped: Record<string, MacroLog[]> = {};
  
  logs.forEach(log => {
    const date = new Date(log.date).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(log);
  });
  
  return grouped;
};

// Helper function to group logs by meal type
const groupLogsByMealType = (logs: MacroLog[]) => {
  const grouped: Record<string, MacroLog[]> = {};
  
  logs.forEach(log => {
    const mealType = log.mealType || 'other';
    if (!grouped[mealType]) {
      grouped[mealType] = [];
    }
    grouped[mealType].push(log);
  });
  
  return grouped;
};

// Helper to get most frequent foods
const getMostFrequentFoods = (logs: MacroLog[], limit = 5) => {
  const foodCounts: Record<string, number> = {};
  
  logs.forEach(log => {
    if (log.foodName) {
      foodCounts[log.foodName] = (foodCounts[log.foodName] || 0) + 1;
    }
  });
  
  return Object.entries(foodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};

// Helper to calculate average macros by day
const calculateAverageMacrosByDay = (groupedLogs: Record<string, MacroLog[]>) => {
  const totalDays = Object.keys(groupedLogs).length;
  
  if (totalDays === 0) return null;
  
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  Object.values(groupedLogs).forEach(dayLogs => {
    const dayTotals = dayLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    
    totalCalories += dayTotals.calories;
    totalProtein += dayTotals.protein;
    totalCarbs += dayTotals.carbs;
    totalFat += dayTotals.fat;
  });
  
  return {
    calories: Math.round(totalCalories / totalDays),
    protein: Math.round(totalProtein / totalDays),
    carbs: Math.round(totalCarbs / totalDays),
    fat: Math.round(totalFat / totalDays),
  };
};

// Helper to identify macro distribution patterns
const identifyMacroPatterns = (averageMacros: { calories: number, protein: number, carbs: number, fat: number }, goals: any) => {
  if (!goals) return [];
  
  const patterns = [];
  
  // Calculate percentages
  const totalCaloriesFromMacros = 
    (averageMacros.protein * 4) + 
    (averageMacros.carbs * 4) + 
    (averageMacros.fat * 9);
  
  const proteinPercentage = Math.round((averageMacros.protein * 4 / totalCaloriesFromMacros) * 100);
  const carbsPercentage = Math.round((averageMacros.carbs * 4 / totalCaloriesFromMacros) * 100);
  const fatPercentage = Math.round((averageMacros.fat * 9 / totalCaloriesFromMacros) * 100);
  
  // Check protein intake
  if (proteinPercentage < 15) {
    patterns.push("Your protein intake is lower than recommended (15-30%). Consider adding more protein-rich foods.");
  } else if (proteinPercentage > 35) {
    patterns.push("Your protein intake is higher than typical recommendations. While this may align with specific fitness goals, ensure you're getting balanced nutrition.");
  }
  
  // Check carb intake
  if (carbsPercentage < 40) {
    patterns.push("Your carbohydrate intake is lower than typical recommendations (45-65%). This may be intentional if following a low-carb approach.");
  } else if (carbsPercentage > 65) {
    patterns.push("Your carbohydrate intake is higher than typical recommendations. Consider focusing on complex carbs and fiber sources.");
  }
  
  // Check fat intake
  if (fatPercentage < 20) {
    patterns.push("Your fat intake is lower than recommended (20-35%). Healthy fats are essential for hormone production and nutrient absorption.");
  } else if (fatPercentage > 35) {
    patterns.push("Your fat intake is higher than typical recommendations. Focus on sources of healthy unsaturated fats.");
  }
  
  return patterns;
};

// Helper to identify meal-specific patterns
const identifyMealPatterns = (logsByMealType: Record<string, MacroLog[]>) => {
  const patterns = [];
  
  // Check breakfast patterns
  if (logsByMealType.breakfast && logsByMealType.breakfast.length > 0) {
    const breakfastFoods = getMostFrequentFoods(logsByMealType.breakfast, 3);
    if (breakfastFoods.length > 0) {
      patterns.push(`Your most common breakfast foods are: ${breakfastFoods.map(f => f.name).join(', ')}`);
    }
    
    // Check protein content in breakfast
    const avgBreakfastProtein = logsByMealType.breakfast.reduce((sum, log) => sum + log.protein, 0) / logsByMealType.breakfast.length;
    if (avgBreakfastProtein < 15) {
      patterns.push("Your breakfasts tend to be lower in protein. Adding protein to breakfast can help with satiety throughout the day.");
    }
  } else {
    patterns.push("No breakfast logs found. Regular breakfast may help with energy levels and metabolism.");
  }
  
  // Check meal timing patterns
  if (logsByMealType.dinner && logsByMealType.dinner.length > 0) {
    let lateDinnerCount = 0;
    
    logsByMealType.dinner.forEach(log => {
      if (log.mealTime) {
        const [hours, minutes] = log.mealTime.split(':').map(Number);
        if (hours >= 20) { // After 8 PM
          lateDinnerCount++;
        }
      }
    });
    
    const lateDinnerPercentage = (lateDinnerCount / logsByMealType.dinner.length) * 100;
    if (lateDinnerPercentage > 50) {
      patterns.push("You often eat dinner later in the evening. Some research suggests earlier dinners may be beneficial for digestion and sleep quality.");
    }
  }
  
  return patterns;
};

// Helper to generate suggestions based on patterns
const generateSuggestions = (patterns: string[], averageMacros: any, goals: any) => {
  const suggestions = [];
  
  // Add general suggestions
  suggestions.push("Try to maintain consistent meal timing to help regulate hunger and energy levels.");
  suggestions.push("Include a variety of colorful fruits and vegetables to ensure adequate micronutrient intake.");
  
  // Add pattern-specific suggestions
  if (patterns.some(p => p.includes("protein intake is lower"))) {
    suggestions.push("Consider adding protein sources like Greek yogurt, eggs, lean meats, or plant-based options like tofu and legumes.");
  }
  
  if (patterns.some(p => p.includes("carbohydrate intake is higher"))) {
    suggestions.push("Focus on complex carbohydrates like whole grains, legumes, and vegetables rather than simple sugars.");
  }
  
  if (patterns.some(p => p.includes("fat intake is lower"))) {
    suggestions.push("Incorporate healthy fat sources like avocados, nuts, seeds, and olive oil into your meals.");
  }
  
  if (patterns.some(p => p.includes("breakfast"))) {
    suggestions.push("A balanced breakfast with protein, healthy fats, and complex carbs can help stabilize energy throughout the day.");
  }
  
  // Add goal-specific suggestions
  if (goals) {
    if (averageMacros.calories < goals.calories * 0.9) {
      suggestions.push("To reach your calorie goal, consider adding nutrient-dense foods like nuts, seeds, or additional servings of protein and healthy carbs.");
    } else if (averageMacros.calories > goals.calories * 1.1) {
      suggestions.push("To align with your calorie goal, consider adjusting portion sizes or substituting lower-calorie alternatives for some foods.");
    }
    
    if (averageMacros.protein < goals.protein * 0.9) {
      suggestions.push("You're currently below your protein target. Consider adding additional protein sources to your meals and snacks.");
    }
  }
  
  return suggestions;
};

// Info Modal Component
const InfoModal = ({ visible, onClose, title, content }: { visible: boolean, onClose: () => void, title: string, content: string }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalText}>{content}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function NutritionInsightsScreen() {
  const router = useRouter();
  const { macroLogs, macroGoals } = useMacroStore();
  
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<{
    averageMacros: any;
    patterns: string[];
    suggestions: string[];
    frequentFoods: { name: string; count: number }[];
    mealTypeDistribution: Record<string, number>;
    daysLogged: number;
    totalDays: number;
  } | null>(null);
  const [patternsInfoVisible, setPatternsInfoVisible] = useState(false);
  const [suggestionsInfoVisible, setSuggestionsInfoVisible] = useState(false);
  
  useEffect(() => {
    // Simulate loading delay
    setIsLoading(true);
    
    setTimeout(() => {
      analyzeNutritionData();
      setIsLoading(false);
    }, 1000);
  }, [timeframe, macroLogs]);
  
  const analyzeNutritionData = () => {
    // Get current date
    const currentDate = new Date();
    
    // Filter logs based on timeframe
    let startDate: Date;
    let totalDays: number;
    
    if (timeframe === 'week') {
      // Start from 7 days ago
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 7);
      totalDays = 7;
    } else {
      // Start from 30 days ago
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 30);
      totalDays = 30;
    }
    
    // Filter logs within the timeframe
    const filteredLogs = macroLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= currentDate;
    });
    
    // Group logs by date
    const logsByDate = groupLogsByDate(filteredLogs);
    const daysLogged = Object.keys(logsByDate).length;
    
    // Group logs by meal type
    const logsByMealType = groupLogsByMealType(filteredLogs);
    
    // Calculate meal type distribution
    const mealTypeDistribution: Record<string, number> = {};
    Object.entries(logsByMealType).forEach(([mealType, logs]) => {
      mealTypeDistribution[mealType] = logs.length;
    });
    
    // Calculate average macros
    const averageMacros = calculateAverageMacrosByDay(logsByDate);
    
    // Get most frequent foods
    const frequentFoods = getMostFrequentFoods(filteredLogs);
    
    // Generate insights
    let patterns: string[] = [];
    let suggestions: string[] = [];
    
    if (averageMacros) {
      // Identify macro distribution patterns
      const macroPatterns = identifyMacroPatterns(averageMacros, macroGoals);
      patterns = [...patterns, ...macroPatterns];
      
      // Identify meal-specific patterns
      const mealPatterns = identifyMealPatterns(logsByMealType);
      patterns = [...patterns, ...mealPatterns];
      
      // Generate suggestions
      suggestions = generateSuggestions(patterns, averageMacros, macroGoals);
    }
    
    // Set insights
    setInsights({
      averageMacros,
      patterns,
      suggestions,
      frequentFoods,
      mealTypeDistribution,
      daysLogged,
      totalDays
    });
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee size={20} color={colors.primary} />;
      case 'lunch':
        return <UtensilsCrossed size={20} color={colors.primary} />;
      case 'dinner':
        return <UtensilsCrossed size={20} color={colors.primary} />;
      case 'snack':
        return <Soup size={20} color={colors.primary} />;
      default:
        return <UtensilsCrossed size={20} color={colors.primary} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Nutrition Insights",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.timeframeSelector}>
        <TouchableOpacity 
          style={[
            styles.timeframeButton, 
            timeframe === 'week' && styles.timeframeButtonActive
          ]}
          onPress={() => setTimeframe('week')}
        >
          <Text style={[
            styles.timeframeButtonText,
            timeframe === 'week' && styles.timeframeButtonTextActive
          ]}>
            Last 7 Days
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.timeframeButton, 
            timeframe === 'month' && styles.timeframeButtonActive
          ]}
          onPress={() => setTimeframe('month')}
        >
          <Text style={[
            styles.timeframeButtonText,
            timeframe === 'month' && styles.timeframeButtonTextActive
          ]}>
            Last 30 Days
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Back button below timeframe selector */}
      <TouchableOpacity 
        onPress={handleGoBack} 
        style={styles.belowTimeframeBackButton}
        accessibilityLabel="Go back"
        accessibilityHint="Returns to the previous screen"
      >
        <ArrowLeft size={24} color={colors.text} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing your nutrition data...</Text>
        </View>
      ) : insights && insights.averageMacros ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.dataCompleteness}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.dataCompletenessText}>
              Data logged for {insights.daysLogged} out of {insights.totalDays} days
              {insights.daysLogged < 3 && " (limited data for analysis)"}
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Average Daily Macros</Text>
            </View>
            
            <View style={styles.macroCard}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Calories</Text>
                <Text style={styles.macroValue}>{insights.averageMacros.calories} kcal</Text>
                {macroGoals && (
                  <Text style={styles.macroGoal}>
                    Goal: {macroGoals.calories} kcal
                    {insights.averageMacros.calories < macroGoals.calories * 0.9 && " (Under)"}
                    {insights.averageMacros.calories > macroGoals.calories * 1.1 && " (Over)"}
                  </Text>
                )}
              </View>
              
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValue}>{insights.averageMacros.protein}g</Text>
                {macroGoals && (
                  <Text style={styles.macroGoal}>
                    Goal: {macroGoals.protein}g
                    {insights.averageMacros.protein < macroGoals.protein * 0.9 && " (Under)"}
                    {insights.averageMacros.protein > macroGoals.protein * 1.1 && " (Over)"}
                  </Text>
                )}
              </View>
              
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <Text style={styles.macroValue}>{insights.averageMacros.carbs}g</Text>
                {macroGoals && (
                  <Text style={styles.macroGoal}>
                    Goal: {macroGoals.carbs}g
                    {insights.averageMacros.carbs < macroGoals.carbs * 0.9 && " (Under)"}
                    {insights.averageMacros.carbs > macroGoals.carbs * 1.1 && " (Over)"}
                  </Text>
                )}
              </View>
              
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Fat</Text>
                <Text style={styles.macroValue}>{insights.averageMacros.fat}g</Text>
                {macroGoals && (
                  <Text style={styles.macroGoal}>
                    Goal: {macroGoals.fat}g
                    {insights.averageMacros.fat < macroGoals.fat * 0.9 && " (Under)"}
                    {insights.averageMacros.fat > macroGoals.fat * 1.1 && " (Over)"}
                  </Text>
                )}
              </View>
            </View>
          </View>
          
          {insights.frequentFoods.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <PieChart size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Most Frequent Foods</Text>
              </View>
              
              <View style={styles.foodCard}>
                {insights.frequentFoods.map((food, index) => (
                  <View key={index} style={styles.foodItem}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodCount}>{food.count} times</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {Object.keys(insights.mealTypeDistribution).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Meal Distribution</Text>
              </View>
              
              <View style={styles.mealCard}>
                {Object.entries(insights.mealTypeDistribution).map(([mealType, count]) => (
                  <View key={mealType} style={styles.mealItem}>
                    {getMealTypeIcon(mealType)}
                    <Text style={styles.mealName}>
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Text>
                    <Text style={styles.mealCount}>{count} logs</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {insights.patterns.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Info size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Patterns Identified</Text>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => setPatternsInfoVisible(true)}
                >
                  <Info size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.patternsCard}>
                {insights.patterns.map((pattern, index) => (
                  <View key={index} style={styles.patternItem}>
                    <Text style={styles.patternText}>{pattern}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {insights.suggestions.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Suggestions</Text>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => setSuggestionsInfoVisible(true)}
                >
                  <Info size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.suggestionsCard}>
                {insights.suggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
                
                <View style={styles.disclaimerContainer}>
                  <Text style={styles.disclaimerText}>
                    These are general suggestions based on your logged data. For personalized nutrition advice, consult with a registered dietitian or healthcare provider.
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          {insights.daysLogged < 3 && (
            <View style={styles.section}>
              <View style={styles.limitedDataCard}>
                <AlertCircle size={24} color={colors.warning} />
                <Text style={styles.limitedDataTitle}>Limited Data Available</Text>
                <Text style={styles.limitedDataText}>
                  You've only logged nutrition for {insights.daysLogged} {insights.daysLogged === 1 ? 'day' : 'days'} in this timeframe. For more accurate insights, try to log your meals consistently.
                </Text>
                <Button
                  title="Log Food Now"
                  onPress={() => router.push('/log-food')}
                  style={styles.logFoodButton}
                />
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <BarChart3 size={60} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No Nutrition Data</Text>
          <Text style={styles.emptyText}>
            Start logging your meals to get personalized nutrition insights and recommendations.
          </Text>
          <Button
            title="Log Food Now"
            onPress={() => router.push('/log-food')}
            style={styles.logFoodButton}
          />
        </View>
      )}
      
      {/* Info Modals */}
      <InfoModal
        visible={patternsInfoVisible}
        onClose={() => setPatternsInfoVisible(false)}
        title="About Patterns"
        content="These patterns are identified based on your logged nutrition data. The analysis looks at your macro distribution, meal timing, and food choices to identify potential trends. This information is meant to help you understand your eating habits better, but should not be considered medical advice. The accuracy of these patterns depends on how consistently you log your meals."
      />
      
      <InfoModal
        visible={suggestionsInfoVisible}
        onClose={() => setSuggestionsInfoVisible(false)}
        title="About Suggestions"
        content="These suggestions are generated based on the patterns identified in your nutrition data. They are general recommendations that may help you achieve a more balanced diet or reach your nutrition goals. These suggestions are not personalized medical or nutrition advice. For personalized guidance, please consult with a registered dietitian or healthcare provider who can take into account your specific health needs, goals, and preferences."
      />
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
  timeframeSelector: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.card,
    marginHorizontal: 4,
  },
  timeframeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeframeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  timeframeButtonTextActive: {
    color: '#FFFFFF',
  },
  // Back button style
  belowTimeframeBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dataCompleteness: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.highlight,
  },
  dataCompletenessText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
    padding: 16,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  infoButton: {
    marginLeft: 8,
    padding: 2,
  },
  macroCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroItem: {
    marginBottom: 16,
  },
  macroLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  macroGoal: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  foodCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  foodCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  mealCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  patternsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patternItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patternText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  suggestionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  disclaimerContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.highlight,
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  logFoodButton: {
    width: 200,
  },
  limitedDataCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  limitedDataTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  limitedDataText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 300,
  },
  modalText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});