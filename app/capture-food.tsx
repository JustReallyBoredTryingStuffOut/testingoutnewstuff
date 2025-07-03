import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Camera, Barcode } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore, FoodPhoto } from "@/store/photoStore";
import { useMacroStore } from "@/store/macroStore";
import { Food } from "@/types";
import FoodPhotoAnalyzer from "@/components/FoodPhotoAnalyzer";
import NutritionLabelScanner from "@/components/NutritionLabelScanner";

export default function CaptureFoodScreen() {
  const router = useRouter();
  const { addFoodPhoto } = usePhotoStore();
  const { addMacroLog } = useMacroStore();
  const [selectedOption, setSelectedOption] = useState<'choice' | 'photo' | 'label'>('choice');
  
  const handlePhotoTaken = async (photo: FoodPhoto) => {
    // Save the photo to the store
    await addFoodPhoto(photo);
    
    // Also log the macros
    addMacroLog({
      id: Date.now().toString(),
      date: photo.date,
      calories: photo.calories,
      protein: photo.protein,
      carbs: photo.carbs,
      fat: photo.fat,
      notes: `Photo: ${photo.name}`,
      mealType: "snack", // Default meal type, can be changed later
    });
    
    // Navigate back
    router.back();
  };

  const handleFoodFound = (food: Food) => {
    // Log the food to the macro store
    addMacroLog({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      notes: `Scanned: ${food.name}${food.brand ? ` (${food.brand})` : ''}`,
      mealType: "snack", // Default meal type, can be changed later
      foodName: food.name,
    });
    
    // Navigate back
    router.back();
  };
  
  const handleGoBack = () => {
    if (selectedOption !== 'choice') {
      setSelectedOption('choice');
    } else {
      router.back();
    }
  };

  const handleSelectPhotoAnalysis = () => {
    setSelectedOption('photo');
  };

  const handleSelectLabelScanning = () => {
    setSelectedOption('label');
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: selectedOption === 'choice' ? "Analyze Food" : 
                 selectedOption === 'photo' ? "Analyze Food Photo" : "Scan Nutrition Label",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {selectedOption === 'choice' ? (
        <View style={styles.choiceContainer}>
          <View style={styles.choiceHeader}>
            <Text style={styles.choiceTitle}>How would you like to add food?</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionCard, { backgroundColor: colors.card }]}
              onPress={handleSelectPhotoAnalysis}
            >
              <View style={styles.optionContent}>
                <Camera size={32} color={colors.primary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Analyze Food Photo</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    Take a photo of your meal to get nutritional information
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.optionCard, { backgroundColor: colors.card }]}
              onPress={handleSelectLabelScanning}
            >
              <View style={styles.optionContent}>
                <Barcode size={32} color={colors.primary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Scan Nutrition Label</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    Scan a Nutrition facts label to automatically extract nutritional information
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : selectedOption === 'photo' ? (
        <FoodPhotoAnalyzer
          onPhotoTaken={handlePhotoTaken}
          onCancel={() => setSelectedOption('choice')}
        />
      ) : (
        <NutritionLabelScanner
          onFoodFound={handleFoodFound}
          onCancel={() => setSelectedOption('choice')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  choiceContainer: {
    flex: 1,
    padding: 20,
  },
  choiceHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  choiceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});