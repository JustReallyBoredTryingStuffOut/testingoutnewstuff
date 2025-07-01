import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Calendar, 
  Filter, 
  ChevronRight, 
  Coffee, 
  UtensilsCrossed, 
  Soup 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useMacroStore } from "@/store/macroStore";
import { MacroLog } from "@/types";
import Button from "@/components/Button";

export default function NutritionHistoryScreen() {
  const router = useRouter();
  const { macroLogs, deleteMacroLog } = useMacroStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  // Get unique meal types for filtering
  const mealTypes = Array.from(new Set(
    macroLogs
      .filter(log => log.mealType)
      .map(log => log.mealType)
  ));
  
  // Filter logs based on search query and selected filter
  const filteredLogs = macroLogs
    .filter(log => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (log.mealType && log.mealType.toLowerCase().includes(query)) ||
          (log.notes && log.notes.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter(log => {
      // Filter by meal type
      if (selectedFilter) {
        return log.mealType === selectedFilter;
      }
      return true;
    })
    // Sort by date (newest first)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group logs by date
  const groupedLogs: Record<string, MacroLog[]> = {};
  
  filteredLogs.forEach(log => {
    const date = new Date(log.date).toDateString();
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleDeleteLog = (logId: string) => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to delete this food log?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMacroLog(logId);
            // Force re-render by updating state
            setSearchQuery(searchQuery);
          }
        }
      ]
    );
  };
  
  const getMealTypeIcon = (mealType: string | undefined) => {
    switch (mealType) {
      case "breakfast":
        return <Coffee size={20} color={colors.primary} />;
      case "lunch":
        return <UtensilsCrossed size={20} color={colors.primary} />;
      case "dinner":
        return <UtensilsCrossed size={20} color={colors.primary} />;
      case "snack":
        return <Soup size={20} color={colors.primary} />;
      default:
        return <UtensilsCrossed size={20} color={colors.primary} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Nutrition History",
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
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity 
            style={[
              styles.filterChip,
              selectedFilter === null && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(null)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === null && styles.filterChipTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {mealTypes.map(type => (
            <TouchableOpacity 
              key={type}
              style={[
                styles.filterChip,
                selectedFilter === type && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(type)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === type && styles.filterChipTextActive
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.logsContainer}>
        {Object.keys(groupedLogs).length > 0 ? (
          Object.keys(groupedLogs).map(date => (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateSectionHeader}>
                <Calendar size={18} color={colors.primary} />
                <Text style={styles.dateSectionTitle}>{date}</Text>
              </View>
              
              {groupedLogs[date].map(log => (
                <TouchableOpacity 
                  key={log.id}
                  style={styles.logCard}
                  onPress={() => router.push(`/log-details/${log.id}`)}
                >
                  <View style={styles.logInfo}>
                    {log.mealType && getMealTypeIcon(log.mealType)}
                    <View style={styles.logTextInfo}>
                      <Text style={styles.logTitle}>
                        {log.mealType 
                          ? log.mealType.charAt(0).toUpperCase() + log.mealType.slice(1) 
                          : "Food Log"
                        }
                      </Text>
                      <Text style={styles.logTime}>
                        {log.mealTime || new Date(log.date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.logMacros}>
                    <Text style={styles.logCalories}>{log.calories} kcal</Text>
                    <View style={styles.logMacroDetails}>
                      <Text style={styles.logMacroText}>P: {log.protein}g</Text>
                      <Text style={styles.logMacroText}>C: {log.carbs}g</Text>
                      <Text style={styles.logMacroText}>F: {log.fat}g</Text>
                    </View>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      onPress={() => handleDeleteLog(log.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <ChevronRight size={20} color={colors.textLight} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No food logs found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters, or log a new meal
            </Text>
            <Button
              title="Log Food"
              onPress={() => router.push("/log-food")}
              style={styles.emptyButton}
            />
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
  backButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  filtersContainer: {
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  logsContainer: {
    flex: 1,
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  logTextInfo: {
    marginLeft: 12,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  logTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logMacros: {
    marginRight: 12,
    alignItems: "flex-end",
  },
  logCalories: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  logMacroDetails: {
    flexDirection: "row",
    gap: 8,
  },
  logMacroText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginRight: 8,
    padding: 4,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    width: 200,
  },
});