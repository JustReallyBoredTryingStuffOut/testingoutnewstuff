import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

interface NoteInputProps {
  value: string;
  onChange: (text: string) => void;
  onSave: () => void;
  placeholder?: string;
}

export default function NoteInput({ value, onChange, onSave, placeholder }: NoteInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focusedContainer]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || 'Add a note...'}
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
      />
      <TouchableOpacity onPress={onSave} style={styles.saveButton}>
        <Ionicons name="checkmark" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  focusedContainer: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  saveButton: {
    padding: 8,
  },
});