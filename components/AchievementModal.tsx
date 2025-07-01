import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Dimensions,
  Platform
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Achievement } from '@/store/gamificationStore';
import { X } from 'lucide-react-native';
import Button from './Button';
import LottieView from 'lottie-react-native';

interface AchievementModalProps {
  achievement: Achievement;
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  visible,
  onClose
}) => {
  const { colors } = useTheme();
  const lottieRef = React.useRef<LottieView>(null);
  
  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  
  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      case 'diamond': return '#B9F2FF';
      default: return '#CD7F32';
    }
  };
  
  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);
      
      // Start animations
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.elastic(1.2),
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.elastic(1.5),
          useNativeDriver: true
        })
      ]).start();
      
      // Play lottie animation if available and not on web
      if (Platform.OS !== 'web' && lottieRef.current && achievement.completed) {
        lottieRef.current.play();
      }
    }
  }, [visible, scaleAnim, opacityAnim, rotateAnim, achievement.completed]);
  
  // Calculate rotation for the badge
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  // Determine if this is a locked or unlocked achievement view
  const isUnlocked = achievement.completed;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { 
              backgroundColor: colors.card,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.congratsText, { color: colors.text }]}>
            {isUnlocked ? "Achievement Unlocked!" : "Locked Achievement"}
          </Text>
          
          {isUnlocked && Platform.OS !== 'web' ? (
            <View style={styles.lottieContainer}>
              <LottieView
                ref={lottieRef}
                source={require('../assets/animations/trophy.json')}
                style={styles.lottieAnimation}
                autoPlay
                loop={false}
              />
            </View>
          ) : (
            <Animated.View 
              style={[
                styles.badgeContainer,
                { 
                  borderColor: getTierColor(achievement.tier),
                  transform: isUnlocked ? [{ rotate: spin }] : [],
                  opacity: isUnlocked ? 1 : 0.7,
                  backgroundColor: isUnlocked ? 'white' : colors.background
                }
              ]}
            >
              <Text style={styles.badgeIcon}>{achievement.icon}</Text>
              {!isUnlocked && (
                <View style={styles.lockIconContainer}>
                  <Text style={styles.lockIconLarge}>🔒</Text>
                </View>
              )}
            </Animated.View>
          )}
          
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>
              {achievement.title}
            </Text>
            
            <View style={[styles.tierBadge, { backgroundColor: getTierColor(achievement.tier) }]}>
              <Text style={styles.tierText}>
                {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
              </Text>
            </View>
            
            <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
              {achievement.description}
            </Text>
            
            {isUnlocked ? (
              <Text style={[styles.pointsText, { color: colors.primary }]}>
                +{achievement.points} XP
              </Text>
            ) : (
              <View style={styles.progressContainer}>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  Progress: {achievement.progress} / {achievement.target}
                </Text>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.primary,
                        width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.rewardText, { color: colors.primary }]}>
                  Reward: {achievement.points} XP
                </Text>
              </View>
            )}
          </View>
          
          {isUnlocked && (
            <View style={styles.confetti}>
              {Array.from({ length: 30 }).map((_, i) => (
                <View 
                  key={i}
                  style={[
                    styles.confettiPiece,
                    {
                      backgroundColor: [colors.primary, colors.secondary, getTierColor(achievement.tier)][i % 3],
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: [
                        { rotate: `${Math.random() * 360}deg` },
                        { scale: Math.random() * 0.5 + 0.5 }
                      ]
                    }
                  ]}
                />
              ))}
            </View>
          )}
          
          <Button
            title={isUnlocked ? "Awesome!" : "Got It"}
            onPress={onClose}
            style={styles.button}
          />
          
          <Button
            title="Close"
            onPress={onClose}
            variant="outline"
            style={styles.closeButton2}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  congratsText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  badgeContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  badgeIcon: {
    fontSize: 60,
  },
  lockIconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 60,
  },
  lockIconLarge: {
    fontSize: 40,
  },
  lottieContainer: {
    width: 150,
    height: 150,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  achievementInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  tierText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  achievementDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  button: {
    minWidth: 150,
    marginBottom: 12,
  },
  closeButton2: {
    minWidth: 150,
  },
  confetti: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
    opacity: 0.7,
  }
});

export default AchievementModal;