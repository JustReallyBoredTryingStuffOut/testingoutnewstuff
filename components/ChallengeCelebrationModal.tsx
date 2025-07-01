import React, { useEffect, useRef } from 'react';
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
import { X, Award, Trophy, Target, Star, Zap, Gift } from 'lucide-react-native';
import Button from './Button';
import LottieView from 'lottie-react-native';
import { Challenge } from '@/store/gamificationStore';

interface ChallengeCelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  challenge: Challenge;
}

const { width } = Dimensions.get('window');

const ChallengeCelebrationModal: React.FC<ChallengeCelebrationModalProps> = ({
  visible,
  onClose,
  challenge
}) => {
  const { colors } = useTheme();
  const lottieRef = useRef<LottieView>(null);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);
      bounceAnim.setValue(0);
      
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
      
      // Start bounce animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true
          })
        ])
      ).start();
      
      // Play lottie animation if available and not on web
      if (Platform.OS !== 'web' && lottieRef.current) {
        lottieRef.current.play();
      }
    }
  }, [visible, scaleAnim, opacityAnim, rotateAnim, bounceAnim]);
  
  // Calculate rotation for the icon
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  // Calculate bounce for the points text
  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });
  
  // Get celebration icon based on challenge category and difficulty
  const getCelebrationIcon = () => {
    if (Platform.OS !== 'web') {
      return (
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={require('../assets/animations/trophy.json')}
            style={styles.lottieAnimation}
            autoPlay
            loop={false}
          />
        </View>
      );
    }
    
    // For web or as fallback
    const iconSize = 60;
    const iconColor = getDifficultyColor();
    
    switch (challenge.category) {
      case 'workout':
        return <Trophy size={iconSize} color={iconColor} fill={iconColor} />;
      case 'steps':
        return <Target size={iconSize} color={iconColor} fill={iconColor} />;
      case 'nutrition':
        return <Award size={iconSize} color={iconColor} fill={iconColor} />;
      case 'weight':
        return <Award size={iconSize} color={iconColor} fill={iconColor} />;
      case 'streak':
        return <Zap size={iconSize} color={iconColor} fill={iconColor} />;
      case 'special':
        return <Star size={iconSize} color={iconColor} fill={iconColor} />;
      default:
        return <Trophy size={iconSize} color={iconColor} fill={iconColor} />;
    }
  };
  
  // Get celebration title based on challenge difficulty
  const getCelebrationTitle = () => {
    if (!challenge.difficulty) return "Challenge Completed!";
    
    switch (challenge.difficulty) {
      case 'easy':
        return "Challenge Completed!";
      case 'medium':
        return "Impressive Achievement!";
      case 'hard':
        return "Outstanding Victory!";
      default:
        return "Challenge Completed!";
    }
  };
  
  // Get celebration message based on challenge category and difficulty
  const getCelebrationMessage = () => {
    // Base messages by category
    const categoryMessages = {
      workout: [
        "You've crushed your workout goals!",
        "Your dedication to fitness is paying off!",
        "Keep pushing your limits and growing stronger!"
      ],
      nutrition: [
        "Your commitment to nutrition is impressive!",
        "Healthy eating habits lead to lasting results!",
        "You're fueling your body for success!"
      ],
      steps: [
        "You've walked the extra mile, literally!",
        "Every step counts, and you've counted a lot!",
        "Your journey to fitness is well underway!"
      ],
      weight: [
        "Your consistency is showing results!",
        "Progress happens one day at a time!",
        "You're transforming with every challenge!"
      ],
      streak: [
        "Your consistency is your superpower!",
        "Habits form champions, and you're on your way!",
        "Day by day, you're building your legacy!"
      ],
      special: [
        "You've accomplished something truly special!",
        "This achievement sets you apart!",
        "Extraordinary effort leads to extraordinary results!"
      ]
    };
    
    // Get messages for this category
    const messages = categoryMessages[challenge.category] || [
      "Congratulations on completing this challenge!",
      "Your hard work and dedication paid off!",
      "Keep challenging yourself to reach new heights!"
    ];
    
    // Select message based on difficulty
    let index = 0;
    if (challenge.difficulty === 'medium') index = 1;
    if (challenge.difficulty === 'hard') index = 2;
    
    return messages[index] || messages[0];
  };
  
  // Get color based on difficulty
  const getDifficultyColor = () => {
    if (!challenge.difficulty) return colors.primary;
    
    switch (challenge.difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.primary;
      case 'hard':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };
  
  // Get button text based on difficulty
  const getButtonText = () => {
    if (!challenge.difficulty) return "Awesome!";
    
    switch (challenge.difficulty) {
      case 'easy':
        return "Great Job!";
      case 'medium':
        return "Impressive Work!";
      case 'hard':
        return "Legendary!";
      default:
        return "Awesome!";
    }
  };
  
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
            {getCelebrationTitle()}
          </Text>
          
          <Animated.View 
            style={[
              styles.iconContainer,
              { 
                borderColor: getDifficultyColor(),
                transform: [{ rotate: spin }]
              }
            ]}
          >
            {getCelebrationIcon()}
          </Animated.View>
          
          <View style={styles.challengeInfo}>
            <Text style={[styles.challengeTitle, { color: colors.text }]}>
              {challenge.title}
            </Text>
            
            <Text style={[styles.challengeDescription, { color: colors.textSecondary }]}>
              {challenge.description}
            </Text>
            
            <Text style={[styles.celebrationMessage, { color: getDifficultyColor() }]}>
              {getCelebrationMessage()}
            </Text>
            
            <View style={styles.rewardContainer}>
              <View style={[styles.rewardBadge, { backgroundColor: `${getDifficultyColor()}20` }]}>
                <Gift size={20} color={getDifficultyColor()} />
                <Text style={[styles.rewardText, { color: getDifficultyColor() }]}>
                  {challenge.reward ? challenge.reward : ""}
                </Text>
              </View>
              
              <Animated.Text 
                style={[
                  styles.pointsText, 
                  { 
                    color: colors.primary,
                    transform: [{ translateY: bounce }]
                  }
                ]}
              >
                +{challenge.points} XP
              </Animated.Text>
            </View>
          </View>
          
          <View style={styles.confetti}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View 
                key={i}
                style={[
                  styles.confettiPiece,
                  {
                    backgroundColor: [getDifficultyColor(), colors.secondary, colors.primary][i % 3],
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
          
          <Button
            title={getButtonText()}
            onPress={onClose}
            style={[styles.button, { backgroundColor: getDifficultyColor() }]}
          />
          
          <Button
            title="View All Challenges"
            onPress={() => {
              onClose();
              // Navigation would happen here if needed
            }}
            variant="outline"
            style={styles.viewAllButton}
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lottieContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  challengeInfo: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  celebrationMessage: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    minWidth: 200,
    marginBottom: 12,
  },
  viewAllButton: {
    minWidth: 200,
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

export default ChallengeCelebrationModal;