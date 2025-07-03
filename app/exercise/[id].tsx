import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, Modal } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Play, ArrowLeft, Info, X, BarChart2, History } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useWorkoutStore } from "@/store/workoutStore";
import * as WebBrowser from "expo-web-browser";
import Button from "@/components/Button";
import VideoEmbed from "@/components/VideoEmbed";
import ExerciseAnimation from "@/components/ExerciseAnimation";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { exercises, activeWorkout } = useWorkoutStore();
  const [showVideo, setShowVideo] = useState(false);
  const [showCopyrightInfo, setShowCopyrightInfo] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'records' | 'about'>('about');
  
  const exercise = exercises.find(e => e.id === id);
  
  // Get personal record and exercise history for modal
  const { getExercisePR, getRecentExerciseHistory } = useWorkoutStore();
  const personalRecord = exercise ? getExercisePR(exercise.id) : null;
  const exerciseHistory = exercise ? getRecentExerciseHistory(exercise.id, 5) : [];
  
  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }
  
  const handlePlayVideo = async () => {
    if (exercise.videoUrl) {
      if (Platform.OS === "web") {
        setShowVideo(true);
      } else {
        await WebBrowser.openBrowserAsync(exercise.videoUrl);
      }
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const toggleCopyrightInfo = () => {
    setShowCopyrightInfo(!showCopyrightInfo);
  };
  
  const handleExerciseNamePress = () => {
    setShowModal(true);
    setActiveTab('about');
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Check if this is the face pull exercise
  const isFacePull = exercise.id === "ex215";
  
  // Helper function to get badge color
  const getBadgeColor = (difficulty: "beginner" | "intermediate" | "advanced" | undefined) => {
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
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: exercise.name,
          headerBackTitle: "Exercises",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={handleExerciseNamePress} style={styles.titleTouchable}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Info size={18} color={colors.primary} style={styles.infoIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.tags}>
          {exercise.muscleGroups.map((muscle, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{muscle.name}</Text>
            </View>
          ))}
        </View>
        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 8 }}>
          <Button
            title="Create Custom Workout"
            onPress={() => router.push('/create-workout')}
            style={{ flex: 1 }}
          />
          <Button
            title="Start Workout"
            onPress={() => router.push('/add-workout-schedule')}
            style={{ flex: 1 }}
          />
          {activeWorkout && (
            <Button
              title="Add to Current Workout"
              onPress={() => {/* TODO: Implement add to current workout logic */}}
              style={{ flex: 1 }}
              variant="secondary"
            />
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {exercise.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
      
      {exercise.tips && exercise.tips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Success</Text>
          {exercise.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipText}>• {tip}</Text>
            </View>
          ))}
        </View>
      )}
      
      {exercise.variations && exercise.variations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variations</Text>
          {exercise.variations.map((variation, index) => (
            <View key={index} style={styles.variationItem}>
              <Text style={styles.variationText}>• {variation}</Text>
            </View>
          ))}
        </View>
      )}
      
      {showVideo && Platform.OS === "web" && exercise.videoUrl && (
        <View style={styles.videoContainer}>
          <View style={styles.videoHeaderContainer}>
            <Text style={styles.sectionTitle}>Tutorial Video</Text>
            <TouchableOpacity 
              onPress={toggleCopyrightInfo}
              style={styles.infoButton}
            >
              <Info size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {showCopyrightInfo && (
            <View style={styles.copyrightInfoContainer}>
              <Text style={styles.copyrightInfoText}>
                The video content displayed here is the property of its respective creators and is provided through YouTube/TikTok's embedding services. We do not claim ownership of any third-party video content. For more information, please see our Privacy Policy.
              </Text>
            </View>
          )}
          
          <VideoEmbed url={exercise.videoUrl} height={240} />
        </View>
      )}
      
      {Platform.OS !== "web" && exercise.videoUrl && (
        <View style={styles.videoButtonContainer}>
          <TouchableOpacity 
            style={styles.watchVideoButton}
            onPress={handlePlayVideo}
          >
            <Play size={20} color={colors.primary} />
            <Text style={styles.watchVideoText}>Watch Tutorial Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={toggleCopyrightInfo}
            style={styles.infoButtonSmall}
          >
            <Info size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {showCopyrightInfo && (
            <View style={styles.copyrightInfoContainer}>
              <Text style={styles.copyrightInfoText}>
                The video content accessible through this link is the property of its respective creators and is hosted on YouTube/TikTok. We do not claim ownership of any third-party video content. For more information, please see our Privacy Policy.
              </Text>
            </View>
          )}
        </View>
      )}
      
      {/* Show animation for face pull exercise */}
      {isFacePull && (
        <ExerciseAnimation exerciseId={exercise.id} />
      )}
      
      <Button
        title="Back to Exercises"
        onPress={handleGoBack}
        variant="outline"
        style={styles.backToExercisesButton}
      />
      
      {/* Exercise Modal */}
      <Modal
        visible={showModal}
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
            
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
              {activeTab === 'history' ? (
                <View style={styles.historyTab}>
                  {exerciseHistory.length > 0 ? (
                    exerciseHistory.map((historyItem, index) => (
                      <View key={index} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.historyItemHeader}>
                          <View style={styles.historyItemDate}>
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
                        {exercise.muscleGroups.map(group => (
                          <View key={group.name} style={[styles.aboutDetailTag, { backgroundColor: "rgba(52, 152, 219, 0.1)" }]}>
                            <Text style={[styles.aboutDetailTagText, { color: "#3498db" }]}>{group.name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.aboutDetailItem}>
                      <Text style={[styles.aboutDetailTitle, { color: colors.text }]}>
                        Difficulty
                      </Text>
                      <View style={[styles.aboutDifficultyBadge, { backgroundColor: getBadgeColor(exercise.difficulty) }]}>
                        <Text style={styles.aboutDifficultyText}>{exercise.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginRight: 8,
  },
  infoIcon: {
    marginLeft: 4,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  videoContainer: {
    marginBottom: 24,
  },
  videoHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  videoButtonContainer: {
    marginBottom: 24,
  },
  watchVideoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.highlight,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  watchVideoText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 24,
  },
  backToExercisesButton: {
    marginBottom: 16,
  },
  infoButton: {
    padding: 8,
  },
  infoButtonSmall: {
    alignSelf: "center",
    padding: 8,
  },
  copyrightInfoContainer: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  copyrightInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  variationItem: {
    marginBottom: 8,
  },
  variationText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginRight: 6,
  },
  tabContent: {
    flex: 1,
  },
  historyTab: {
    padding: 16,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  historyItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  historyItemDate: {
    width: 100,
  },
  historyItemDateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  historyItemWorkout: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  historyItemDetails: {
    flexDirection: "row",
    marginTop: 8,
  },
  historyItemDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  historyItemDetailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  historyItemDetailValue: {
    fontSize: 16,
    color: colors.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  recordsTab: {
    padding: 16,
  },
  recordCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
  },
  recordCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  recordCardValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  recordCardDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recordsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordGridItem: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  recordGridItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  recordGridItemValue: {
    fontSize: 16,
    color: colors.text,
  },
  aboutTab: {
    padding: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  aboutDetails: {
    marginTop: 16,
  },
  aboutDetailItem: {
    marginBottom: 16,
  },
  aboutDetailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  aboutDetailTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  aboutDetailTag: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  aboutDetailTagText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutDifficultyBadge: {
    padding: 4,
    borderRadius: 8,
  },
  aboutDifficultyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});