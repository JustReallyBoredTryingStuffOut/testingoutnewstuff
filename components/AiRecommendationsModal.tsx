import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Pressable,
  ScrollView
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from './Button';
import { X, Zap, Brain, CheckCircle, AlertCircle } from 'lucide-react-native';

interface AiRecommendationsModalProps {
  visible: boolean;
  onClose: () => void;
  onEnable: () => void;
  onDisable: () => void;
}

const AiRecommendationsModal: React.FC<AiRecommendationsModalProps> = ({
  visible,
  onClose,
  onEnable,
  onDisable
}) => {
  const { colors } = useTheme();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <Pressable 
          style={[styles.modalContainer, { backgroundColor: colors.card }]}
          onPress={e => e.stopPropagation()}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <View style={[styles.iconBackground, { backgroundColor: `${colors.primary}20` }]}>
              <Brain size={40} color={colors.primary} />
            </View>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>AI Workout Recommendations</Text>
          
          <ScrollView style={styles.scrollContent}>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Our AI can analyze your workout history, fitness level, goals, and current mood to recommend personalized workouts just for you.
            </Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={colors.secondary} style={styles.featureIcon} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Recommendations based on your fitness level (beginner, intermediate, advanced)
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={colors.secondary} style={styles.featureIcon} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Adapts to your current mood and energy level
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={colors.secondary} style={styles.featureIcon} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Aligns with your fitness goals (weight loss, muscle gain, etc.)
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <CheckCircle size={20} color={colors.secondary} style={styles.featureIcon} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Learns from your workout ratings and history
                </Text>
              </View>
            </View>
            
            <View style={[styles.privacyNote, { backgroundColor: `${colors.warning}10` }]}>
              <AlertCircle size={20} color={colors.warning} style={styles.privacyIcon} />
              <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
                Your workout data is processed locally on your device. You can disable AI recommendations at any time in settings.
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Enable AI Recommendations"
              onPress={onEnable}
              style={styles.enableButton}
              icon={<Zap size={18} color="#FFFFFF" />}
            />
            
            <Button
              title="No Thanks"
              onPress={onDisable}
              variant="outline"
              style={styles.disableButton}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    maxHeight: 300,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  privacyNote: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  privacyIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  privacyText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 8,
  },
  enableButton: {
    marginBottom: 12,
  },
  disableButton: {
    marginBottom: 8,
  }
});

export default AiRecommendationsModal;