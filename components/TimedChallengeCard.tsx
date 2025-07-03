import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { TimedChallenge, Badge } from '@/store/gamificationStore';
import { Clock, Award, Star, Zap } from 'lucide-react-native';

interface TimedChallengeCardProps {
  challenge: TimedChallenge;
  onPress: () => void;
  isActive?: boolean;
}

export default function TimedChallengeCard({ 
  challenge, 
  onPress, 
  isActive = false 
}: TimedChallengeCardProps) {
  const { colors } = useTheme();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#6B7280';
      case 'rare':
        return '#3B82F6';
      case 'epic':
        return '#8B5CF6';
      case 'legendary':
        return '#F59E0B';
      default:
        return colors.primary;
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Star size={16} color="#6B7280" />;
      case 'rare':
        return <Star size={16} color="#3B82F6" />;
      case 'epic':
        return <Star size={16} color="#8B5CF6" />;
      case 'legendary':
        return <Zap size={16} color="#F59E0B" />;
      default:
        return <Star size={16} color={colors.primary} />;
    }
  };

  const getDurationText = (duration: string) => {
    switch (duration) {
      case 'daily':
        return 'Daily Challenge';
      case 'weekly':
        return 'Weekly Challenge';
      case 'monthly':
        return 'Monthly Challenge';
      case 'seasonal':
        return 'Seasonal Challenge';
      default:
        return 'Timed Challenge';
    }
  };

  const progressPercentage = (challenge.progress / challenge.target) * 100;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card },
        isActive && { borderColor: colors.primary, borderWidth: 2 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            {challenge.title}
          </Text>
        </View>
        <View style={[styles.durationBadge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.durationText, { color: colors.primary }]}>
            {getDurationText(challenge.duration)}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {challenge.description}
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Progress: {challenge.progress}/{challenge.target}
          </Text>
          <Text style={[styles.percentageText, { color: colors.primary }]}>
            {progressPercentage.toFixed(0)}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: colors.primary,
                width: `${Math.min(progressPercentage, 100)}%`
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.rewardsContainer}>
        <View style={styles.rewardSection}>
          <Text style={[styles.rewardLabel, { color: colors.textSecondary }]}>
            Points Reward
          </Text>
          <View style={[styles.pointsBadge, { backgroundColor: colors.secondary + '20' }]}>
            <Text style={[styles.pointsText, { color: colors.secondary }]}>
              +{challenge.points} XP
            </Text>
          </View>
        </View>

        <View style={styles.rewardSection}>
          <Text style={[styles.rewardLabel, { color: colors.textSecondary }]}>
            Badge Reward
          </Text>
          <View style={[styles.badgeContainer, { backgroundColor: getRarityColor(challenge.badgeReward.rarity) + '20' }]}>
            <Text style={[styles.badgeIcon, { color: getRarityColor(challenge.badgeReward.rarity) }]}>
              {challenge.badgeReward.icon}
            </Text>
            <View style={styles.badgeInfo}>
              <Text style={[styles.badgeName, { color: colors.text }]}>
                {challenge.badgeReward.name}
              </Text>
              <View style={styles.rarityContainer}>
                {getRarityIcon(challenge.badgeReward.rarity)}
                <Text style={[styles.rarityText, { color: getRarityColor(challenge.badgeReward.rarity) }]}>
                  {challenge.badgeReward.rarity.charAt(0).toUpperCase() + challenge.badgeReward.rarity.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {challenge.exclusiveReward && (
        <View style={[styles.exclusiveContainer, { backgroundColor: colors.warning + '20' }]}>
          <Award size={16} color={colors.warning} />
          <Text style={[styles.exclusiveText, { color: colors.warning }]}>
            Exclusive: {challenge.exclusiveReward}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={[styles.difficultyBadge, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.difficultyText, { color: colors.error }]}>
            {challenge.difficulty?.charAt(0).toUpperCase() + challenge.difficulty?.slice(1)}
          </Text>
        </View>
        
        <Text style={[styles.timeRemaining, { color: colors.textSecondary }]}>
          {new Date(challenge.endDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  rewardsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  rewardSection: {
    gap: 8,
  },
  rewardLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  badgeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  rarityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  exclusiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  exclusiveText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeRemaining: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 