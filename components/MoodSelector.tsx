import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Pressable
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from './Button';
import { X, Info } from 'lucide-react-native';

interface MoodSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectMood: (mood: string, emoji: string, preference?: string) => void;
}

type Mood = {
  id: string;
  label: string;
  emoji: string;
};

type Preference = {
  id: string;
  label: string;
  forMoods: string[];
};

const moods: Mood[] = [
  { id: 'great', label: 'Great', emoji: '😁' },
  { id: 'good', label: 'Good', emoji: '🙂' },
  { id: 'okay', label: 'Okay', emoji: '😐' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'bad', label: 'Not Great', emoji: '😔' },
];

const preferences: Preference[] = [
  { id: 'challenging', label: 'I want a challenging workout', forMoods: ['great', 'good'] },
  { id: 'normal', label: 'I want a normal workout', forMoods: ['great', 'good', 'okay'] },
  { id: 'energizing', label: 'I need an energy boost', forMoods: ['okay', 'tired'] },
  { id: 'shorter', label: 'I want a shorter workout (30 min)', forMoods: ['tired', 'okay'] },
  { id: 'light', label: 'I want a light workout', forMoods: ['tired', 'bad'] },
  { id: 'rest', label: 'I need a rest day', forMoods: ['tired', 'bad'] },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({
  visible,
  onClose,
  onSelectMood
}) => {
  const { colors } = useTheme();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
  const [showRestDayPrompt, setShowRestDayPrompt] = useState(false);
  
  // Filter preferences based on selected mood
  const filteredPreferences = selectedMood 
    ? preferences.filter(pref => pref.forMoods.includes(selectedMood.id))
    : [];
  
  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setSelectedPreference(null); // Reset preference when mood changes
    
    // Show rest day prompt if mood is "Not Great"
    if (mood.id === 'bad') {
      setShowRestDayPrompt(true);
    } else {
      setShowRestDayPrompt(false);
    }
  };
  
  const handlePreferenceSelect = (preferenceId: string) => {
    setSelectedPreference(preferenceId);
  };
  
  const handleSubmit = () => {
    if (!selectedMood) return;
    
    onSelectMood(
      selectedMood.id, 
      selectedMood.emoji, 
      selectedPreference || undefined
    );
  };
  
  const resetAndClose = () => {
    setSelectedMood(null);
    setSelectedPreference(null);
    setShowRestDayPrompt(false);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={resetAndClose}
      >
        <Pressable 
          style={[styles.modalContainer, { backgroundColor: colors.card }]}
          onPress={e => e.stopPropagation()}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={resetAndClose}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: colors.text }]}>How are you feeling today?</Text>
          
          <View style={styles.moodOptions}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  { 
                    backgroundColor: selectedMood?.id === mood.id 
                      ? `${colors.primary}20` 
                      : colors.background,
                    borderColor: selectedMood?.id === mood.id
                      ? colors.primary
                      : colors.border
                  }
                ]}
                onPress={() => handleMoodSelect(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text 
                  style={[
                    styles.moodLabel, 
                    { 
                      color: selectedMood?.id === mood.id
                        ? colors.primary
                        : colors.text
                    }
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Rest Day Suggestion Prompt - Only shown when "Not Great" is selected */}
          {showRestDayPrompt && (
            <View style={[styles.restDayPrompt, { backgroundColor: `${colors.secondary}15` }]}>
              <View style={styles.restDayPromptHeader}>
                <Info size={20} color={colors.secondary} style={styles.restDayPromptIcon} />
                <Text style={[styles.restDayPromptTitle, { color: colors.text }]}>
                  Consider taking a rest day
                </Text>
              </View>
              <Text style={[styles.restDayPromptText, { color: colors.textSecondary }]}>
                It's completely okay to take a rest day when you're not feeling great. 
                Rest is an essential part of any fitness journey and helps your body recover and grow stronger.
              </Text>
              <Text style={[styles.restDayPromptText, { color: colors.textSecondary, marginTop: 8 }]}>
                You can select "I need a rest day" below for light recovery activities, or choose a lighter workout if you still want to move.
              </Text>
            </View>
          )}
          
          {selectedMood && filteredPreferences.length > 0 && (
            <>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                What kind of workout do you want?
              </Text>
              
              <View style={styles.preferenceOptions}>
                {filteredPreferences.map((preference) => (
                  <TouchableOpacity
                    key={preference.id}
                    style={[
                      styles.preferenceOption,
                      { 
                        backgroundColor: selectedPreference === preference.id 
                          ? `${colors.primary}20` 
                          : colors.background,
                        borderColor: selectedPreference === preference.id
                          ? colors.primary
                          : colors.border
                      }
                    ]}
                    onPress={() => handlePreferenceSelect(preference.id)}
                  >
                    <Text 
                      style={[
                        styles.preferenceLabel, 
                        { 
                          color: selectedPreference === preference.id
                            ? colors.primary
                            : colors.text
                        }
                      ]}
                    >
                      {preference.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          
          <View style={styles.buttonContainer}>
            <Button
              title="Continue"
              onPress={handleSubmit}
              disabled={!selectedMood}
              style={styles.submitButton}
            />
            
            <Button
              title="Close"
              onPress={resetAndClose}
              variant="outline"
              style={styles.closePromptButton}
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
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  moodOption: {
    width: '30%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  preferenceOptions: {
    marginBottom: 24,
  },
  preferenceOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  submitButton: {
    marginBottom: 12,
  },
  closePromptButton: {
    marginBottom: 8,
  },
  // Rest Day Prompt Styles
  restDayPrompt: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  restDayPromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restDayPromptIcon: {
    marginRight: 8,
  },
  restDayPromptTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  restDayPromptText: {
    fontSize: 14,
    lineHeight: 20,
  }
});

export default MoodSelector;