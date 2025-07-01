import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Achievement, AchievementTier } from '@/store/gamificationStore';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  showProgress?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'medium',
  onPress,
  showProgress = true
}) => {
  const { colors } = useTheme();
  
  // Get tier color
  const getTierColor = (tier: AchievementTier) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      case 'diamond': return '#B9F2FF';
      default: return '#CD7F32';
    }
  };
  
  // Get badge size
  const getBadgeSize = () => {
    switch (size) {
      case 'small': return 60;
      case 'large': return 100;
      default: return 80;
    }
  };
  
  const badgeSize = getBadgeSize();
  const tierColor = getTierColor(achievement.tier);
  
  // Calculate progress percentage
  const progressPercent = achievement.target > 0 
    ? Math.min(100, Math.floor((achievement.progress / achievement.target) * 100))
    : 0;
  
  // Determine if the badge is interactive - Allow interaction for all achievements
  const isInteractive = !!onPress;
  
  // Render the badge with appropriate styling
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          width: badgeSize, 
          height: badgeSize,
          backgroundColor: achievement.completed ? colors.card : colors.background,
          borderColor: achievement.completed ? tierColor : colors.border,
          opacity: achievement.completed ? 1 : 0.7,
        }
      ]}
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
    >
      {showProgress && !achievement.completed && (
        <View 
          style={[
            styles.progressRing,
            {
              width: badgeSize,
              height: badgeSize,
              borderColor: colors.primary,
              borderTopColor: 'transparent',
              transform: [{ rotate: `${progressPercent * 3.6}deg` }]
            }
          ]}
        />
      )}
      
      <Text style={[styles.icon, { fontSize: size === 'small' ? 24 : 32 }]}>
        {achievement.icon}
      </Text>
      
      {size !== 'small' && (
        <View style={styles.tierBadge}>
          <View style={[styles.tierIndicator, { backgroundColor: tierColor }]} />
        </View>
      )}
      
      {achievement.completed && (
        <View style={[styles.completedBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.completedIcon}>✓</Text>
        </View>
      )}
      
      {/* Add a lock icon for locked achievements */}
      {!achievement.completed && (
        <View style={[styles.lockOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  icon: {
    textAlign: 'center',
  },
  progressRing: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 3,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  tierBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  completedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 20,
  }
});

export default AchievementBadge;