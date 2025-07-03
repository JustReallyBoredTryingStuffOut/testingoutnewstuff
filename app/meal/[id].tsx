import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
  Alert
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Clock, 
  UtensilsCrossed, 
  Share2, 
  Check, 
  Bookmark,
  X
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { mealRecommendations } from "@/mocks/meals";
import { useMacroStore } from "@/store/macroStore";
import Button from "@/components/Button";
import { useState } from "react";

export default function MealDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addMacroLog } = useMacroStore();
  const [showShareModal, setShowShareModal] = useState(false);
  
  const meal = mealRecommendations.find(meal => meal.id === id);
  
  if (!meal) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: "Meal Details",
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
                accessibilityLabel="Go back"
                accessibilityHint="Returns to the previous screen"
              >
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Meal not found</Text>
          <TouchableOpacity 
            style={styles.backToMealsButton}
            onPress={() => router.push("/meal-recommendations")}
          >
            <Text style={styles.backToMealsText}>Back to Recommendations</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleShare = () => {
    // Open share modal
    setShowShareModal(true);
  };
  
  const handleLogMeal = () => {
    // Add meal to macro logs
    addMacroLog({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      notes: `Logged from recommendations: ${meal.name}`,
    });
    
    // Show success message
    Alert.alert(
      "Success",
      "Meal logged successfully",
      [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/nutrition")
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Meal Details",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleShare} 
              style={styles.shareButton}
              accessibilityLabel="Share meal"
              accessibilityHint="Opens sharing options for this meal"
            >
              <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <Image 
          source={{ uri: meal.imageUrl }} 
          style={styles.mealImage} 
          resizeMode="cover"
        />
        
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{meal.name}</Text>
          
          <View style={styles.mealMeta}>
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {meal.prepTime + meal.cookTime} min
              </Text>
            </View>
            
            {meal.dietaryRestrictions.length > 0 && (
              <View style={styles.dietaryTags}>
                {meal.dietaryRestrictions.map((restriction: string) => (
                  <View key={restriction} style={styles.dietaryTag}>
                    <Text style={styles.dietaryTagText}>
                      {restriction}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.macrosCard}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.calories}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsCard}>
            {meal.ingredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            {meal.instructions.map((instruction: string, index: number) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Log This Meal"
            onPress={handleLogMeal}
            icon={<Check size={18} color="#FFFFFF" />}
            style={styles.logButton}
          />
          
          <Button
            title="Save Recipe"
            onPress={() => {
              Alert.alert("Recipe Saved", "This recipe has been saved to your favorites");
            }}
            icon={<Bookmark size={18} color={colors.primary} />}
            variant="outline"
            style={styles.saveButton}
          />
        </View>
      </ScrollView>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowShareModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Share Recipe</Text>
                  <TouchableOpacity 
                    onPress={() => setShowShareModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <X size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.modalText}>
                  Share this {meal.name} recipe with friends and family
                </Text>
                
                <View style={styles.shareOptions}>
                  <TouchableOpacity 
                    style={styles.shareOption}
                    onPress={() => {
                      setShowShareModal(false);
                      Alert.alert("Shared", "Recipe shared via WhatsApp");
                    }}
                  >
                    <View style={[styles.shareIconContainer, { backgroundColor: "#25D366" }]}>
                      <Text style={styles.shareIconText}>W</Text>
                    </View>
                    <Text style={styles.shareOptionText}>WhatsApp</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.shareOption}
                    onPress={() => {
                      setShowShareModal(false);
                      Alert.alert("Shared", "Recipe shared via Facebook");
                    }}
                  >
                    <View style={[styles.shareIconContainer, { backgroundColor: "#3b5998" }]}>
                      <Text style={styles.shareIconText}>f</Text>
                    </View>
                    <Text style={styles.shareOptionText}>Facebook</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.shareOption}
                    onPress={() => {
                      setShowShareModal(false);
                      Alert.alert("Shared", "Recipe shared via Twitter");
                    }}
                  >
                    <View style={[styles.shareIconContainer, { backgroundColor: "#1DA1F2" }]}>
                      <Text style={styles.shareIconText}>X</Text>
                    </View>
                    <Text style={styles.shareOptionText}>Twitter</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.shareOption}
                    onPress={() => {
                      setShowShareModal(false);
                      Alert.alert("Shared", "Recipe shared via Telegram");
                    }}
                  >
                    <View style={[styles.shareIconContainer, { backgroundColor: "#0088cc" }]}>
                      <Text style={styles.shareIconText}>T</Text>
                    </View>
                    <Text style={styles.shareOptionText}>Telegram</Text>
                  </TouchableOpacity>
                </View>
                
                <Button
                  title="Copy Link"
                  onPress={() => {
                    setShowShareModal(false);
                    Alert.alert("Link Copied", "Recipe link copied to clipboard");
                  }}
                  style={styles.copyLinkButton}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  mealImage: {
    width: "100%",
    height: 250,
  },
  mealHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  mealMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dietaryTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dietaryTag: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  dietaryTagText: {
    fontSize: 12,
    color: colors.primary,
  },
  macrosCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.card,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  ingredientsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  instructionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  actionsContainer: {
    padding: 16,
    flexDirection: "row",
    marginBottom: 24,
  },
  logButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  backToMealsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToMealsText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  shareOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  shareOption: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  shareIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareIconText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  shareOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  copyLinkButton: {
    width: "100%",
  },
});