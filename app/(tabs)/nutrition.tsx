import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, ChevronRight, UtensilsCrossed, BarChart, Calendar, ArrowLeft, Info } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useMacroStore } from '@/store/macroStore';
import { useGamificationStore } from '@/store/gamificationStore';
import MacroProgress from '@/components/MacroProgress';
import MacroSummary from '@/components/MacroSummary';
import MacroInfoModal from '@/components/MacroInfoModal';

export default function NutritionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { macroGoals, macroLogs, calculateDailyMacros } = useMacroStore();
  const { gamificationEnabled, achievements } = useGamificationStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Format date as ISO string (YYYY-MM-DD)
  const dateString = selectedDate.toISOString().split('T')[0];
  
  // Calculate today's macros
  const todayMacros = calculateDailyMacros(dateString) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  // Calculate percentages with safety checks
  const caloriePercentage = Math.min(100, ((todayMacros.calories || 0) / (macroGoals?.calories || 1)) * 100);
  const proteinPercentage = Math.min(100, ((todayMacros.protein || 0) / (macroGoals?.protein || 1)) * 100);
  const carbsPercentage = Math.min(100, ((todayMacros.carbs || 0) / (macroGoals?.carbs || 1)) * 100);
  const fatPercentage = Math.min(100, ((todayMacros.fat || 0) / (macroGoals?.fat || 1)) * 100);
  
  // Get nutrition achievements
  const nutritionAchievements = achievements.filter(a => 
    a.category === "nutrition" && !a.completed
  );
  
  // Find specific achievements
  const proteinGoalAchievement = nutritionAchievements.find(a => a.id === "nutrition-protein-goal");
  const balancedMacrosAchievement = nutritionAchievements.find(a => a.id === "nutrition-balanced-10");
  const logWeekAchievement = nutritionAchievements.find(a => a.id === "nutrition-log-week");

  const handleAddFood = () => {
    router.push('/log-food');
  };

  const handleViewHistory = () => {
    router.push('/nutrition-history');
  };

  const handleViewNutritionInsights = () => {
    router.push('/nutrition-insights');
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  // Generate achievement progress message
  const getAchievementProgressMessage = () => {
    if (!gamificationEnabled) return null;
    
    if (proteinGoalAchievement && proteinGoalAchievement.progress > 0) {
      return `You've met your protein goal ${proteinGoalAchievement.progress} out of ${proteinGoalAchievement.target} days. Keep it up!`;
    }
    
    if (balancedMacrosAchievement && balancedMacrosAchievement.progress > 0) {
      return `You've maintained balanced macros for ${balancedMacrosAchievement.progress} out of ${balancedMacrosAchievement.target} days!`;
    }
    
    if (logWeekAchievement && logWeekAchievement.progress > 0) {
      return `You've logged your meals for ${logWeekAchievement.progress} out of ${logWeekAchievement.target} consecutive days!`;
    }
    
    return "Track your nutrition consistently to unlock achievements and earn points!";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'Nutrition',
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
          headerRight: () => (
            <TouchableOpacity onPress={handleViewHistory} style={styles.historyButton}>
              <Calendar size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Daily Nutrition</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        
        {/* Daily Macro Summary */}
        <MacroSummary 
          current={todayMacros} 
          goals={macroGoals || { calories: 0, protein: 0, carbs: 0, fat: 0 }} 
        />
        
        <View style={[styles.macroCard, { backgroundColor: colors.card }]}>
          <View style={styles.macroHeader}>
            <View style={styles.macroTitleContainer}>
              <Text style={[styles.macroTitle, { color: colors.white }]}>Macros</Text>
              <TouchableOpacity 
                onPress={() => setInfoModalVisible(true)}
                style={styles.infoButton}
                accessibilityLabel="Nutrition information"
                accessibilityHint="Opens a modal with information about how nutrition goals are calculated"
              >
                <Info size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleAddFood}>
              <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Food</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.macroContent}>
            <MacroProgress
              title="Calories"
              current={todayMacros.calories || 0}
              goal={macroGoals?.calories || 0}
              unit="kcal"
              percentage={caloriePercentage}
              color={colors.calorieColor}
            />
            
            <MacroProgress
              title="Protein"
              current={todayMacros.protein || 0}
              goal={macroGoals?.protein || 0}
              unit="g"
              percentage={proteinPercentage}
              color={colors.macroProtein}
              achievementId={proteinGoalAchievement?.id}
            />
            
            <MacroProgress
              title="Carbs"
              current={todayMacros.carbs || 0}
              goal={macroGoals?.carbs || 0}
              unit="g"
              percentage={carbsPercentage}
              color={colors.macroCarbs}
            />
            
            <MacroProgress
              title="Fat"
              current={todayMacros.fat || 0}
              goal={macroGoals?.fat || 0}
              unit="g"
              percentage={fatPercentage}
              color={colors.macroFat}
            />
          </View>
          
          {gamificationEnabled && (
            <View style={styles.achievementContainer}>
              <Text style={[styles.achievementText, { color: colors.white }]}>
                {getAchievementProgressMessage()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Food Analysis</Text>
            <TouchableOpacity onPress={() => router.push('/food-photos')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.analysisCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/capture-food')}
          >
            <View style={styles.analysisContent}>
              <UtensilsCrossed size={24} color={colors.primary} />
              <View style={styles.analysisTextContainer}>
                <Text style={[styles.analysisTitle, { color: colors.text }]}>Analyze Food with Camera</Text>
                <Text style={[styles.analysisDescription, { color: colors.textSecondary }]}>
                  Take a photo of your meal to get nutritional information
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.analysisCard, { backgroundColor: colors.card }]}
            onPress={handleViewNutritionInsights}
          >
            <View style={styles.analysisContent}>
              <BarChart size={24} color={colors.primary} />
              <View style={styles.analysisTextContainer}>
                <Text style={[styles.analysisTitle, { color: colors.text }]}>Nutrition Insights</Text>
                <Text style={[styles.analysisDescription, { color: colors.textSecondary }]}>
                  View trends and patterns in your nutrition data
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <MacroInfoModal 
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  historyButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  macroCard: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoButton: {
    marginLeft: 8,
    padding: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  macroContent: {
    gap: 16,
  },
  achievementContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  achievementText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  analysisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  analysisContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  analysisDescription: {
    fontSize: 14,
  },
});