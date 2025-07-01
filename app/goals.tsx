import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAiStore, Goal } from "@/store/aiStore";

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, deleteGoal } = useAiStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<"all" | "weekly" | "monthly">("all");
  
  const filteredGoals = selectedTimeframe === "all" 
    ? goals 
    : goals.filter(goal => goal.timeframe === selectedTimeframe);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteGoal(goalId),
          style: "destructive"
        }
      ]
    );
  };
  
  const renderGoalItem = ({ item }: { item: Goal }) => {
    const progressPercentage = item.progress || 0;
    
    return (
      <View style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalText}>{item.text}</Text>
          <TouchableOpacity 
            onPress={() => handleDeleteGoal(item.id)}
            style={styles.deleteButton}
            accessibilityLabel="Delete goal"
          >
            <Trash2 size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.goalDetails}>
          <Text style={styles.goalCategory}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)} • 
            {item.timeframe === "weekly" ? " Weekly" : " Monthly"}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` },
                  item.completed ? styles.completedProgress : null
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{progressPercentage}%</Text>
          </View>
          
          <Text style={styles.progressMessage}>
            {useAiStore.getState().getGoalProgressMessage(item)}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "My Goals",
          headerShown: true,
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
            <TouchableOpacity 
              onPress={() => router.push("/add-goal")}
              style={styles.addButton}
              accessibilityLabel="Add new goal"
            >
              <Plus size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            selectedTimeframe === "all" && styles.activeFilter
          ]}
          onPress={() => setSelectedTimeframe("all")}
        >
          <Text 
            style={[
              styles.filterText, 
              selectedTimeframe === "all" && styles.activeFilterText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            selectedTimeframe === "weekly" && styles.activeFilter
          ]}
          onPress={() => setSelectedTimeframe("weekly")}
        >
          <Text 
            style={[
              styles.filterText, 
              selectedTimeframe === "weekly" && styles.activeFilterText
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            selectedTimeframe === "monthly" && styles.activeFilter
          ]}
          onPress={() => setSelectedTimeframe("monthly")}
        >
          <Text 
            style={[
              styles.filterText, 
              selectedTimeframe === "monthly" && styles.activeFilterText
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredGoals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No goals found</Text>
          <TouchableOpacity 
            style={styles.addGoalButton}
            onPress={() => router.push("/add-goal")}
          >
            <Text style={styles.addGoalButtonText}>Add a Goal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredGoals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  addButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: colors.primaryLight,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.primary,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  goalItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  goalText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  goalDetails: {
    marginTop: 12,
  },
  goalCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  completedProgress: {
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    width: 40,
    textAlign: "right",
  },
  progressMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  addGoalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addGoalButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});