import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  PanResponder,
  Dimensions,
  Platform,
  Vibration,
  Modal,
  Image
} from 'react-native';
import { ChevronDown, ChevronUp, Check, Clock, GripVertical, X, BarChart2, History, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { Exercise, ExerciseLog } from '@/types';
import { useWorkoutStore } from '@/store/workoutStore';

type DraggableExerciseCardProps = {
  exercise: Exercise;
  exerciseLog: ExerciseLog;
  index: number;
  isCompleted: boolean;
  areAllSetsCompleted: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDragStart: () => void;
  onDragEnd: (toIndex: number) => void;
  onMarkCompleted: () => void;
  onStartRest: () => void;
  totalExercises: number;
  children: React.ReactNode;
};

const CARD_HEIGHT = 80; // Height of collapsed card
const DRAG_THRESHOLD = 40; // Distance needed to trigger a reorder
const VIBRATION_COOLDOWN = 500; // milliseconds between vibrations

export default function DraggableExerciseCard({
  exercise,
  exerciseLog,
  index,
  isCompleted,
  areAllSetsCompleted,
  isExpanded,
  onToggleExpand,
  onDragStart,
  onDragEnd,
  onMarkCompleted,
  onStartRest,
  totalExercises,
  children,
}: DraggableExerciseCardProps) {
  const { colors } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dropZoneIndex, setDropZoneIndex] = useState<number | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const cardRef = useRef<View>(null);
  const cardPositionY = useRef(0);
  const initialTouchY = useRef(0);
  const lastReportedDropZone = useRef<number | null>(null);
  const lastVibrationTime = useRef(0);
  const cardHeight = useRef(CARD_HEIGHT);
  const allCardsPositions = useRef<number[]>([]);
  
  // State for records/history modal
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'records' | 'about'>('history');
  
  // Get workout data from store
  const { 
    getExercisePR, 
    getPreviousSetData,
    getRecentExerciseHistory
  } = useWorkoutStore();
  
  // Get personal record for this exercise
  const personalRecord = getExercisePR(exercise.id);
  
  // Get exercise history
  const exerciseHistory = getRecentExerciseHistory(exercise.id, 5);
  
  // Get screen dimensions
  const screenHeight = Dimensions.get('window').height;
  
  // Calculate possible drop positions
  const getDropIndex = (gestureY: number) => {
    // Calculate the absolute position on screen
    const absoluteY = cardPositionY.current + gestureY - initialTouchY.current;
    
    // Calculate which index this position corresponds to
    const targetIndex = Math.round(absoluteY / cardHeight.current);
    
    // Ensure the index is within bounds
    return Math.max(0, Math.min(totalExercises - 1, targetIndex));
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical movements that are significant
        return Math.abs(gestureState.dy) > 10;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical movements that are significant
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderGrant: (_, gestureState) => {
        // Store the initial touch position
        initialTouchY.current = gestureState.y0;
        
        // Measure the card's position and height on the screen
        cardRef.current?.measure((x, y, width, height, pageX, pageY) => {
          cardPositionY.current = pageY;
          // Update card height if it's different from our default
          if (height > 0) {
            cardHeight.current = height;
          }
        });
        
        // Start dragging
        setIsDragging(true);
        onDragStart();
        
        // Reset the last reported drop zone
        lastReportedDropZone.current = null;
        
        // Store the initial position
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: (_, gestureState) => {
        // Update the animated value
        Animated.event(
          [null, { dy: pan.y }],
          { useNativeDriver: false }
        )(_, gestureState);
        
        // Calculate potential drop index based on movement
        const movementY = gestureState.dy;
        const cardsMoved = Math.round(movementY / CARD_HEIGHT);
        const potentialDropIndex = Math.max(0, Math.min(totalExercises - 1, index + cardsMoved));
        
        // Only update and provide feedback if the drop zone has changed
        if (potentialDropIndex !== lastReportedDropZone.current && potentialDropIndex !== index) {
          setDropZoneIndex(potentialDropIndex);
          lastReportedDropZone.current = potentialDropIndex;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Reset the pan offset
        pan.flattenOffset();
        
        // Calculate the final drop index based on movement
        const movementY = gestureState.dy;
        const cardsMoved = Math.round(movementY / CARD_HEIGHT);
        const finalDropIndex = Math.max(0, Math.min(totalExercises - 1, index + cardsMoved));
        
        // Reset the position with animation
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5
        }).start(() => {
          setIsDragging(false);
          setDropZoneIndex(null);
          
          // Only call onDragEnd if we have a valid drop index and it's different from current
          if (finalDropIndex !== index && finalDropIndex >= 0 && finalDropIndex < totalExercises) {
            onDragEnd(finalDropIndex);
          }
        });
      }
    })
  ).current;
  
  // Calculate styles for the draggable card
  const cardStyle = {
    transform: [{ translateY: pan.y }],
    zIndex: isDragging ? 999 : 1,
    shadowOpacity: isDragging ? 0.3 : 0.1,
    shadowRadius: isDragging ? 10 : 2,
    elevation: isDragging ? 8 : 2,
  };
  
  // Handle exercise name press to show records/history modal
  const handleNamePress = () => {
    setShowRecordsModal(true);
  };
  
  // Close modal
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
  
  return (
    <Animated.View 
      ref={cardRef}
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        cardStyle
      ]}
    >
      {/* Drag handle - positioned at the top */}
      <View 
        style={styles.dragHandleContainer}
        {...panResponder.panHandlers}
      >
        <GripVertical size={20} color={colors.textSecondary} />
      </View>
      
      <TouchableOpacity 
        style={[
          styles.header,
          isCompleted && styles.completedHeader
        ]}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseInfo}>
          {/* Make only the exercise name clickable to show records/history */}
          <TouchableOpacity onPress={handleNamePress}>
            <Text 
              style={[
                styles.exerciseName, 
                { color: isCompleted ? colors.textSecondary : colors.text },
                isCompleted && styles.completedText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {exercise.name}
            </Text>
          </TouchableOpacity>
          
          <Text 
            style={[
              styles.exerciseDetail, 
              { color: colors.textSecondary },
              isCompleted && styles.completedText
            ]}
          >
            {exerciseLog.sets.length} sets • {Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.join(', ') : exercise.muscleGroups}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          {isCompleted ? (
            <View style={[styles.completedBadge, { backgroundColor: colors.secondary }]}>
              <Check size={16} color="#FFFFFF" />
            </View>
          ) : areAllSetsCompleted ? (
            <TouchableOpacity
              style={[styles.markCompletedButton, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}
              onPress={onMarkCompleted}
            >
              <Check size={16} color={colors.secondary} />
            </TouchableOpacity>
          ) : null}
          
          <TouchableOpacity style={styles.expandButton} onPress={onToggleExpand}>
            {isExpanded ? (
              <ChevronUp size={20} color={colors.textSecondary} />
            ) : (
              <ChevronDown size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          {children}
          
          {areAllSetsCompleted && !isCompleted && (
            <View style={styles.completionActions}>
              <TouchableOpacity
                style={[styles.completionButton, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}
                onPress={onMarkCompleted}
              >
                <Check size={16} color={colors.secondary} />
                <Text style={[styles.completionButtonText, { color: colors.secondary }]}>
                  Mark Completed
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.restButton, { backgroundColor: "rgba(255, 149, 0, 0.1)" }]}
                onPress={onStartRest}
              >
                <Clock size={16} color="#FF9500" />
                <Text style={[styles.restButtonText, { color: "#FF9500" }]}>
                  Rest
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {isDragging && (
        <View style={styles.dragIndicator}>
          <Text style={[styles.dragIndicatorText, { color: colors.primary }]}>
            Dragging...
          </Text>
        </View>
      )}
      
      {/* Records History Modal */}
      <Modal
        visible={showRecordsModal}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{exercise.name}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
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
              
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  activeTab === 'about' && [styles.activeTabButton, { borderBottomColor: colors.primary }]
                ]}
                onPress={() => setActiveTab('about')}
              >
                <Info size={16} color={activeTab === 'about' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.tabText, 
                    { color: activeTab === 'about' ? colors.primary : colors.textSecondary }
                  ]}
                >
                  About
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
              ) : activeTab === 'records' ? (
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
              ) : (
                <View style={styles.aboutTab}>
                  <Text style={[styles.aboutTitle, { color: colors.text }]}>
                    How to perform
                  </Text>
                  
                  <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
                    {exercise.description}
                  </Text>
                  
                  <View style={styles.aboutDetails}>
                    <View style={styles.aboutDetailItem}>
                      <Text style={[styles.aboutDetailTitle, { color: colors.text }]}>
                        Muscle Groups
                      </Text>
                      <View style={styles.aboutDetailTags}>
                        {(Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups : [exercise.muscleGroups]).map((group, idx) => (
                          <View key={idx} style={[styles.aboutDetailTag, { backgroundColor: "rgba(52, 152, 219, 0.1)" }]}>
                            <Text style={[styles.aboutDetailTagText, { color: "#3498db" }]}>
                              {typeof group === 'string' ? group : group.name || group}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.aboutDetailItem}>
                      <Text style={[styles.aboutDetailTitle, { color: colors.text }]}>
                        Equipment
                      </Text>
                      <View style={styles.aboutDetailTags}>
                        {(Array.isArray(exercise.equipment) ? exercise.equipment : [exercise.equipment]).map((item, idx) => (
                          <View key={idx} style={[styles.aboutDetailTag, { backgroundColor: "rgba(0, 0, 0, 0.05)" }]}>
                            <Text style={[styles.aboutDetailTagText, { color: colors.textSecondary }]}>
                              {typeof item === 'string' ? item : item.name || item}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.aboutDetailItem}>
                      <Text style={[styles.aboutDetailTitle, { color: colors.text }]}>
                        Difficulty
                      </Text>
                      <View style={[styles.aboutDifficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                        <Text style={styles.aboutDifficultyText}>
                          {exercise.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {exercise.imageUrl && (
                    <View style={styles.aboutImageContainer}>
                      <Text style={[styles.aboutImageTitle, { color: colors.text }]}>
                        Reference Image
                      </Text>
                      <View style={styles.aboutImage}>
                        <Image 
                          source={{ uri: exercise.imageUrl }} 
                          style={styles.aboutImageContent}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

// Helper function to get color based on difficulty
const getDifficultyColor = (difficulty: "beginner" | "intermediate" | "advanced") => {
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
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingLeft: 48, // Make room for the drag handle on the left
  },
  completedHeader: {
    opacity: 0.8,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  markCompletedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  completionActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  completionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  restButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  restButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  dragHandleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dragIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  dragIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
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
  
  // About tab styles
  aboutTab: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  aboutDetails: {
    marginBottom: 20,
  },
  aboutDetailItem: {
    marginBottom: 16,
  },
  aboutDetailTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  aboutDetailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  aboutDetailTag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  aboutDetailTagText: {
    fontSize: 14,
  },
  aboutDifficultyBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  aboutDifficultyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  aboutImageContainer: {
    marginTop: 8,
  },
  aboutImageTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  aboutImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  aboutImageContent: {
    width: '100%',
    height: '100%',
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