import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Challenge } from '@/store/gamificationStore';
import { Award, Clock } from 'lucide-react-native';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
  compact?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  compact = false
}) => {
  const { colors } = useTheme();
  
  // Calculate days remaining
  const daysRemaining = () => {
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  
  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.floor((challenge.progress / challenge.target) * 100));
  
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { backgroundColor: colors.card }]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.compactHeader}>
          <Text style={[styles.compactTitle, { color: colors.text }]} numberOfLines={1}>
            {challenge.title}
          </Text>
          <View style={styles.compactTimeRemaining}>
            <Clock size={12} color={colors.textSecondary} />
            <Text style={[styles.compactTimeText, { color: colors.textSecondary }]}>
              {daysRemaining()} days
            </Text>
          </View>
        </View>
        
        <View style={[styles.compactProgressBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.compactProgressFill, 
              { 
                width: `${progressPercent}%`,
                backgroundColor: challenge.completed ? colors.secondary : colors.primary
              }
            ]} 
          />
        </View>
        
        <View style={styles.compactFooter}>
          <Text style={[styles.compactProgress, { color: colors.textSecondary }]}>
            {challenge.progress} / {challenge.target}
          </Text>
          <Text style={[styles.compactPoints, { color: colors.primary }]}>
            +{challenge.points} XP
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
          <Award size={24} color={colors.primary} />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {challenge.title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {challenge.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            Progress: {challenge.progress} / {challenge.target}
          </Text>
          <Text style={[styles.timeRemaining, { color: colors.textSecondary }]}>
            {daysRemaining()} days remaining
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercent}%`,
                backgroundColor: challenge.completed ? colors.secondary : colors.primary
              }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        {challenge.reward && (
          <View style={[styles.rewardBadge, { backgroundColor: `${colors.secondary}20` }]}>
            <Text style={[styles.rewardText, { color: colors.secondary }]}>
              Reward: {challenge.reward}
            </Text>
          </View>
        )}
        
        <Text style={[styles.pointsText, { color: colors.primary }]}>
          +{challenge.points} XP
        </Text>
      </View>
      
      {challenge.completed && (
        <View style={[styles.completedBadge, { backgroundColor: colors.secondary }]}>
          <Text style={styles.completedText}>COMPLETED</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  compactContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  compactTimeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTimeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  compactProgressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactProgress: {
    fontSize: 12,
  },
  compactPoints: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeRemaining: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    transform: [{ rotate: '30deg' }],
  },
  completedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});

export default ChallengeCard;