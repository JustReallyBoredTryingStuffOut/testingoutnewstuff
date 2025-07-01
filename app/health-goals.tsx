import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Info } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useMacroStore } from "@/store/macroStore";
import Button from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import MacroInfoModal from "@/components/MacroInfoModal";

export default function HealthGoalsScreen() {
  const router = useRouter();
  const { macroGoals, updateMacroGoals, userProfile, calculateIdealMacros } = useMacroStore();
  
  const [calories, setCalories] = useState(macroGoals?.calories?.toString() || "");
  const [protein, setProtein] = useState(macroGoals?.protein?.toString() || "");
  const [carbs, setCarbs] = useState(macroGoals?.carbs?.toString() || "");
  const [fat, setFat] = useState(macroGoals?.fat?.toString() || "");
  const [useCalculated, setUseCalculated] = useState(true);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  
  // Calculate ideal macros based on user profile
  const idealMacros = calculateIdealMacros();
  
  useEffect(() => {
    if (useCalculated) {
      setCalories(idealMacros.calories.toString());
      setProtein(idealMacros.protein.toString());
      setCarbs(idealMacros.carbs.toString());
      setFat(idealMacros.fat.toString());
    }
  }, [useCalculated, idealMacros]);
  
  const handleSave = () => {
    const newGoals = {
      calories: parseInt(calories) || idealMacros.calories,
      protein: parseInt(protein) || idealMacros.protein,
      carbs: parseInt(carbs) || idealMacros.carbs,
      fat: parseInt(fat) || idealMacros.fat,
    };
    
    updateMacroGoals(newGoals);
    Alert.alert("Success", "Nutrition goals updated successfully");
    router.back();
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: "Nutrition Goals",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Set Your Nutrition Goals</Text>
          <TouchableOpacity 
            onPress={() => setInfoModalVisible(true)}
            style={styles.infoButton}
            accessibilityLabel="Nutrition information"
            accessibilityHint="Opens a modal with information about how nutrition goals are calculated"
          >
            <Info size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Customize your daily macro targets</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[
            styles.optionButton, 
            useCalculated && styles.optionButtonActive
          ]}
          onPress={() => setUseCalculated(true)}
        >
          <Text style={[
            styles.optionText,
            useCalculated && styles.optionTextActive
          ]}>
            Recommended
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.optionButton, 
            !useCalculated && styles.optionButtonActive
          ]}
          onPress={() => setUseCalculated(false)}
        >
          <Text style={[
            styles.optionText,
            !useCalculated && styles.optionTextActive
          ]}>
            Custom
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Calories</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            placeholder="Calories (kcal)"
            editable={!useCalculated}
          />
          {useCalculated && (
            <Text style={styles.calculatedValue}>
              Recommended: {idealMacros.calories} kcal
            </Text>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
            placeholder="Protein (g)"
            editable={!useCalculated}
          />
          {useCalculated && (
            <Text style={styles.calculatedValue}>
              Recommended: {idealMacros.protein}g
            </Text>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Carbohydrates (g)</Text>
          <TextInput
            style={styles.input}
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
            placeholder="Carbs (g)"
            editable={!useCalculated}
          />
          {useCalculated && (
            <Text style={styles.calculatedValue}>
              Recommended: {idealMacros.carbs}g
            </Text>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
            placeholder="Fat (g)"
            editable={!useCalculated}
          />
          {useCalculated && (
            <Text style={styles.calculatedValue}>
              Recommended: {idealMacros.fat}g
            </Text>
          )}
        </View>
        
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            These recommendations are based on your profile information. For personalized nutrition advice, 
            please consult with a registered dietitian or healthcare provider.
          </Text>
        </View>
      </View>
      
      <Button
        title="Save Nutrition Goals"
        onPress={handleSave}
        style={styles.saveButton}
      />
      
      <MacroInfoModal 
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  infoButton: {
    marginLeft: 12,
    padding: 2,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  optionButtonActive: {
    borderBottomColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.primary,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  calculatedValue: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
    fontStyle: "italic",
  },
  saveButton: {
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  disclaimerContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 18,
  },
});