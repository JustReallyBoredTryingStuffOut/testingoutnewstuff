import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGamificationStore } from '@/store/gamificationStore';

interface LevelProgressProps {
  compact?: boolean;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ compact = false }) => {
  const { colors } = useTheme();
  const { 
    points, 
    getCurrentLevel, 
    getNextLevel, 
    getLevelProgress 
  } = useGamificationStore();
  
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progress = getLevelProgress();
  
  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.card }]}>
        <View style={styles.levelIconCompact}>
          <Text style={styles.levelEmojiCompact}>{currentLevel.icon}</Text>
        </View>
        <View style={styles.levelInfoCompact}>
          <Text style={[styles.levelTitleCompact, { color: colors.text }]}>
            Level {currentLevel.level}
          </Text>
          <View style={[styles.progressBarContainerCompact, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressBarCompact, 
                { 
                  width: `${progress}%`,
                  backgroundColor: colors.primary 
                }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.levelInfo}>
          <Text style={[styles.levelTitle, { color: colors.text }]}>
            Level {currentLevel.level}: {currentLevel.title}
          </Text>
          <Text style={[styles.pointsText, { color: colors.textSecondary }]}>
            {points} XP
          </Text>
        </View>
        <View style={styles.levelIcon}>
          <Text style={styles.levelEmoji}>{currentLevel.icon}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${progress}%`,
                backgroundColor: colors.primary 
              }
            ]} 
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            {points - currentLevel.minPoints} / {nextLevel.minPoints - currentLevel.minPoints} XP
          </Text>
          <Text style={[styles.nextLevelLabel, { color: colors.primary }]}>
            Level {nextLevel.level}: {nextLevel.title}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.pointsNeeded, { color: colors.textSecondary }]}>
        {nextLevel.minPoints - points} XP needed for next level
      </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIconCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelEmojiCompact: {
    fontSize: 20,
  },
  levelInfoCompact: {
    flex: 1,
  },
  levelTitleCompact: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarContainerCompact: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarCompact: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 14,
  },
  levelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelEmoji: {
    fontSize: 28,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
  },
  nextLevelLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  pointsNeeded: {
    textAlign: 'center',
    fontSize: 14,
  }
});

export default LevelProgress;