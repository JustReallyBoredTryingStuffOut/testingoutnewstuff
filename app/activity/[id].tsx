import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Clock, Trophy, Target, Zap, Droplets, Footprints, Calendar, Dumbbell, CheckCircle, Star, Edit3, FileText, Save } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useWorkoutStore } from '@/store/workoutStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { useHealthStore } from '@/store/healthStore';
import { exercises } from '@/mocks/exercises';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { workoutLogs } = useWorkoutStore();
  const { achievements, challenges, dailyQuests } = useGamificationStore();
  const { getDailyNote, addDailyNote, updateDailyNote } = useHealthStore();
  
  // Notes state
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Parse the date from the ID parameter
  const selectedDate = new Date(id as string);
  const isValidDate = !isNaN(selectedDate.getTime());

  // Load existing notes for this date
  useEffect(() => {
    if (isValidDate) {
      const existingNote = getDailyNote(selectedDate.toISOString());
      if (existingNote) {
        setNotes(existingNote.notes);
      }
    }
  }, [selectedDate, isValidDate, getDailyNote]);

  // Notes handling functions
  const handleNotesChange = (text: string) => {
    setNotes(text);
    setHasUnsavedChanges(true);
  };

  const saveNotes = () => {
    if (notes.trim()) {
      addDailyNote(selectedDate.toISOString(), notes.trim());
      Alert.alert('✅ Notes Saved', 'Your daily notes have been saved successfully.');
    } else {
      // If notes are empty, remove the note
      updateDailyNote(selectedDate.toISOString(), '');
      Alert.alert('📝 Notes Cleared', 'Your daily notes have been cleared.');
    }
    setHasUnsavedChanges(false);
    setIsEditingNotes(false);
  };

  const cancelEdit = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              // Reload original notes
              const existingNote = getDailyNote(selectedDate.toISOString());
              setNotes(existingNote?.notes || '');
              setHasUnsavedChanges(false);
              setIsEditingNotes(false);
            }
          }
        ]
      );
    } else {
      setIsEditingNotes(false);
    }
  };

  if (!isValidDate) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Invalid Date</Text>
        </View>
      </View>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get workouts for the selected date
  const workoutsForDate = workoutLogs.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate.toDateString() === selectedDate.toDateString();
  });

  // Get achievements for the selected date
  const achievementsForDate = achievements.filter(achievement => {
    if (!achievement.completed) return false;
    if (!achievement.completedDate) return false;
    const achievementDate = new Date(achievement.completedDate);
    return achievementDate.toDateString() === selectedDate.toDateString();
  });

  // Get completed challenges for the selected date
  const challengesForDate = challenges.filter(challenge => {
    if (!challenge.completed) return false;
    if (!challenge.completedDate) return false;
    const challengeDate = new Date(challenge.completedDate);
    return challengeDate.toDateString() === selectedDate.toDateString();
  });

  // Get completed daily quests for the selected date
  const questsForDate = dailyQuests.filter(quest => {
    if (!quest.completed) return false;
    if (!quest.completedDate) return false;
    const questDate = new Date(quest.completedDate);
    return questDate.toDateString() === selectedDate.toDateString();
  });

  // Get real health data for the selected date
  const { getWaterIntakeForDate, getStepsForDate } = useHealthStore();
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  
  const healthDataForDate = {
    waterIntake: getWaterIntakeForDate(selectedDateStr), // ml
    steps: getStepsForDate(selectedDateStr)?.steps || 0,
    calories: getStepsForDate(selectedDateStr)?.calories || 0,
  };

  const renderWorkoutSection = () => {
    if (workoutsForDate.length === 0) return null;

    return (
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Dumbbell size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Workouts Completed</Text>
        </View>

        {workoutsForDate.map((workout, index) => (
          <View key={index} style={[styles.workoutItem, { borderBottomColor: colors.border }]}>
            <View style={styles.workoutHeader}>
              <View style={styles.workoutTitleContainer}>
                <Text style={[styles.workoutName, { color: colors.text }]}>{workout.workoutId}</Text>
                <View style={styles.timeContainer}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                    {workout.startTime || 'Time not recorded'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                onPress={() => {
                  console.log('Navigating to workout log with ID:', workout.id);
                  router.push(`/workout-log/${workout.id}`);
                }}
              >
                <Edit3 size={16} color={colors.primary} />
                <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration:</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{workout.duration} min</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises:</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{workout.exercises.length}</Text>
              </View>
              {workout.rating && (
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating:</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>{workout.rating.rating}/5 ⭐</Text>
                </View>
              )}
            </View>

            <View style={styles.exercisesList}>
              <Text style={[styles.exercisesTitle, { color: colors.text }]}>Exercises:</Text>
              {workout.exercises.map((exerciseLog, idx) => {
                const exercise = exercises.find(e => e.id === exerciseLog.exerciseId);
                return (
                  <View key={idx} style={styles.exerciseItem}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>
                      {exercise?.name || 'Unknown Exercise'}
                    </Text>
                    <View style={styles.setsContainer}>
                      {exerciseLog.sets.map((set, setIdx) => (
                        <Text key={setIdx} style={[styles.setText, { color: colors.textSecondary }]}>
                          Set {setIdx + 1}: {set.weight}kg × {set.reps} reps
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderNotesSection = () => {
    return (
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <FileText size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Notes & Reflections</Text>
        </View>

        {!isEditingNotes ? (
          <View>
            {notes ? (
              <View style={[styles.notesDisplay, { backgroundColor: colors.backgroundLight, borderColor: colors.border }]}>
                <Text style={[styles.notesText, { color: colors.text }]}>{notes}</Text>
              </View>
            ) : (
              <View style={[styles.emptyNotesContainer, { backgroundColor: colors.backgroundLight, borderColor: colors.border }]}>
                <Text style={[styles.emptyNotesText, { color: colors.textSecondary }]}>
                  No notes for this day. Tap "Add Notes" to record your thoughts, reflections, or how you felt today.
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.editNotesButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsEditingNotes(true)}
            >
              <Edit3 size={16} color="white" />
              <Text style={styles.editNotesButtonText}>
                {notes ? 'Edit Notes' : 'Add Notes'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              style={[styles.notesInput, { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }]}
              value={notes}
              onChangeText={handleNotesChange}
              placeholder="Write your thoughts, reflections, or how you felt today..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <View style={styles.notesActions}>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: colors.backgroundLight, borderColor: colors.border }]}
                onPress={cancelEdit}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveButton, { 
                  backgroundColor: hasUnsavedChanges ? colors.primary : colors.textLight,
                }]}
                onPress={saveNotes}
                disabled={!hasUnsavedChanges}
              >
                <Save size={16} color="white" />
                <Text style={styles.saveButtonText}>Save Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderAchievementsSection = () => {
    if (achievementsForDate.length === 0) return null;

    return (
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Trophy size={20} color="#FFD700" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements Unlocked</Text>
        </View>

        {achievementsForDate.map((achievement, index) => (
          <View key={index} style={[styles.achievementItem, { borderBottomColor: colors.border }]}>
            <View style={styles.achievementHeader}>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>{achievement.title}</Text>
              <View style={styles.timeContainer}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {achievement.completedDate ? formatTime(achievement.completedDate) : 'Time unknown'}
                </Text>
              </View>
            </View>
            <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
              {achievement.description}
            </Text>
            <View style={styles.achievementReward}>
              <Star size={16} color="#FFD700" />
              <Text style={[styles.rewardText, { color: colors.primary }]}>
                +{achievement.pointsAwarded} XP
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderChallengesSection = () => {
    if (challengesForDate.length === 0) return null;

    return (
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#FF6B6B" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Challenges Completed</Text>
        </View>

        {challengesForDate.map((challenge, index) => (
          <View key={index} style={[styles.challengeItem, { borderBottomColor: colors.border }]}>
            <View style={styles.challengeHeader}>
              <Text style={[styles.challengeTitle, { color: colors.text }]}>{challenge.title}</Text>
              <View style={styles.timeContainer}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {challenge.completedDate ? formatTime(challenge.completedDate) : 'Time unknown'}
                </Text>
              </View>
            </View>
            <Text style={[styles.challengeDescription, { color: colors.textSecondary }]}>
              {challenge.description}
            </Text>
            <View style={styles.challengeProgress}>
              <CheckCircle size={16} color="#4CAF50" />
              <Text style={[styles.progressText, { color: colors.text }]}>
                {challenge.progress}/{challenge.target} {challenge.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderQuestsSection = () => {
    if (questsForDate.length === 0) return null;

    return (
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Zap size={20} color="#9C27B0" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Quests Completed</Text>
        </View>

        {questsForDate.map((quest, index) => (
          <View key={index} style={[styles.questItem, { borderBottomColor: colors.border }]}>
            <View style={styles.questHeader}>
              <Text style={[styles.questTitle, { color: colors.text }]}>{quest.title}</Text>
              <View style={styles.timeContainer}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {quest.completedDate ? formatTime(quest.completedDate) : 'Time unknown'}
                </Text>
              </View>
            </View>
            <Text style={[styles.questDescription, { color: colors.textSecondary }]}>
              {quest.description}
            </Text>
            <View style={styles.questReward}>
              <Star size={16} color="#9C27B0" />
              <Text style={[styles.rewardText, { color: colors.primary }]}>
                +{quest.pointsAwarded} XP
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderHealthSection = () => {
    return (
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health & Activity</Text>
        </View>

        <View style={styles.healthGrid}>
          <View style={styles.healthItem}>
            <View style={[styles.healthIcon, { backgroundColor: '#2196F3' + '20' }]}>
              <Droplets size={24} color="#2196F3" />
            </View>
            <Text style={[styles.healthLabel, { color: colors.textSecondary }]}>Water Intake</Text>
            <Text style={[styles.healthValue, { color: colors.text }]}>
              {healthDataForDate.waterIntake}ml
            </Text>
          </View>

          <View style={styles.healthItem}>
            <View style={[styles.healthIcon, { backgroundColor: '#4CAF50' + '20' }]}>
              <Footprints size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.healthLabel, { color: colors.textSecondary }]}>Steps</Text>
            <Text style={[styles.healthValue, { color: colors.text }]}>
              {healthDataForDate.steps.toLocaleString()}
            </Text>
          </View>

          <View style={styles.healthItem}>
            <View style={[styles.healthIcon, { backgroundColor: '#FF9800' + '20' }]}>
              <Zap size={24} color="#FF9800" />
            </View>
            <Text style={[styles.healthLabel, { color: colors.textSecondary }]}>Calories</Text>
            <Text style={[styles.healthValue, { color: colors.text }]}>
              {healthDataForDate.calories}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const hasAnyActivity = workoutsForDate.length > 0 || 
                       achievementsForDate.length > 0 || 
                       challengesForDate.length > 0 || 
                       questsForDate.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Activity Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.dateHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.dateTitle, { color: colors.text }]}>
            {formatDate(selectedDate)}
          </Text>
          <Text style={[styles.dateSubtitle, { color: colors.textSecondary }]}>
            {hasAnyActivity ? 'Activity Summary' : 'No activities recorded'}
          </Text>
        </View>

        {renderHealthSection()}
        {renderWorkoutSection()}
        {renderNotesSection()}
        {renderAchievementsSection()}
        {renderChallengesSection()}
        {renderQuestsSection()}

        {!hasAnyActivity && (
          <View style={styles.emptyState}>
            <Calendar size={48} color={colors.textLight} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Activities</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No workouts, achievements, challenges, or quests were completed on this date.
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateSubtitle: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  workoutItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  workoutTitleContainer: {
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  workoutStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  exercisesList: {
    marginTop: 8,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  exerciseItem: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  setsContainer: {
    marginLeft: 12,
  },
  setText: {
    fontSize: 14,
    marginBottom: 2,
  },
  achievementItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  achievementReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  challengeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  questItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  questDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  questReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  healthIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Notes section styles
  notesDisplay: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 80,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 22,
  },
  emptyNotesContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  emptyNotesText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  editNotesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  editNotesButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    lineHeight: 22,
    minHeight: 120,
    marginBottom: 12,
  },
  notesActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 