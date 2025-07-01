import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Search as SearchIcon, X, ArrowLeft, Filter, SlidersHorizontal, Dumbbell } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useWorkoutStore } from "@/store/workoutStore";
import WorkoutCard from "@/components/WorkoutCard";
import { Exercise, Workout, BodyRegion, MuscleGroup, EquipmentType } from "@/types";
import ExerciseCard from "@/components/ExerciseCard";

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    workouts, 
    exercises,
    getBodyRegions,
    getMuscleGroups,
    getEquipmentTypes,
    getFilteredExercises
  } = useWorkoutStore();
  
  const [query, setQuery] = useState("");
  const [workoutResults, setWorkoutResults] = useState<Workout[]>([]);
  const [exerciseResults, setExerciseResults] = useState<Exercise[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "workouts" | "exercises">("all");
  const [filterBodyRegion, setFilterBodyRegion] = useState<BodyRegion | null>(null);
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<MuscleGroup | null>(null);
  const [filterEquipmentCategory, setFilterEquipmentCategory] = useState<string | null>(null);
  const [filterEquipment, setFilterEquipment] = useState<EquipmentType | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [bodyViewMode, setBodyViewMode] = useState<'front' | 'back'>('front');
  
  // Get filter options
  const bodyRegions = getBodyRegions();
  const muscleGroups = getMuscleGroups(filterBodyRegion || undefined);
  const equipmentTypes = getEquipmentTypes();
  const difficulties = ["beginner", "intermediate", "advanced"];
  
  // Equipment categories
  const EQUIPMENT_CATEGORIES = {
    'Free Weights': ['Barbell', 'Dumbbell', 'Kettlebell'],
    'Machines': ['Cable Machine', 'Machine', 'Leg Extension Machine', 'Leg Curl Machine', 'Lat Pulldown Machine', 'Leg Press Machine', 'Smith Machine'],
    'Bodyweight': ['Bodyweight', 'Pull-up Bar'],
    'Accessories': ['Bench', 'Stability Ball', 'Medicine Ball', 'TRX', 'Ab Wheel', 'Resistance Band', 'Rope Attachment'],
  };
  
  // Get filtered equipment types by selected category
  const getFilteredEquipmentTypes = () => {
    if (!filterEquipmentCategory) return equipmentTypes;
    
    const categoryEquipment = EQUIPMENT_CATEGORIES[filterEquipmentCategory as keyof typeof EQUIPMENT_CATEGORIES] || [];
    return equipmentTypes.filter(e => categoryEquipment.includes(e));
  };
  
  const filteredEquipmentTypes = getFilteredEquipmentTypes();
  
  useEffect(() => {
    if (query.trim().length > 0) {
      // For exercises, use the filtered exercises function
      const exerciseFilters = {
        bodyRegion: filterBodyRegion || undefined,
        muscleGroup: filterMuscleGroup || undefined,
        equipment: filterEquipment || undefined,
        difficulty: filterDifficulty as 'beginner' | 'intermediate' | 'advanced' || undefined,
        searchQuery: query,
      };
      
      const matchedExercises = filterType === "workouts" 
        ? [] 
        : getFilteredExercises(exerciseFilters);
      
      // For workouts, filter manually
      const lowerQuery = query.toLowerCase();
      const matchedWorkouts = filterType === "exercises" 
        ? [] 
        : workouts.filter(workout => 
            (filterDifficulty === null || workout.difficulty === filterDifficulty) &&
            (
              workout.name.toLowerCase().includes(lowerQuery) || 
              workout.description.toLowerCase().includes(lowerQuery) ||
              workout.category.toLowerCase().includes(lowerQuery) ||
              workout.exercises.some(ex => {
                const exercise = exercises.find(e => e.id === ex.id);
                return exercise && (
                  exercise.name.toLowerCase().includes(lowerQuery) ||
                  exercise.muscleGroups.some(mg => mg.toLowerCase().includes(lowerQuery))
                );
              })
            )
          );
      
      setWorkoutResults(matchedWorkouts);
      setExerciseResults(matchedExercises);
    } else {
      setWorkoutResults([]);
      setExerciseResults([]);
    }
  }, [query, filterType, filterBodyRegion, filterMuscleGroup, filterEquipment, filterDifficulty]);

  const clearSearch = () => {
    setQuery("");
    setWorkoutResults([]);
    setExerciseResults([]);
  };
  
  const clearFilters = () => {
    setFilterType("all");
    setFilterBodyRegion(null);
    setFilterMuscleGroup(null);
    setFilterEquipmentCategory(null);
    setFilterEquipment(null);
    setFilterDifficulty(null);
  };
  
  const applyFilters = () => {
    setShowFilterModal(false);
  };
  
  const toggleBodyViewMode = () => {
    setBodyViewMode(bodyViewMode === 'front' ? 'back' : 'front');
  };

  const handleGoBack = () => {
    router.back();
  };

  type SearchResultItem = 
    | { type: "workoutHeader" }
    | { type: "exerciseHeader" }
    | { type: "workout"; data: Workout }
    | { type: "exercise"; data: Exercise };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <SearchIcon size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search workouts, exercises, or muscle groups..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.background }]}
          onPress={() => setShowFilterModal(true)}
        >
          <SlidersHorizontal size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {query.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Search Workouts & Exercises</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Search by name, muscle group, or equipment type
            </Text>
          </View>
        ) : workoutResults.length === 0 && exerciseResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No results found</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Try searching for different keywords or adjusting your filters
            </Text>
          </View>
        ) : (
          <FlatList
            data={[
              ...(workoutResults.length > 0 ? [{ type: "workoutHeader" } as SearchResultItem] : []),
              ...workoutResults.map(item => ({ type: "workout", data: item } as SearchResultItem)),
              ...(exerciseResults.length > 0 ? [{ type: "exerciseHeader" } as SearchResultItem] : []),
              ...exerciseResults.map(item => ({ type: "exercise", data: item } as SearchResultItem)),
            ]}
            keyExtractor={(item, index) => {
              if (item.type === "workoutHeader") return "workoutHeader";
              if (item.type === "exerciseHeader") return "exerciseHeader";
              return item.type === "workout" ? `workout-${(item as {type: string, data: Workout}).data.id}` : 
                     item.type === "exercise" ? `exercise-${(item as {type: string, data: Exercise}).data.id}` : 
                     index.toString();
            }}
            renderItem={({ item }) => {
              if (item.type === "workoutHeader") {
                return (
                  <Text style={[styles.sectionHeader, { color: colors.text }]}>Workouts ({workoutResults.length})</Text>
                );
              }
              if (item.type === "exerciseHeader") {
                return (
                  <Text style={[styles.sectionHeader, { color: colors.text }]}>Exercises ({exerciseResults.length})</Text>
                );
              }
              if (item.type === "workout") {
                return <WorkoutCard workout={(item as {type: string, data: Workout}).data} />;
              }
              if (item.type === "exercise") {
                return <ExerciseCard exercise={(item as {type: string, data: Exercise}).data} />;
              }
              return null;
            }}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      {/* Filter Modal */}
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
          <Pressable style={[styles.modalContent, { backgroundColor: colors.background }]} onPress={e => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Results</Text>
              <TouchableOpacity 
                onPress={() => setShowFilterModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={[1]} // Dummy data to render content
              keyExtractor={() => "filters"}
              renderItem={() => (
                <View style={styles.modalBody}>
                  <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Type</Text>
                  <View style={styles.filterTypeContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.filterTypeButton,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        filterType === "all" && [styles.filterTypeButtonActive, { backgroundColor: colors.primary }]
                      ]}
                      onPress={() => setFilterType("all")}
                    >
                      <Text style={[
                        styles.filterTypeText,
                        { color: colors.text },
                        filterType === "all" && styles.filterTypeTextActive
                      ]}>
                        All
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.filterTypeButton,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        filterType === "workouts" && [styles.filterTypeButtonActive, { backgroundColor: colors.primary }]
                      ]}
                      onPress={() => setFilterType("workouts")}
                    >
                      <Text style={[
                        styles.filterTypeText,
                        { color: colors.text },
                        filterType === "workouts" && styles.filterTypeTextActive
                      ]}>
                        Workouts
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.filterTypeButton,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        filterType === "exercises" && [styles.filterTypeButtonActive, { backgroundColor: colors.primary }]
                      ]}
                      onPress={() => setFilterType("exercises")}
                    >
                      <Text style={[
                        styles.filterTypeText,
                        { color: colors.text },
                        filterType === "exercises" && styles.filterTypeTextActive
                      ]}>
                        Exercises
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {(filterType === "all" || filterType === "exercises") && (
                    <>
                      <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Body Region</Text>
                      <View style={styles.filterCategoryContainer}>
                        <TouchableOpacity 
                          style={[
                            styles.filterCategoryChip,
                            { backgroundColor: colors.card, borderColor: colors.border },
                            filterBodyRegion === null && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                          ]}
                          onPress={() => {
                            setFilterBodyRegion(null);
                            setFilterMuscleGroup(null);
                          }}
                        >
                          <Text style={[
                            styles.filterCategoryText,
                            { color: colors.text },
                            filterBodyRegion === null && styles.filterCategoryTextActive
                          ]}>
                            All
                          </Text>
                        </TouchableOpacity>
                        
                        {bodyRegions.map(region => (
                          <TouchableOpacity 
                            key={region}
                            style={[
                              styles.filterCategoryChip,
                              { backgroundColor: colors.card, borderColor: colors.border },
                              filterBodyRegion === region && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                            ]}
                            onPress={() => {
                              setFilterBodyRegion(region);
                              setFilterMuscleGroup(null);
                              setBodyViewMode('front');
                            }}
                          >
                            <Text style={[
                              styles.filterCategoryText,
                              { color: colors.text },
                              filterBodyRegion === region && styles.filterCategoryTextActive
                            ]}>
                              {region}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      {filterBodyRegion && (
                        <>
                          <View style={styles.viewToggleRow}>
                            <Text style={[styles.filterSectionTitle, { color: colors.text, flex: 1 }]}>
                              {filterBodyRegion} View
                            </Text>
                            <TouchableOpacity 
                              style={[styles.viewToggleButton, { backgroundColor: colors.primary }]}
                              onPress={toggleBodyViewMode}
                            >
                              <Text style={styles.viewToggleButtonText}>
                                {bodyViewMode === 'front' ? 'Switch to Back' : 'Switch to Front'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          
                          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Muscle Group</Text>
                          <View style={styles.filterCategoryContainer}>
                            <TouchableOpacity 
                              style={[
                                styles.filterCategoryChip,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                filterMuscleGroup === null && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                              ]}
                              onPress={() => setFilterMuscleGroup(null)}
                            >
                              <Text style={[
                                styles.filterCategoryText,
                                { color: colors.text },
                                filterMuscleGroup === null && styles.filterCategoryTextActive
                              ]}>
                                All
                              </Text>
                            </TouchableOpacity>
                            
                            {muscleGroups.map(group => (
                              <TouchableOpacity 
                                key={group}
                                style={[
                                  styles.filterCategoryChip,
                                  { backgroundColor: colors.card, borderColor: colors.border },
                                  filterMuscleGroup === group && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                                ]}
                                onPress={() => setFilterMuscleGroup(group)}
                              >
                                <Text style={[
                                  styles.filterCategoryText,
                                  { color: colors.text },
                                  filterMuscleGroup === group && styles.filterCategoryTextActive
                                ]}>
                                  {group}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </>
                      )}
                      
                      <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Equipment Type</Text>
                      <View style={styles.filterCategoryContainer}>
                        <TouchableOpacity 
                          style={[
                            styles.filterCategoryChip,
                            { backgroundColor: colors.card, borderColor: colors.border },
                            filterEquipmentCategory === null && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                          ]}
                          onPress={() => {
                            setFilterEquipmentCategory(null);
                            setFilterEquipment(null);
                          }}
                        >
                          <Text style={[
                            styles.filterCategoryText,
                            { color: colors.text },
                            filterEquipmentCategory === null && styles.filterCategoryTextActive
                          ]}>
                            All
                          </Text>
                        </TouchableOpacity>
                        
                        {Object.keys(EQUIPMENT_CATEGORIES).map(category => (
                          <TouchableOpacity 
                            key={category}
                            style={[
                              styles.filterCategoryChip,
                              { backgroundColor: colors.card, borderColor: colors.border },
                              filterEquipmentCategory === category && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                            ]}
                            onPress={() => {
                              setFilterEquipmentCategory(category);
                              setFilterEquipment(null);
                            }}
                          >
                            <Text style={[
                              styles.filterCategoryText,
                              { color: colors.text },
                              filterEquipmentCategory === category && styles.filterCategoryTextActive
                            ]}>
                              {category}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      {filterEquipmentCategory && (
                        <>
                          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Equipment</Text>
                          <View style={styles.filterCategoryContainer}>
                            <TouchableOpacity 
                              style={[
                                styles.filterCategoryChip,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                filterEquipment === null && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                              ]}
                              onPress={() => setFilterEquipment(null)}
                            >
                              <Text style={[
                                styles.filterCategoryText,
                                { color: colors.text },
                                filterEquipment === null && styles.filterCategoryTextActive
                              ]}>
                                All
                              </Text>
                            </TouchableOpacity>
                            
                            {filteredEquipmentTypes.map(equipment => (
                              <TouchableOpacity 
                                key={equipment}
                                style={[
                                  styles.filterCategoryChip,
                                  { backgroundColor: colors.card, borderColor: colors.border },
                                  filterEquipment === equipment && [styles.filterCategoryChipActive, { backgroundColor: colors.primary }]
                                ]}
                                onPress={() => setFilterEquipment(equipment)}
                              >
                                <Text style={[
                                  styles.filterCategoryText,
                                  { color: colors.text },
                                  filterEquipment === equipment && styles.filterCategoryTextActive
                                ]}>
                                  {equipment}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </>
                      )}
                    </>
                  )}
                  
                  <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Difficulty</Text>
                  <View style={styles.filterDifficultyContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.filterDifficultyChip,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        filterDifficulty === null && [styles.filterDifficultyChipActive, { backgroundColor: colors.primary }]
                      ]}
                      onPress={() => setFilterDifficulty(null)}
                    >
                      <Text style={[
                        styles.filterDifficultyText,
                        { color: colors.text },
                        filterDifficulty === null && styles.filterDifficultyTextActive
                      ]}>
                        All
                      </Text>
                    </TouchableOpacity>
                    
                    {difficulties.map(difficulty => (
                      <TouchableOpacity 
                        key={difficulty}
                        style={[
                          styles.filterDifficultyChip,
                          { backgroundColor: colors.card, borderColor: colors.border },
                          filterDifficulty === difficulty && [styles.filterDifficultyChipActive, { backgroundColor: colors.primary }]
                        ]}
                        onPress={() => setFilterDifficulty(difficulty)}
                      >
                        <Text style={[
                          styles.filterDifficultyText,
                          { color: colors.text },
                          filterDifficulty === difficulty && styles.filterDifficultyTextActive
                        ]}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              contentContainerStyle={styles.modalBodyScroll}
            />
            
            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <TouchableOpacity 
                style={[styles.clearFiltersButton, { borderColor: colors.border }]}
                onPress={clearFilters}
              >
                <Text style={[styles.clearFiltersText, { color: colors.text }]}>Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.applyFiltersButton, { backgroundColor: colors.primary }]}
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
  },
  resultsList: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalBodyScroll: {
    paddingBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  filterTypeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterTypeButtonActive: {
  },
  filterTypeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterTypeTextActive: {
    color: "#FFFFFF",
  },
  filterCategoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterCategoryChip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  filterCategoryChipActive: {
  },
  filterCategoryText: {
    fontSize: 14,
  },
  filterCategoryTextActive: {
    color: "#FFFFFF",
  },
  filterDifficultyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterDifficultyChip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  filterDifficultyChipActive: {
  },
  filterDifficultyText: {
    fontSize: 14,
  },
  filterDifficultyTextActive: {
    color: "#FFFFFF",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 16,
  },
  applyFiltersButton: {
    flex: 2,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  applyFiltersText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  viewToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewToggleButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});