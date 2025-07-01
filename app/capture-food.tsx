import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore, FoodPhoto } from "@/store/photoStore";
import { useMacroStore } from "@/store/macroStore";
import FoodPhotoAnalyzer from "@/components/FoodPhotoAnalyzer";

export default function CaptureFoodScreen() {
  const router = useRouter();
  const { addFoodPhoto } = usePhotoStore();
  const { addMacroLog } = useMacroStore();
  
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
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Analyze Food",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <FoodPhotoAnalyzer
        onPhotoTaken={handlePhotoTaken}
        onCancel={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
});