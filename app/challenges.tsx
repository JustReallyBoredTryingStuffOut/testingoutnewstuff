import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  FlatList
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGamificationStore, Challenge, AchievementCategory } from '@/store/gamificationStore';
import { Stack, useRouter } from 'expo-router';
import ChallengeCard from '@/components/ChallengeCard';
import Button from '@/components/Button';
import { Award, X, Check, Calendar, Clock, Target, ArrowLeft, Lock, Filter, Search } from 'lucide-react-native';
import { APP_NAME } from '@/app/_layout';
import { TextInput } from 'react-native';
import ChallengeCelebrationModal from '@/components/ChallengeCelebrationModal';

export default function ChallengesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { 
    challenges, 
    startChallenge,
    completeChallenge,
    updateChallengeProgress,
    initializeAchievements,
    gamificationEnabled,
    toggleGamification,
    showChallengeCelebration,
    celebrationChallenge,
    clearChallengeCelebration
  } = useGamificationStore();
  
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize achievements when screen loads
  useEffect(() => {
    if (gamificationEnabled) {
      initializeAchievements();
    }
  }, [gamificationEnabled]);
  
  // Filter challenges by status and filters
  const filterChallenges = (challengeList: Challenge[]) => {
    return challengeList.filter(challenge => {
      // Filter by category
      const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
      
      // Filter by difficulty
      const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
      
      // Filter by search query
      const searchMatch = 
        searchQuery === '' || 
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && difficultyMatch && searchMatch;
    });
  };
  
  const activeChallenge = filterChallenges(
    challenges.filter(c => !c.completed && new Date(c.endDate) > new Date())
  );
  const completedChallenges = filterChallenges(
    challenges.filter(c => c.completed)
  );
  const expiredChallenges = filterChallenges(
    challenges.filter(c => !c.completed && new Date(c.endDate) <= new Date())
  );
  
  // Available challenges (not started yet)
  const availableChallenges = [
    {
      id: "challenge-weekly-workout",
      title: "Weekly Workout Challenge",
      description: "Complete 5 workouts this week",
      category: "workout",
      target: 5,
      points: 150,
      reward: "Cheat Day Reward",
      difficulty: "medium"
    },
    {
      id: "challenge-steps-master",
      title: "Step Master Challenge",
      description: "Reach 70,000 steps in one week",
      category: "steps",
      target: 70000,
      points: 200,
      reward: "Custom Workout Plan",
      difficulty: "medium"
    },
    {
      id: "challenge-nutrition-week",
      title: "Nutrition Week",
      description: "Log all meals for 7 consecutive days",
      category: "nutrition",
      target: 7,
      points: 150,
      reward: "50 bonus points",
      difficulty: "easy"
    },
    {
      id: "challenge-water-week",
      title: "Hydration Week",
      description: "Drink 3L of water daily for 7 days",
      category: "nutrition",
      target: 7,
      points: 150,
      reward: "50 bonus points",
      difficulty: "medium"
    },
    {
      id: "challenge-weight-tracking",
      title: "Weight Tracking",
      description: "Track your weight for 14 consecutive days",
      category: "weight",
      target: 14,
      points: 150,
      reward: "50 bonus points",
      difficulty: "easy"
    },
    {
      id: "challenge-workout-variety",
      title: "Workout Variety",
      description: "Complete 5 different types of workouts in two weeks",
      category: "workout",
      target: 5,
      points: 200,
      reward: "70 bonus points",
      difficulty: "medium"
    },
    {
      id: "challenge-hiit-week",
      title: "HIIT Week",
      description: "Complete 4 high-intensity workouts in a week",
      category: "workout",
      target: 4,
      points: 200,
      reward: "70 bonus points",
      difficulty: "hard"
    },
    {
      id: "challenge-step-streak",
      title: "Step Streak",
      description: "Walk at least 10,000 steps for 7 consecutive days",
      category: "steps",
      target: 7,
      points: 200,
      reward: "70 bonus points",
      difficulty: "hard"
    }
  ];
  
  // Filter available challenges
  const filteredAvailableChallenges = availableChallenges.filter(challenge => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
    
    // Filter by difficulty
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    
    // Filter by search query
    const searchMatch = 
      searchQuery === '' || 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && difficultyMatch && searchMatch;
  });
  
  // Handle challenge press
  const handleChallengePress = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
    setShowModal(false);
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  // Start a new challenge
  const handleStartChallenge = (challenge: any) => {
    const newChallenge: Challenge = {
      id: `${challenge.id}-${Date.now()}`,
      title: challenge.title,
      description: challenge.description,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      target: challenge.target,
      progress: 0,
      completed: false,
      category: challenge.category as AchievementCategory,
      points: challenge.points,
      reward: challenge.reward,
      difficulty: challenge.difficulty as "easy" | "medium" | "hard" | undefined
    };
    startChallenge(newChallenge);
  };
  
  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };
  
  // Get category icon
  const getCategoryIcon = (category: AchievementCategory | 'all') => {
    switch (category) {
      case 'workout':
        return <Award size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'nutrition':
        return <Award size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'steps':
        return <Clock size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'weight':
        return <Target size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'streak':
        return <Target size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'special':
        return <Award size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'all':
        return <Filter size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      default:
        return <Award size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
    }
  };
  
  // If gamification is disabled, show a message
  if (!gamificationEnabled) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{ 
            title: "Challenges",
            headerTitleStyle: { color: colors.text },
            headerStyle: { backgroundColor: colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        
        <View style={styles.disabledContainer}>
          <View style={styles.disabledIconContainer}>
            <Lock size={60} color={colors.textSecondary} />
          </View>
          <Text style={[styles.disabledTitle, { color: colors.text }]}>
            Challenges are Disabled
          </Text>
          <Text style={[styles.disabledMessage, { color: colors.textSecondary }]}>
            {APP_NAME}'s challenge system is currently disabled. Enable gamification in your profile settings to participate in fitness challenges, earn rewards, and track your progress.
          </Text>
          <Button
            title="Enable Gamification"
            onPress={() => toggleGamification(true)}
            style={styles.enableButton}
          />
          <Button
            title="Back to Profile"
            onPress={handleGoBack}
            variant="outline"
            style={styles.backButton2}
          />
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Challenges",
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
              <Filter size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search challenges..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {showFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: colors.card }]}>
          <View style={styles.filterHeader}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={[styles.resetText, { color: colors.primary }]}>Reset</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilters}
          >
            {(['all', 'workout', 'nutrition', 'steps', 'weight', 'streak', 'special'] as Array<AchievementCategory | 'all'>).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryFilter,
                  { 
                    backgroundColor: selectedCategory === category 
                      ? `${colors.primary}20` 
                      : colors.card,
                    borderColor: selectedCategory === category 
                      ? colors.primary 
                      : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)}
                <Text 
                  style={[
                    styles.categoryText,
                    { 
                      color: selectedCategory === category 
                        ? colors.primary 
                        : colors.textSecondary
                    }
                  ]}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Difficulty</Text>
          <View style={styles.difficultyFilters}>
            {(['all', 'easy', 'medium', 'hard'] as Array<'all' | 'easy' | 'medium' | 'hard'>).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyFilter,
                  { 
                    backgroundColor: selectedDifficulty === difficulty 
                      ? `${colors.primary}20` 
                      : colors.card,
                    borderColor: selectedDifficulty === difficulty 
                      ? colors.primary 
                      : colors.border
                  }
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text 
                  style={[
                    styles.difficultyText,
                    { 
                      color: selectedDifficulty === difficulty 
                        ? colors.primary 
                        : colors.textSecondary
                    }
                  ]}
                >
                  {difficulty === 'all' ? 'All' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Button
            title="Apply Filters"
            onPress={toggleFilters}
            style={styles.applyButton}
          />
        </View>
      )}
      
      <ScrollView contentContainerStyle={styles.content}>
        {activeChallenge.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Active Challenges ({activeChallenge.length})
            </Text>
            
            {activeChallenge.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onPress={() => handleChallengePress(challenge)}
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Challenges ({filteredAvailableChallenges.length})
          </Text>
          
          {filteredAvailableChallenges.length === 0 ? (
            <View style={[styles.emptyStateContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No available challenges match your filters. Try adjusting your search or filters.
              </Text>
            </View>
          ) : (
            filteredAvailableChallenges.map((challenge) => (
              <View key={challenge.id} style={[styles.challengePreview, { backgroundColor: colors.card }]}>
                <View style={styles.challengePreviewHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                    <Award size={24} color={colors.primary} />
                  </View>
                  <View style={styles.challengePreviewInfo}>
                    <Text style={[styles.challengePreviewTitle, { color: colors.text }]}>
                      {challenge.title}
                    </Text>
                    <Text style={[styles.challengePreviewDescription, { color: colors.textSecondary }]}>
                      {challenge.description}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.challengeMetaInfo}>
                  <View style={[styles.difficultyBadge, { 
                    backgroundColor: 
                      challenge.difficulty === 'easy' ? `${colors.success}20` :
                      challenge.difficulty === 'medium' ? `${colors.warning}20` :
                      `${colors.error}20`
                  }]}>
                    <Text style={[styles.difficultyBadgeText, { 
                      color: 
                        challenge.difficulty === 'easy' ? colors.success :
                        challenge.difficulty === 'medium' ? colors.warning :
                        colors.error
                    }]}>
                      {challenge.difficulty?.charAt(0).toUpperCase() + challenge.difficulty?.slice(1)}
                    </Text>
                  </View>
                  
                  <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}20` }]}>
                    <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                      {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.challengePreviewRewards}>
                  <View style={[styles.rewardBadge, { backgroundColor: `${colors.secondary}20` }]}>
                    <Text style={[styles.rewardText, { color: colors.secondary }]}>
                      Reward: {challenge.reward}
                    </Text>
                  </View>
                  
                  <Text style={[styles.pointsText, { color: colors.primary }]}>
                    +{challenge.points} XP
                  </Text>
                </View>
                
                <Button
                  title="Start Challenge"
                  onPress={() => handleStartChallenge(challenge)}
                  style={styles.startButton}
                />
              </View>
            ))
          )}
        </View>
        
        {completedChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Completed Challenges ({completedChallenges.length})
            </Text>
            
            {completedChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onPress={() => handleChallengePress(challenge)}
              />
            ))}
          </View>
        )}
        
        {expiredChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Expired Challenges ({expiredChallenges.length})
            </Text>
            
            {expiredChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onPress={() => handleChallengePress(challenge)}
              />
            ))}
          </View>
        )}
        
        <Button
          title="Back"
          onPress={handleGoBack}
          variant="outline"
          style={styles.backButton2}
        />
      </ScrollView>
      
      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowModal(false)}
          >
            <Pressable style={[styles.modalContainer, { backgroundColor: colors.card }]} onPress={e => e.stopPropagation()}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedChallenge.title}
              </Text>
              
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                {selectedChallenge.description}
              </Text>
              
              <View style={styles.challengeMetaInfo}>
                {selectedChallenge.difficulty && (
                  <View style={[styles.difficultyBadge, { 
                    backgroundColor: 
                      selectedChallenge.difficulty === 'easy' ? `${colors.success}20` :
                      selectedChallenge.difficulty === 'medium' ? `${colors.warning}20` :
                      `${colors.error}20`
                  }]}>
                    <Text style={[styles.difficultyBadgeText, { 
                      color: 
                        selectedChallenge.difficulty === 'easy' ? colors.success :
                        selectedChallenge.difficulty === 'medium' ? colors.warning :
                        colors.error
                    }]}>
                      {selectedChallenge.difficulty.charAt(0).toUpperCase() + selectedChallenge.difficulty.slice(1)}
                    </Text>
                  </View>
                )}
                
                <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}20` }]}>
                  <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                    {selectedChallenge.category.charAt(0).toUpperCase() + selectedChallenge.category.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.challengeDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={20} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {new Date(selectedChallenge.startDate).toLocaleDateString()} - {new Date(selectedChallenge.endDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Target size={20} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Progress: {selectedChallenge.progress} / {selectedChallenge.target}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Award size={20} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Reward: {selectedChallenge.points} XP
                    {selectedChallenge.reward ? ` + ${selectedChallenge.reward}` : ''}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${Math.min(100, Math.floor((selectedChallenge.progress / selectedChallenge.target) * 100))}%`,
                      backgroundColor: selectedChallenge.completed ? colors.secondary : colors.primary
                    }
                  ]} 
                />
              </View>
              
              {!selectedChallenge.completed && new Date(selectedChallenge.endDate) > new Date() && (
                <View style={styles.modalActions}>
                  <Button
                    title="Update Progress"
                    onPress={() => {
                      // For demo purposes, increment progress by 1
                      updateChallengeProgress(
                        selectedChallenge.id, 
                        selectedChallenge.progress + 1
                      );
                      setShowModal(false);
                    }}
                    style={styles.updateButton}
                  />
                  
                  <Button
                    title="Mark as Complete"
                    onPress={() => handleCompleteChallenge(selectedChallenge.id)}
                    variant="outline"
                    style={styles.completeButton}
                  />
                </View>
              )}
              
              {selectedChallenge.completed && (
                <View style={[styles.completedBanner, { backgroundColor: `${colors.secondary}20` }]}>
                  <Check size={20} color={colors.secondary} />
                  <Text style={[styles.completedText, { color: colors.secondary }]}>
                    Challenge Completed!
                  </Text>
                </View>
              )}
              
              {!selectedChallenge.completed && new Date(selectedChallenge.endDate) <= new Date() && (
                <View style={[styles.expiredBanner, { backgroundColor: `${colors.error}20` }]}>
                  <Clock size={20} color={colors.error} />
                  <Text style={[styles.expiredText, { color: colors.error }]}>
                    Challenge Expired
                  </Text>
                </View>
              )}
              
              <Button
                title="Close"
                onPress={() => setShowModal(false)}
                variant="outline"
                style={styles.closeModalButton}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
      
      {/* Challenge Celebration Modal */}
      {celebrationChallenge && (
        <ChallengeCelebrationModal
          visible={showChallengeCelebration}
          onClose={clearChallengeCelebration}
          challenge={celebrationChallenge}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  backButton: {
    marginRight: 16,
  },
  filterButton: {
    marginLeft: 16,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 4,
  },
  filtersContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 0,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  categoryFilters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  difficultyFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  difficultyFilter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  challengePreview: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  challengePreviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengePreviewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  challengePreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengePreviewDescription: {
    fontSize: 14,
  },
  challengeMetaInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  challengePreviewRewards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  challengeDetails: {
    width: '100%',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  modalActions: {
    width: '100%',
    marginBottom: 16,
  },
  updateButton: {
    marginBottom: 8,
  },
  completeButton: {
    marginBottom: 8,
  },
  closeModalButton: {
    minWidth: 120,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  expiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  expiredText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton2: {
    marginBottom: 24,
  },
  // Disabled state styles
  disabledContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  disabledTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  disabledMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  enableButton: {
    width: '100%',
    marginBottom: 16,
  },
  emptyStateContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});