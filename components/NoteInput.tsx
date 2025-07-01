import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Text,
  Keyboard,
} from "react-native";
import { Edit3, Check } from "lucide-react-native";
import { colors } from "@/constants/colors";

type NoteInputProps = {
  initialValue: string;
  onSave: (note: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

export default function NoteInput({ 
  initialValue, 
  onSave, 
  placeholder = "Add a note...",
  multiline = false,
}: NoteInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialValue);
  
  const handleSave = () => {
    onSave(note);
    setIsEditing(false);
    Keyboard.dismiss();
  };
  
  if (!isEditing) {
    return (
      <TouchableOpacity 
        style={styles.container} 
        onPress={() => setIsEditing(true)}
        activeOpacity={0.7}
      >
        {note ? (
          <Text style={styles.noteText} numberOfLines={multiline ? 3 : 1}>
            {note}
          </Text>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Edit3 size={16} color={colors.textLight} />
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.editContainer}>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={note}
        onChangeText={setNote}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        autoFocus
        multiline={multiline}
      />
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
      >
        <Check size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    padding: 12,
    backgroundColor: colors.background,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: colors.primary,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});