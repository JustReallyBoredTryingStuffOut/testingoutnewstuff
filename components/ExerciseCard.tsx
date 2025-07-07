import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Dumbbell, ChevronRight, Clock, X, BarChart2, History, Info } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { Exercise } from "@/types";
import { useWorkoutStore } from "@/store/workoutStore";

type ExerciseCardProps = {
  exercise: Exercise;
  onPress?: () => void;
  compact?: boolean;
};

export default function ExerciseCard({ exercise, onPress, compact = false }: ExerciseCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'records' | 'about'>('history');
  
  // Get workout data from store
  const { 
    workoutLogs, 
    getExercisePR, 
    getPreviousSetData,
    getRecentExerciseHistory
  } = useWorkoutStore();
  
  // Get personal record for this exercise
  const personalRecord = getExercisePR(exercise.id);
  
  // Get previous set data
  const previousSetData = getPreviousSetData(exercise.id);
  
  // Get exercise history
  const exerciseHistory = getRecentExerciseHistory(exercise.id, 5);
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/exercise/${exercise.id}`);
    }
  };
  
  const handleNamePress = () => {
    setShowRecordsModal(true);
  };
  
  const closeModal = () => {
    setShowRecordsModal(false);
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate predicted 1RM using Epley formula
  const calculatePredicted1RM = (weight: number, reps: number) => {
    return Math.round(weight * (1 + reps/30));
  };
  
  if (compact) {
    return (
      <View 
        style={[styles.compactContainer, { backgroundColor: colors.card, borderColor: colors.border }]} 
      >
        <View style={styles.compactContent}>
          <TouchableOpacity onPress={handleNamePress}>
            <Text style={[styles.compactTitle, { color: colors.text }]} numberOfLines={1}>{exercise.name}</Text>
          </TouchableOpacity>
          <View style={styles.compactTags}>
            {(exercise.muscleGroups || []).slice(0, 1).map(group => (
              <View key={typeof group === 'string' ? group : group.name} style={[styles.compactTag, { backgroundColor: "rgba(52, 152, 219, 0.1)" }]}> 
                <Text style={[styles.compactTagText, { color: "#3498db" }]}>{typeof group === 'string' ? group : group.name}</Text>
              </View>
            ))}
            {(exercise.equipment || []).length > 0 && (
              <View style={[styles.compactEquipment, { backgroundColor: "rgba(0, 0, 0, 0.05)" }]}> 
                <Dumbbell size={10} color={colors.textSecondary} />
                <Text style={[styles.compactEquipmentText, { color: colors.textSecondary }]}> 
                  {typeof exercise.equipment[0] === 'string' ? exercise.equipment[0] : exercise.equipment[0].name}
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={handlePress}>
          <ChevronRight size={16} color={colors.textLight} />
        </TouchableOpacity>
        {/* Records History Modal */}
        <RecordsHistoryModal 
          visible={showRecordsModal}
          onClose={closeModal}
          exercise={exercise}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          personalRecord={personalRecord}
          exerciseHistory={exerciseHistory}
        />
      </View>
    );
  }

  return (
    <View 
      style={[styles.container, { backgroundColor: colors.card }]} 
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleNamePress} style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{exercise.name}</Text>
          </TouchableOpacity>
          <View style={[styles.badge, { backgroundColor: getBadgeColor(exercise.difficulty) }]}> 
            <Text style={styles.badgeText}>{exercise.difficulty}</Text>
          </View>
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {exercise.description}
        </Text>
        <View style={styles.tags}>
          {(exercise.muscleGroups || []).map(group => (
            <View key={typeof group === 'string' ? group : group.name} style={[styles.tag, { backgroundColor: "rgba(52, 152, 219, 0.1)" }]}> 
              <Text style={[styles.tagText, { color: "#3498db" }]}>{typeof group === 'string' ? group : group.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.equipment}>
          {(exercise.equipment || []).map(item => (
            <View key={typeof item === 'string' ? item : item.name} style={[styles.equipmentItem, { backgroundColor: "rgba(0, 0, 0, 0.05)" }]}> 
              <Dumbbell size={12} color={colors.textSecondary} />
              <Text style={[styles.equipmentText, { color: colors.textSecondary }]}>{typeof item === 'string' ? item : item.name}</Text>
            </View>
          ))}
        </View>
      </View>
      {exercise.imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: exercise.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
      <TouchableOpacity style={styles.arrow} onPress={handlePress}>
        <ChevronRight size={20} color={colors.textLight} />
      </TouchableOpacity>
      {/* Records History Modal */}
      <RecordsHistoryModal 
        visible={showRecordsModal}
        onClose={closeModal}
        exercise={exercise}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        personalRecord={personalRecord}
        exerciseHistory={exerciseHistory}
      />
    </View>
  );
}

// Records History Modal Component
function RecordsHistoryModal({ 
  visible, 
  onClose, 
  exercise, 
  activeTab, 
  setActiveTab,
  personalRecord,
  exerciseHistory
}: { 
  visible: boolean; 
  onClose: () => void; 
  exercise: Exercise;
  activeTab: 'history' | 'records' | 'about';
  setActiveTab: (tab: 'history' | 'records' | 'about') => void;
  personalRecord: any;
  exerciseHistory: any[];
}) {
  const { colors } = useTheme();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{exercise.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'history' && [styles.activeTabButton, { borderBottomColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('history')}
            >
              <History size={16} color={activeTab === 'history' ? colors.primary : colors.textSecondary} />
              <Text 
                style={[
                  styles.tabText, 
                  { color: activeTab === 'history' ? colors.primary : colors.textSecondary }
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'records' && [styles.activeTabButton, { borderBottomColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('records')}
            >
              <BarChart2 size={16} color={activeTab === 'records' ? colors.primary : colors.textSecondary} />
              <Text 
                style={[
                  styles.tabText, 
                  { color: activeTab === 'records' ? colors.primary : colors.textSecondary }
                ]}
              >
                Records
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabContent}>
            {activeTab === 'history' ? (
              <View style={styles.historyTab}>
                {exerciseHistory.length > 0 ? (
                  exerciseHistory.map((historyItem, index) => (
                    <View key={index} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                      <View style={styles.historyItemHeader}>
                        <View style={styles.historyItemDate}>
                          <Clock size={14} color={colors.textSecondary} />
                          <Text style={[styles.historyItemDateText, { color: colors.textSecondary }]}>
                            {new Date(historyItem.date).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={[styles.historyItemWorkout, { color: colors.textSecondary }]}>
                          {historyItem.workoutName}
                        </Text>
                      </View>
                      
                      <View style={styles.historyItemDetails}>
                        <View style={styles.historyItemDetail}>
                          <Text style={[styles.historyItemDetailLabel, { color: colors.textSecondary }]}>Sets</Text>
                          <Text style={[styles.historyItemDetailValue, { color: colors.text }]}>
                            {historyItem.sets.length}
                          </Text>
                        </View>
                        
                        <View style={styles.historyItemDetail}>
                          <Text style={[styles.historyItemDetailLabel, { color: colors.textSecondary }]}>Weight</Text>
                          <Text style={[styles.historyItemDetailValue, { color: colors.text }]}>
                            {historyItem.maxWeight} kg
                          </Text>
                        </View>
                        
                        <View style={styles.historyItemDetail}>
                          <Text style={[styles.historyItemDetailLabel, { color: colors.textSecondary }]}>Reps</Text>
                          <Text style={[styles.historyItemDetailValue, { color: colors.text }]}>
                            {historyItem.maxReps}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                      No history found for this exercise
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.recordsTab}>
                {personalRecord ? (
                  <>
                    <View style={[styles.recordCard, { backgroundColor: colors.background }]}>
                      <Text style={[styles.recordCardTitle, { color: colors.textSecondary }]}>
                        Estimated 1RM
                      </Text>
                      <Text style={[styles.recordCardValue, { color: colors.text }]}>
                        {Math.round(personalRecord.estimatedOneRepMax)} kg
                      </Text>
                      <Text style={[styles.recordCardDate, { color: colors.textSecondary }]}>
                        Achieved on {new Date(personalRecord.date).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    <View style={styles.recordsGrid}>
                      <View style={[styles.recordGridItem, { backgroundColor: colors.background }]}>
                        <Text style={[styles.recordGridItemTitle, { color: colors.textSecondary }]}>
                          Max Weight
                        </Text>
                        <Text style={[styles.recordGridItemValue, { color: colors.text }]}>
                          {personalRecord.weight} kg
                        </Text>
                      </View>
                      
                      <View style={[styles.recordGridItem, { backgroundColor: colors.background }]}>
                        <Text style={[styles.recordGridItemTitle, { color: colors.textSecondary }]}>
                          Max Reps
                        </Text>
                        <Text style={[styles.recordGridItemValue, { color: colors.text }]}>
                          {personalRecord.reps}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={[styles.bestPerformanceCard, { backgroundColor: colors.background }]}>
                      <View style={styles.bestPerformanceHeader}>
                        <Text style={[styles.bestPerformanceTitle, { color: colors.textSecondary }]}>
                          Best Performance
                        </Text>
                        <Text style={[styles.bestPerformanceDate, { color: colors.textSecondary }]}>
                          {new Date(personalRecord.date).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      <View style={styles.bestPerformanceDetails}>
                        <View style={styles.bestPerformanceDetail}>
                          <Text style={[styles.bestPerformanceDetailValue, { color: colors.text }]}>
                            {personalRecord.weight} × {personalRecord.reps}
                          </Text>
                          <Text style={[styles.bestPerformanceDetailLabel, { color: colors.textSecondary }]}>
                            Weight × Reps
                          </Text>
                        </View>
                        
                        <View style={styles.bestPerformanceDetail}>
                          <Text style={[styles.bestPerformanceDetailValue, { color: colors.text }]}>
                            {Math.round(personalRecord.estimatedOneRepMax)} kg
                          </Text>
                          <Text style={[styles.bestPerformanceDetailLabel, { color: colors.textSecondary }]}>
                            Predicted
                          </Text>
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                      No records found for this exercise
                    </Text>
                    <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                      Complete a workout with this exercise to set your first record
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getBadgeColor = (difficulty: "beginner" | "intermediate" | "advanced") => {
  switch (difficulty) {
    case "beginner":
      return "#4CD964";
    case "intermediate":
      return "#FFCC00";
    case "advanced":
      return "#FF3B30";
    default:
      return "#5E5CE6";
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
  },
  equipment: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  equipmentText: {
    fontSize: 12,
    marginLeft: 4,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginLeft: 12,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  arrow: {
    justifyContent: "center",
  },
  
  // Compact styles
  compactContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  compactTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  compactTag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  compactTagText: {
    fontSize: 12,
  },
  compactEquipment: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  compactEquipmentText: {
    fontSize: 12,
    marginLeft: 4,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
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
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  tabContent: {
    flex: 1,
  },
  
  // History tab styles
  historyTab: {
    flex: 1,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyItemDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemDateText: {
    fontSize: 14,
    marginLeft: 4,
  },
  historyItemWorkout: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  historyItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItemDetail: {
    alignItems: 'center',
    flex: 1,
  },
  historyItemDetailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  historyItemDetailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Records tab styles
  recordsTab: {
    flex: 1,
  },
  recordCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  recordCardTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  recordCardValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  recordCardDate: {
    fontSize: 12,
  },
  recordsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recordGridItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  recordGridItemTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  recordGridItemValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  bestPerformanceCard: {
    padding: 16,
    borderRadius: 12,
  },
  bestPerformanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bestPerformanceTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  bestPerformanceDate: {
    fontSize: 12,
  },
  bestPerformanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bestPerformanceDetail: {
    alignItems: 'center',
    flex: 1,
  },
  bestPerformanceDetailValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  bestPerformanceDetailLabel: {
    fontSize: 12,
  },
  
  // Empty state styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});