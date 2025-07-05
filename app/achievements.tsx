import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Image,
  TextInput
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGamificationStore, Achievement, AchievementCategory } from '@/store/gamificationStore';
import { Stack, useRouter } from 'expo-router';
import AchievementBadge from '@/components/AchievementBadge';
import AchievementModal from '@/components/AchievementModal';
import LevelProgress from '@/components/LevelProgress';
import { Award, Zap, Clock, Weight, Target, Star, ArrowLeft, Lock, Search, Filter } from 'lucide-react-native';
import Button from '@/components/Button';
import { APP_NAME } from '@/app/_layout';
import HorizontalScrollSelector from '@/components/HorizontalScrollSelector';

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { 
    achievements, 
    unlockedAchievements,
    getAchievementsByCategory,
    initializeAchievements,
    gamificationEnabled,
    toggleGamification
  } = useGamificationStore();
  
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('workout');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showLocked, setShowLocked] = useState(true);
  
  // Initialize achievements when screen loads
  useEffect(() => {
    if (gamificationEnabled) {
      initializeAchievements();
    }
  }, [gamificationEnabled]);
  
  // Get achievements for selected category
  const categoryAchievements = getAchievementsByCategory(selectedCategory);
  
  // Filter achievements based on search query and filters
  const filteredAchievements = categoryAchievements.filter(achievement => {
    const matchesSearch = 
      searchQuery === '' || 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompletionFilter = 
      (showCompleted && achievement.completed) || 
      (showLocked && !achievement.completed);
    
    return matchesSearch && matchesCompletionFilter;
  });
  
  // Calculate completion percentage
  const completionPercentage = achievements.length > 0
    ? Math.floor((unlockedAchievements.length / achievements.length) * 100)
    : 0;
  
  // Handle achievement press - allow interaction with all achievements
  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };
  
  // Get icon for category
  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'workout':
        return <Zap size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'nutrition':
        return <Award size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'steps':
        return <Clock size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'weight':
        return <Weight size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'streak':
        return <Target size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      case 'special':
        return <Star size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
      default:
        return <Award size={20} color={selectedCategory === category ? colors.primary : colors.textSecondary} />;
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  // Toggle filter functions
  const toggleCompletedFilter = () => setShowCompleted(!showCompleted);
  const toggleLockedFilter = () => setShowLocked(!showLocked);
  
  // If gamification is disabled, show a message
  if (!gamificationEnabled) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{ 
            title: "Achievements",
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
            Gamification is Disabled
          </Text>
          <Text style={[styles.disabledMessage, { color: colors.textSecondary }]}>
            {APP_NAME}'s achievement system is currently disabled. Enable gamification in your profile settings to track achievements, earn points, and level up as you reach your fitness goals.
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
          title: "Achievements",
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <LevelProgress />
        
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {unlockedAchievements.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Unlocked
            </Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {completionPercentage}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Complete
            </Text>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search achievements..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { 
                  backgroundColor: showCompleted ? colors.primary + '20' : colors.card,
                  borderColor: showCompleted ? colors.primary : colors.border
                }
              ]}
              onPress={toggleCompletedFilter}
            >
              <Text style={[styles.filterText, { color: showCompleted ? colors.primary : colors.textSecondary }]}>
                Completed
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { 
                  backgroundColor: showLocked ? colors.primary + '20' : colors.card,
                  borderColor: showLocked ? colors.primary : colors.border
                }
              ]}
              onPress={toggleLockedFilter}
            >
              <Text style={[styles.filterText, { color: showLocked ? colors.primary : colors.textSecondary }]}>
                Locked
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Category Tabs with Horizontal Scroll */}
        <HorizontalScrollSelector
          title=""
          items={(['workout', 'nutrition', 'steps', 'weight', 'streak', 'special'] as AchievementCategory[]).map((category) => ({
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1),
            icon: getCategoryIcon(category),
          }))}
          selectedItem={selectedCategory}
          onSelectItem={(category) => setSelectedCategory(category as AchievementCategory)}
          maxVisibleItems={4}
          showMoreButton={false}
          itemWidth={120}
          itemHeight={48}
          showFadeIndicators={true}
        />
        
        <View style={styles.achievementsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Achievements
            {searchQuery ? ` - Search Results` : ''}
          </Text>
          
          {filteredAchievements.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No achievements found. Try adjusting your filters or search query.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredAchievements}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.achievementItem}>
                  <AchievementBadge 
                    achievement={item}
                    onPress={() => handleAchievementPress(item)}
                    showProgress
                  />
                  <Text 
                    style={[
                      styles.achievementName, 
                      { 
                        color: item.completed ? colors.text : colors.textSecondary,
                        opacity: item.completed ? 1 : 0.7
                      }
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.achievementsList}
            />
          )}
        </View>
        
        <Button
          title="Back"
          onPress={handleGoBack}
          variant="outline"
          style={styles.backButton2}
        />
      </ScrollView>
      
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          visible={showModal}
          onClose={() => setShowModal(false)}
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
  },
  backButton: {
    marginRight: 16,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTabs: {
    marginBottom: 16,
  },
  categoryTabsContent: {
    paddingVertical: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  achievementsList: {
    paddingBottom: 16,
  },
  achievementItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  achievementName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 80,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});