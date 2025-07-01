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
  Image,
  Platform
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { X, Trophy, Award, Star } from 'lucide-react-native';
import Button from './Button';
import LottieView from 'lottie-react-native';

interface PRCelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
  weight: number;
  previousBest: number;
  message: string;
  isMajorLift: boolean;
}

const { width } = Dimensions.get('window');

const PRCelebrationModal: React.FC<PRCelebrationModalProps> = ({
  visible,
  onClose,
  exerciseName,
  weight,
  previousBest,
  message,
  isMajorLift
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
      
      // Play lottie animation if available
      if (Platform.OS !== 'web' && lottieRef.current) {
        lottieRef.current.play();
      }
    }
  }, [visible, scaleAnim, opacityAnim, rotateAnim, bounceAnim]);
  
  // Calculate rotation for the trophy
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  // Calculate bounce for the weight text
  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });
  
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
            {isMajorLift ? "PERSONAL RECORD SMASHED! 💪" : "New Personal Record! 🎯"}
          </Text>
          
          {Platform.OS !== 'web' ? (
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
                styles.trophyContainer,
                { 
                  borderColor: colors.primary,
                  transform: [{ rotate: spin }]
                }
              ]}
            >
              <Trophy size={60} color={colors.primary} fill={colors.primary} />
            </Animated.View>
          )}
          
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, { color: colors.text }]}>
              {exerciseName}
            </Text>
            
            <View style={styles.weightContainer}>
              <Animated.Text 
                style={[
                  styles.weightValue, 
                  { 
                    color: colors.primary,
                    transform: [{ translateY: bounce }]
                  }
                ]}
              >
                {weight} kg
              </Animated.Text>
              
              <Text style={[styles.previousBest, { color: colors.textSecondary }]}>
                Previous: {previousBest} kg
              </Text>
              
              <Text style={[styles.improvement, { color: colors.success }]}>
                +{(weight - previousBest).toFixed(1)} kg improvement!
              </Text>
            </View>
            
            <View style={[styles.messageBubble, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.message, { color: colors.text }]}>
                {message}
              </Text>
            </View>
          </View>
          
          <View style={styles.confetti}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View 
                key={i}
                style={[
                  styles.confettiPiece,
                  {
                    backgroundColor: [colors.primary, colors.secondary, colors.warning][i % 3],
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
            title="Keep Crushing It! 💪"
            onPress={onClose}
            style={styles.button}
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
  trophyContainer: {
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
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  exerciseInfo: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  weightContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  weightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previousBest: {
    fontSize: 16,
    marginBottom: 4,
  },
  improvement: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageBubble: {
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginTop: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  button: {
    minWidth: 200,
    marginTop: 16,
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

export default PRCelebrationModal;