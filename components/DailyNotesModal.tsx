import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { DailyNote, useNotesStore } from '@/store/notesStore';
import Button from '@/components/Button';

interface DailyNotesModalProps {
  visible: boolean;
  date: Date;
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { value: 'great', label: 'Great', icon: 'happy', color: '#4CAF50' },
  { value: 'good', label: 'Good', icon: 'happy-outline', color: '#8BC34A' },
  { value: 'okay', label: 'Okay', icon: 'neutral', color: '#FFC107' },
  { value: 'bad', label: 'Bad', icon: 'sad-outline', color: '#FF9800' },
  { value: 'terrible', label: 'Terrible', icon: 'sad', color: '#F44336' },
];

const ENERGY_OPTIONS = [
  { value: 'high', label: 'High', icon: 'battery-charging', color: '#4CAF50' },
  { value: 'medium', label: 'Medium', icon: 'battery-half', color: '#FFC107' },
  { value: 'low', label: 'Low', icon: 'battery-dead', color: '#F44336' },
];

export default function DailyNotesModal({ visible, date, onClose }: DailyNotesModalProps) {
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<DailyNote['mood']>();
  const [energy, setEnergy] = useState<DailyNote['energy']>();
  const [isEditing, setIsEditing] = useState(false);
  
  const { getNoteByDate, addDailyNote, updateDailyNote } = useNotesStore();
  
  useEffect(() => {
    if (visible) {
      const existingNote = getNoteByDate(date.toISOString());
      if (existingNote) {
        setNotes(existingNote.notes);
        setMood(existingNote.mood);
        setEnergy(existingNote.energy);
        setIsEditing(true);
      } else {
        setNotes('');
        setMood(undefined);
        setEnergy(undefined);
        setIsEditing(false);
      }
    }
  }, [visible, date, getNoteByDate]);
  
  const handleSave = () => {
    if (!notes.trim()) {
      Alert.alert('Notes Required', 'Please add some notes for today.');
      return;
    }
    
    const noteData = {
      date: date.toISOString(),
      notes: notes.trim(),
      mood,
      energy,
    };
    
    if (isEditing) {
      const existingNote = getNoteByDate(date.toISOString());
      if (existingNote) {
        updateDailyNote({
          ...existingNote,
          ...noteData,
        });
      }
    } else {
      addDailyNote(noteData);
    }
    
    onClose();
  };
  
  const handleClose = () => {
    if (notes.trim() && !isEditing) {
      Alert.alert(
        'Save Notes?',
        'You have unsaved notes. Would you like to save them?',
        [
          { text: 'Discard', style: 'destructive', onPress: onClose },
          { text: 'Save', onPress: handleSave },
        ]
      );
    } else {
      onClose();
    }
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {date.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Mood Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.optionsGrid}>
              {MOOD_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    mood === option.value && styles.selectedOption
                  ]}
                  onPress={() => setMood(option.value as DailyNote['mood'])}
                >
                  <Ionicons 
                    name={option.icon as any} 
                    size={24} 
                    color={mood === option.value ? colors.white : option.color} 
                  />
                  <Text style={[
                    styles.optionText,
                    mood === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Energy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Energy Level</Text>
            <View style={styles.optionsGrid}>
              {ENERGY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    energy === option.value && styles.selectedOption
                  ]}
                  onPress={() => setEnergy(option.value as DailyNote['energy'])}
                >
                  <Ionicons 
                    name={option.icon as any} 
                    size={24} 
                    color={energy === option.value ? colors.white : option.color} 
                  />
                  <Text style={[
                    styles.optionText,
                    energy === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Notes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Notes & Reflections</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Write about your day, goals, achievements, challenges, or anything on your mind..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              numberOfLines={8}
            />
          </View>
          
          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Reflection Tips</Text>
            <Text style={styles.tipsText}>
              • What went well today?{'\n'}
              • What challenges did you face?{'\n'}
              • How did you feel about your progress?{'\n'}
              • What would you like to improve tomorrow?
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    minWidth: 100,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.white,
  },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  tipsSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
}); 