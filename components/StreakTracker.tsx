import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGamificationStore } from '@/store/gamificationStore';

interface StreakTrackerProps {
  compact?: boolean;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ compact = false }) => {
  const { colors } = useTheme();
  const { streak, getStreakInfo } = useGamificationStore();
  
  const { currentStreak, longestStreak, nextMilestone, daysToNextReward } = getStreakInfo();
  
  // Generate streak circles
  const renderStreakCircles = () => {
    if (compact) return null;
    
    const circles = [];
    const maxCircles = 7; // Show max 7 days
    
    for (let i = 0; i < maxCircles; i++) {
      const isActive = i < currentStreak % maxCircles;
      circles.push(
        <View 
          key={i}
          style={[
            styles.streakCircle,
            { 
              backgroundColor: isActive ? colors.primary : colors.background,
              borderColor: isActive ? colors.primary : colors.border
            }
          ]}
        >
          {isActive && <Text style={styles.streakCircleText}>✓</Text>}
        </View>
      );
    }
    
    return (
      <View style={styles.streakCirclesContainer}>
        {circles}
      </View>
    );
  };
  
  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.card }]}>
        <View style={styles.compactContent}>
          <Text style={[styles.streakEmoji, { fontSize: 20 }]}>🔥</Text>
          <Text style={[styles.compactStreak, { color: colors.text }]}>
            {currentStreak} <Text style={{ color: colors.textSecondary, fontSize: 12 }}>day streak</Text>
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          <Text style={styles.streakEmoji}>🔥</Text> Workout Streak
        </Text>
        {currentStreak > 0 && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Keep it going!
          </Text>
        )}
      </View>
      
      <View style={styles.streakInfo}>
        <View style={styles.streakCount}>
          <Text style={[styles.streakNumber, { color: colors.primary }]}>{currentStreak}</Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Current</Text>
        </View>
        
        <View style={[styles.streakDivider, { backgroundColor: colors.border }]} />
        
        <View style={styles.streakCount}>
          <Text style={[styles.streakNumber, { color: colors.text }]}>{longestStreak}</Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Best</Text>
        </View>
        
        <View style={[styles.streakDivider, { backgroundColor: colors.border }]} />
        
        <View style={styles.streakCount}>
          <Text style={[styles.streakNumber, { color: colors.secondary }]}>{nextMilestone}</Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Next Goal</Text>
        </View>
      </View>
      
      {renderStreakCircles()}
      
      {daysToNextReward > 0 && (
        <Text style={[styles.nextReward, { color: colors.textSecondary }]}>
          {daysToNextReward} more {daysToNextReward === 1 ? 'day' : 'days'} to next reward!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  compactContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactStreak: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakCount: {
    flex: 1,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
  },
  streakDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  streakCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  streakCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakCircleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextReward: {
    textAlign: 'center',
    fontSize: 14,
  }
});

export default StreakTracker;