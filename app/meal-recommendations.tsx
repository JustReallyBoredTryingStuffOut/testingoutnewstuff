import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  UtensilsCrossed, 
  ChevronRight,
  X,
  SlidersHorizontal,
  Check
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { mealRecommendations } from "@/mocks/meals";
import { MealRecommendation } from "@/types";
import { useMacroStore } from "@/store/macroStore";

export default function MealRecommendationsScreen() {
  const router = useRouter();
  const { macroGoals, calculateDailyMacros } = useMacroStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [prepTimeFilter, setPrepTimeFilter] = useState<number | null>(null);
  const [proteinFilter, setProteinFilter] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Get today's date in ISO format
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate today's macros
  const todayMacros = calculateDailyMacros(today) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  // Calculate remaining calories
  const remainingCalories = (macroGoals?.calories || 0) - (todayMacros?.calories || 0);
  
  // Filter meals based on search query and filters
  const filteredMeals = mealRecommendations
    .filter(meal => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          meal.name.toLowerCase().includes(query) ||
          meal.ingredients.some((ingredient: string) => ingredient.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter(meal => {
      // Filter by dietary restrictions
      if (dietaryFilters.length > 0) {
        return dietaryFilters.every(filter => 
          meal.dietaryRestrictions.includes(filter)
        );
      }
      return true;
    })
    .filter(meal => {
      // Filter by prep time
      if (prepTimeFilter !== null) {
        return meal.prepTime + meal.cookTime <= prepTimeFilter;
      }
      return true;
    })
    .filter(meal => {
      // Filter by protein content
      if (proteinFilter !== null) {
        return meal.protein >= proteinFilter;
      }
      return true;
    })
    .filter(meal => {
      // Filter by remaining calories
      return meal.calories <= remainingCalories;
    });
  
  const toggleDietaryFilter = (filter: string) => {
    if (dietaryFilters.includes(filter)) {
      setDietaryFilters(dietaryFilters.filter(f => f !== filter));
    } else {
      setDietaryFilters([...dietaryFilters, filter]);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const clearAllFilters = () => {
    setDietaryFilters([]);
    setPrepTimeFilter(null);
    setProteinFilter(null);
    setShowFilterModal(false);
  };
  
  const applyFilters = () => {
    setShowFilterModal(false);
  };
  
  // Simulate loading more recommendations
  const loadMoreRecommendations = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  // Load more recommendations when the component mounts
  useEffect(() => {
    loadMoreRecommendations();
  }, []);
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Meal Recommendations",
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
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search meals or ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Quick Filters</Text>
          <TouchableOpacity 
            style={styles.advancedFilterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <SlidersHorizontal size={16} color={colors.primary} />
            <Text style={styles.advancedFilterText}>Advanced</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity 
            style={[
              styles.filterChip,
              dietaryFilters.includes("vegan") && styles.filterChipActive
            ]}
            onPress={() => toggleDietaryFilter("vegan")}
          >
            <Text style={[
              styles.filterChipText,
              dietaryFilters.includes("vegan") && styles.filterChipTextActive
            ]}>
              Vegan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip,
              dietaryFilters.includes("gluten-free") && styles.filterChipActive
            ]}
            onPress={() => toggleDietaryFilter("gluten-free")}
          >
            <Text style={[
              styles.filterChipText,
              dietaryFilters.includes("gluten-free") && styles.filterChipTextActive
            ]}>
              Gluten-Free
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip,
              dietaryFilters.includes("lactose-free") && styles.filterChipActive
            ]}
            onPress={() => toggleDietaryFilter("lactose-free")}
          >
            <Text style={[
              styles.filterChipText,
              dietaryFilters.includes("lactose-free") && styles.filterChipTextActive
            ]}>
              Lactose-Free
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip,
              prepTimeFilter === 30 && styles.filterChipActive
            ]}
            onPress={() => setPrepTimeFilter(prepTimeFilter === 30 ? null : 30)}
          >
            <Text style={[
              styles.filterChipText,
              prepTimeFilter === 30 && styles.filterChipTextActive
            ]}>
              Quick (≤30 min)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip,
              proteinFilter === 20 && styles.filterChipActive
            ]}
            onPress={() => setProteinFilter(proteinFilter === 20 ? null : 20)}
          >
            <Text style={[
              styles.filterChipText,
              proteinFilter === 20 && styles.filterChipTextActive
            ]}>
              High Protein (≥20g)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={styles.calorieInfoContainer}>
        <Text style={styles.calorieInfoText}>
          Showing meals with {remainingCalories > 0 ? `≤${remainingCalories}` : "low"} calories
        </Text>
      </View>
      
      <ScrollView style={styles.mealsContainer}>
        {filteredMeals.length > 0 ? (
          filteredMeals.map(meal => (
            <TouchableOpacity 
              key={meal.id}
              style={styles.mealCard}
              onPress={() => router.push(`/meal/${meal.id}`)}
            >
              <Image 
                source={{ uri: meal.imageUrl }} 
                style={styles.mealImage} 
              />
              
              <View style={styles.mealContent}>
                <Text style={styles.mealName}>{meal.name}</Text>
                
                <View style={styles.mealMacros}>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                  <View style={styles.macroDetails}>
                    <Text style={styles.macroText}>P: {meal.protein}g</Text>
                    <Text style={styles.macroText}>C: {meal.carbs}g</Text>
                    <Text style={styles.macroText}>F: {meal.fat}g</Text>
                  </View>
                </View>
                
                <View style={styles.mealDetails}>
                  <View style={styles.mealDetailItem}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={styles.mealDetailText}>
                      {meal.prepTime + meal.cookTime} min
                    </Text>
                  </View>
                  
                  {meal.dietaryRestrictions.length > 0 && (
                    <View style={styles.dietaryTags}>
                      {meal.dietaryRestrictions.map((restriction: string) => (
                        <View key={restriction} style={styles.dietaryTag}>
                          <Text style={styles.dietaryTagText}>
                            {restriction}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <UtensilsCrossed size={40} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No matching meals</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or search query
            </Text>
          </View>
        )}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading more recommendations...</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Advanced Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity 
                onPress={() => setShowFilterModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.filterSectionTitle}>Dietary Restrictions</Text>
              <View style={styles.dietaryFilterGrid}>
                {["vegan", "vegetarian", "gluten-free", "lactose-free", "nut-free", "keto", "paleo", "low-carb"].map(filter => (
                  <TouchableOpacity 
                    key={filter}
                    style={[
                      styles.dietaryFilterChip,
                      dietaryFilters.includes(filter) && styles.dietaryFilterChipActive
                    ]}
                    onPress={() => toggleDietaryFilter(filter)}
                  >
                    <Text style={[
                      styles.dietaryFilterChipText,
                      dietaryFilters.includes(filter) && styles.dietaryFilterChipTextActive
                    ]}>
                      {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                    {dietaryFilters.includes(filter) && (
                      <Check size={16} color="#FFFFFF" style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterSectionTitle}>Preparation Time</Text>
              <View style={styles.timeFilterContainer}>
                {[15, 30, 45, 60].map(time => (
                  <TouchableOpacity 
                    key={time}
                    style={[
                      styles.timeFilterChip,
                      prepTimeFilter === time && styles.timeFilterChipActive
                    ]}
                    onPress={() => setPrepTimeFilter(prepTimeFilter === time ? null : time)}
                  >
                    <Text style={[
                      styles.timeFilterChipText,
                      prepTimeFilter === time && styles.timeFilterChipTextActive
                    ]}>
                      ≤{time} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterSectionTitle}>Protein Content</Text>
              <View style={styles.proteinFilterContainer}>
                {[10, 20, 30, 40].map(protein => (
                  <TouchableOpacity 
                    key={protein}
                    style={[
                      styles.proteinFilterChip,
                      proteinFilter === protein && styles.proteinFilterChipActive
                    ]}
                    onPress={() => setProteinFilter(proteinFilter === protein ? null : protein)}
                  >
                    <Text style={[
                      styles.proteinFilterChipText,
                      proteinFilter === protein && styles.proteinFilterChipTextActive
                    ]}>
                      ≥{protein}g
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  advancedFilterButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  advancedFilterText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
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
  calorieInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.highlight,
  },
  calorieInfoText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  mealsContainer: {
    flex: 1,
    padding: 16,
  },
  mealCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealImage: {
    width: 100,
    height: "100%",
  },
  mealContent: {
    flex: 1,
    padding: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  mealMacros: {
    marginBottom: 8,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  macroDetails: {
    flexDirection: "row",
    gap: 8,
  },
  macroText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mealDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  mealDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  mealDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dietaryTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dietaryTag: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  dietaryTagText: {
    fontSize: 12,
    color: colors.primary,
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: "70%",
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  dietaryFilterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  dietaryFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    width: "48%",
  },
  dietaryFilterChipActive: {
    backgroundColor: colors.primary,
  },
  dietaryFilterChipText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  dietaryFilterChipTextActive: {
    color: "#FFFFFF",
  },
  checkIcon: {
    marginLeft: 4,
  },
  timeFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  timeFilterChip: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  timeFilterChipActive: {
    backgroundColor: colors.primary,
  },
  timeFilterChipText: {
    fontSize: 14,
    color: colors.text,
  },
  timeFilterChipTextActive: {
    color: "#FFFFFF",
  },
  proteinFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  proteinFilterChip: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  proteinFilterChipActive: {
    backgroundColor: colors.primary,
  },
  proteinFilterChipText: {
    fontSize: 14,
    color: colors.text,
  },
  proteinFilterChipTextActive: {
    color: "#FFFFFF",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 16,
    color: colors.text,
  },
  applyFiltersButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  applyFiltersText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});