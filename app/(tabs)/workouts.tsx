import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Dimensions, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Search, Filter, Zap, Activity, Dumbbell, ChevronRight, Info, X, Plus } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useWorkoutStore } from "@/store/workoutStore";
import { useMacroStore } from "@/store/macroStore";
import WorkoutCard from "@/components/WorkoutCard";
import BodyRegionSelector from "@/components/BodyRegionSelector";
import RegionMuscleSelector from "@/components/RegionMuscleSelector";
import EquipmentTypeSelector from "@/components/EquipmentTypeSelector";
import { BodyRegion, MuscleGroup, EquipmentType, Exercise } from "@/types";
import { equipmentCategories } from "@/mocks/filterData";

export default function WorkoutsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    workouts, 
    getRecommendedWorkouts, 
    workoutRecommendationsEnabled,
    aiRecommendationsExplained,
    toggleWorkoutRecommendations,
    setAiRecommendationsExplained,
    getBodyRegions,
    getMuscleGroups,
    getEquipmentTypes,
    getFilteredExercises,
    exercises: workoutExercises
  } = useWorkoutStore();
  
  const { userProfile } = useMacroStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'workouts' | 'exercises'>('workouts');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(workoutExercises);
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);
  
  // Get recommended workouts based on user's fitness level and goals
  const recommendedWorkouts = getRecommendedWorkouts(5);
  const recommendedWorkoutIds = new Set(recommendedWorkouts.map(w => w.id));
  
  // Update filtered content when search query or filters change
  useEffect(() => {
    if (viewMode === 'exercises') {
      let filtered = workoutExercises;
      
      console.log('Total exercises loaded:', filtered.length);
      console.log('Selected region:', selectedRegion);
      console.log('Selected muscle:', selectedMuscle);
      console.log('Selected equipment category:', selectedEquipmentCategory);
      console.log('Selected equipment:', selectedEquipment);
      
      // Apply hierarchical filters
      if (selectedRegion) {
        filtered = filtered.filter(exercise => 
          exercise.muscleGroups.some(muscle => {
            const region = getMuscleRegionMapping(muscle.name);
            console.log('Exercise:', exercise.name, 'Muscle:', muscle.name, 'Region:', region, 'Selected:', selectedRegion);
            return region === selectedRegion;
          })
        );
        console.log('After region filter:', filtered.length);
      }
      
      if (selectedMuscle) {
        // Check if selectedMuscle is an equipment category
        const isEquipmentCategory = equipmentCategories.some(category => category.name === selectedMuscle);
        
        if (isEquipmentCategory) {
          // Filter by equipment category
          filtered = filtered.filter(exercise => 
            exercise.equipment.some(eq => 
              getEquipmentCategoryMapping(eq.name) === selectedMuscle
            )
          );
        } else {
          // Filter by muscle group - map UI muscle key to exercise muscle name
          const exerciseMuscleName = mapUIMuscleToExerciseMuscle(selectedMuscle);
          console.log('Looking for muscle:', exerciseMuscleName, 'Selected muscle key:', selectedMuscle);
          
          filtered = filtered.filter(exercise => {
            console.log('Checking exercise:', exercise.name, 'Muscle groups:', exercise.muscleGroups.map(m => m.name));
            const hasMuscle = exercise.muscleGroups.some(muscle => {
              const matches = muscle.name.toLowerCase() === exerciseMuscleName.toLowerCase();
              console.log('Muscle comparison:', muscle.name, 'vs', exerciseMuscleName, '=', matches);
              return matches;
            });
            if (hasMuscle) {
              console.log('Exercise with muscle', exerciseMuscleName, ':', exercise.name, 'muscle groups:', exercise.muscleGroups.map(m => m.name));
            }
            return hasMuscle;
          });
        }
        console.log('After muscle filter:', filtered.length);
        console.log('Filtered exercises:', filtered.map(e => e.name));
      }
      
      // Apply equipment category filter
      if (selectedEquipmentCategory) {
        filtered = filtered.filter(exercise => 
          exercise.equipment.some(eq => 
            getEquipmentCategoryMapping(eq.name) === selectedEquipmentCategory
          )
        );
        console.log('After equipment category filter:', filtered.length);
      }
      
      // Apply specific equipment filter
      if (selectedEquipment) {
        filtered = filtered.filter(exercise => 
          exercise.equipment.some(eq => 
            eq.name.toLowerCase() === selectedEquipment.toLowerCase()
          )
        );
        console.log('After specific equipment filter:', filtered.length);
      }
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(exercise => 
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.muscleGroups.some(muscle => 
            muscle.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          exercise.equipment.some(eq => 
            eq.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
      
      setFilteredExercises(filtered);
    } else {
      // Filter workouts based on search query and recommendations
      let filtered = workouts;
      
      if (searchQuery) {
        filtered = filtered.filter(workout => 
          workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workout.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (showRecommendedOnly) {
        filtered = filtered.filter(workout => recommendedWorkoutIds.has(workout.id));
      }
      
      setFilteredWorkouts(filtered);
    }
  }, [viewMode, selectedRegion, selectedMuscle, selectedEquipmentCategory, selectedEquipment, searchQuery, showRecommendedOnly, workouts, workoutExercises]);
  
  const handleRegionSelect = (regionKey: string) => {
    setSelectedRegion(selectedRegion === regionKey ? null : regionKey);
    setSelectedMuscle(null); // Reset muscle selection when region changes
  };
  
  const handleMuscleSelect = (muscleKey: string) => {
    setSelectedMuscle(selectedMuscle === muscleKey ? null : muscleKey);
  };
  
  const handleEquipmentCategorySelect = (category: string) => {
    setSelectedEquipmentCategory(selectedEquipmentCategory === category ? null : category);
    setSelectedEquipment(null); // Reset specific equipment when category changes
  };
  
  const handleEquipmentSelect = (equipment: string) => {
    setSelectedEquipment(selectedEquipment === equipment ? null : equipment);
  };
  
  const clearFilters = () => {
    setSelectedRegion(null);
    setSelectedMuscle(null);
    setSelectedEquipmentCategory(null);
    setSelectedEquipment(null);
  };
  
  const screenWidth = Dimensions.get('window').width;
  
  // Group filtered workouts by category
  const workoutsByCategory = filteredWorkouts.reduce((acc, workout) => {
    if (!acc[workout.category]) {
      acc[workout.category] = [];
    }
    acc[workout.category].push({
      ...workout,
      isRecommended: recommendedWorkoutIds.has(workout.id)
    });
    return acc;
  }, {} as Record<string, any[]>);
  
  // Get unique categories
  const categories = Object.keys(workoutsByCategory);
  console.log('Workout categories:', categories);
  
  // Helper functions for filtering
  const getMuscleRegionMapping = (muscleName: string): string => {
    if (!muscleName) return 'full_body';
    
    const upperBodyMuscles = ['chest', 'shoulders', 'biceps', 'triceps', 'forearms', 'back', 'lats', 'traps', 'deltoids'];
    const lowerBodyMuscles = ['quadriceps', 'hamstrings', 'glutes', 'calves', 'hip_flexors'];
    const coreMuscles = ['abs', 'obliques', 'lower_back'];
    
    if (upperBodyMuscles.includes(muscleName.toLowerCase())) return 'upper';
    if (lowerBodyMuscles.includes(muscleName.toLowerCase())) return 'lower';
    if (coreMuscles.includes(muscleName.toLowerCase())) return 'core';
    return 'full_body';
  };
  
  const mapUIMuscleToExerciseMuscle = (uiMuscleKey: string): string => {
    if (!uiMuscleKey) return '';
    
    const muscleMapping: { [key: string]: string } = {
      'shoulders': 'shoulders',
      'back': 'back',
      'chest': 'chest',
      'triceps': 'triceps',
      'biceps': 'biceps',
      'forearms': 'forearms',
      'neck': 'neck',
      'traps': 'traps',
      'quads': 'quadriceps',
      'hamstrings': 'hamstrings',
      'glutes': 'glutes',
      'calves': 'calves',
      'hipflexors': 'hip_flexors',
      'adductors': 'adductors',
      'abs': 'abs',
      'obliques': 'obliques',
      'lowerback': 'lower_back'
    };
    return muscleMapping[uiMuscleKey] || uiMuscleKey;
  };
  
  const getEquipmentCategoryMapping = (equipmentName: string): string => {
    if (!equipmentName) return '';
    
    const bodyweightEquipment = ['bodyweight'];
    const freeWeightEquipment = ['dumbbell', 'barbell', 'kettlebell'];
    const machineEquipment = [
      'smith_machine', 'leg_press_machine', 'chest_press_machine', 'shoulder_press_machine', 
      'lat_pulldown_machine', 'seated_row_machine', 'leg_extension_machine', 'leg_curl_machine', 
      'calf_raise_machine', 'incline_hammer_strength_press', 'fly_machine', 'pec_deck_machine',
      'reverse_fly_machine', 'ab_crunch_machine', 'back_extension_machine', 'hip_abductor_machine',
      'hip_adductor_machine'
    ];
    const cableEquipment = [
      'cable_machine', 'cable_crossover', 'cable_fly', 'cable_pulldown', 'cable_row', 
      'cable_curl', 'cable_tricep_pushdown', 'cable_shoulder_raise', 'cable_woodchop',
      'cable_rotation', 'cable_pull_through', 'cable_face_pull', 'cable_upright_row', 'cable_shrug'
    ];
    const accessoryEquipment = [
      'bench', 'pull_up_bar', 'medicine_ball', 'stability_ball', 'foam_roller', 'trx', 
      'battle_ropes', 'resistance_band', 'ab_wheel', 'dip_bars', 'preacher_curl_bench',
      'incline_bench', 'decline_bench', 'flat_bench'
    ];
    const cardioEquipment = ['treadmill', 'elliptical', 'stationary_bike', 'rowing_machine', 'stair_master', 'jumping_rope'];
    
    if (bodyweightEquipment.includes(equipmentName.toLowerCase())) return 'bodyweight';
    if (freeWeightEquipment.includes(equipmentName.toLowerCase())) return 'free_weights';
    if (machineEquipment.includes(equipmentName.toLowerCase())) return 'machines';
    if (cableEquipment.includes(equipmentName.toLowerCase())) return 'cables';
    if (cardioEquipment.includes(equipmentName.toLowerCase())) return 'cardio_equipment';
    return 'accessories';
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating Create Custom Workout/Exercise Button */}
      <View style={[styles.floatingButtonContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.floatingButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (viewMode === 'workouts') {
              router.push("/create-workout");
            } else {
              router.push("/create-custom-exercise");
            }
          }}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>
            {viewMode === 'workouts' ? 'Create Custom Workout' : 'Create Custom Exercise'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={viewMode === 'workouts' ? "Search workouts..." : "Search exercises..."}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.background }]}
          onPress={() => setViewMode(viewMode === 'workouts' ? 'exercises' : 'workouts')}
        >
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.viewToggle, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[
            styles.viewToggleButton, 
            viewMode === 'workouts' && [styles.activeViewToggleButton, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setViewMode('workouts')}
        >
          <Text style={[
            styles.viewToggleText,
            { color: colors.textSecondary },
            viewMode === 'workouts' && { color: colors.primary }
          ]}>
            Workouts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.viewToggleButton, 
            viewMode === 'exercises' && [styles.activeViewToggleButton, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setViewMode('exercises')}
        >
          <Text style={[
            styles.viewToggleText,
            { color: colors.textSecondary },
            viewMode === 'exercises' && { color: colors.primary }
          ]}>
            Exercises
          </Text>
        </TouchableOpacity>
      </View>
      
      {viewMode === 'workouts' ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {workoutRecommendationsEnabled && (
            <View style={[styles.recommendationsSection, { backgroundColor: colors.card }]}>
              <View style={styles.recommendationsHeader}>
                <Zap size={20} color={colors.primary} />
                <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                  AI Recommendations
                </Text>
                <Switch
                  value={showRecommendedOnly}
                  onValueChange={setShowRecommendedOnly}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={showRecommendedOnly ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text style={[styles.recommendationsDescription, { color: colors.textSecondary }]}>
                {showRecommendedOnly 
                  ? "Showing only workouts recommended for your fitness level and goals"
                  : "Toggle to see workouts tailored to your profile"
                }
              </Text>
            </View>
          )}
          
          <View style={[styles.cardioSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardioSectionTitle, { color: colors.text }]}>
              Cardio Activities
            </Text>
            <View style={styles.cardioButtonsContainer}>
              <TouchableOpacity 
                style={[styles.cardioButton, { backgroundColor: colors.background }]}
                onPress={() => router.push("/log-cardio")}
              >
                <View style={[styles.cardioButtonIcon, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
                  <Activity size={24} color={colors.primary} />
                </View>
                <View style={styles.cardioButtonContent}>
                  <Text style={[styles.cardioButtonTitle, { color: colors.text }]}>Log Cardio</Text>
                  <Text style={[styles.cardioButtonSubtitle, { color: colors.textSecondary }]}>
                    Walking, Running, Cycling
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.cardioButton, { backgroundColor: colors.background }]}
                onPress={() => router.push("/activity-log")}
              >
                <View style={[styles.cardioButtonIcon, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}>
                  <Activity size={24} color={colors.secondary} />
                </View>
                <View style={styles.cardioButtonContent}>
                  <Text style={[styles.cardioButtonTitle, { color: colors.text }]}>Other Activities</Text>
                  <Text style={[styles.cardioButtonSubtitle, { color: colors.textSecondary }]}>
                    Swimming, Hiking, Sports, Jumping Rope
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {categories.length > 0 ? (
            categories.map((category) => (
              <View key={category} style={styles.categorySection}>
                <Text style={[styles.categoryTitle, { color: colors.text }]}> 
                  {typeof category === 'string' ? category : JSON.stringify(category)}
                </Text>
                {workoutsByCategory[category].map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onPress={() => router.push(`/workout/${workout.id}`)}
                  />
                ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Dumbbell size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {searchQuery ? "No workouts found matching your search" : "No workouts available"}
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.exercisesContainer}>
          <BodyRegionSelector
            selectedRegion={selectedRegion}
            onSelectRegion={handleRegionSelect}
          />
          
          <RegionMuscleSelector
            selectedRegion={selectedRegion}
            selectedMuscle={selectedMuscle}
            onSelectMuscle={handleMuscleSelect}
          />
          
          <EquipmentTypeSelector
            selectedEquipmentCategory={selectedEquipmentCategory}
            selectedEquipment={selectedEquipment}
            onSelectEquipmentCategory={handleEquipmentCategorySelect}
            onSelectEquipment={handleEquipmentSelect}
          />
          
          <ScrollView style={styles.exercisesList} contentContainerStyle={styles.exercisesListContainer}>
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={[styles.exerciseCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push(`/exercise/${exercise.id}`)}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                    <Text style={[styles.exerciseDescription, { color: colors.textSecondary }]}>
                      {exercise.description}
                    </Text>
                    <View style={styles.exerciseTags}>
                      {exercise.muscleGroups.map((group) => (
                        <View
                          key={group.name}
                          style={[styles.exerciseTag, { backgroundColor: colors.primary + '20' }]}
                        >
                          <Text style={[styles.exerciseTagText, { color: colors.primary }]}>
                            {group.name ? group.name.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ') : 'Unknown'}
                          </Text>
                        </View>
                      ))}
                      {exercise.equipment.map((eq) => (
                        <View
                          key={eq.name}
                          style={[styles.exerciseTag, { backgroundColor: colors.secondary + '20' }]}
                        >
                          <Text style={[styles.exerciseTagText, { color: colors.secondary }]}>
                            {eq.name ? eq.name.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ') : 'Unknown'}
                          </Text>
                        </View>
                      ))}
                      {exercise.isCustom && (
                        <View
                          style={[styles.exerciseTag, { backgroundColor: colors.warning + '20' }]}
                        >
                          <Text style={[styles.exerciseTagText, { color: colors.warning }]}>
                            Custom
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Activity size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  {searchQuery ? "No exercises found matching your search" : "No exercises available"}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeViewToggleButton: {
    borderBottomWidth: 2,
  },
  viewToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  recommendationsSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  recommendationsDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  exercisesContainer: {
    flex: 1,
  },
  exercisesList: {
    flex: 1,
  },
  exercisesListContainer: {
    paddingBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
  cardioSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardioSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardioButtonsContainer: {
    gap: 12,
  },
  cardioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  cardioButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardioButtonContent: {
    flex: 1,
  },
  cardioButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardioButtonSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});