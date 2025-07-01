import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";

interface MacroInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MacroInfoModal({ visible, onClose }: MacroInfoModalProps) {
  const { colors } = useTheme();
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>About Your Nutrition Goals</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>How Your Macros Are Calculated</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              Your daily calorie and macro targets are personalized estimates based on your profile information:
            </Text>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>• Weight & Height:</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Used to calculate your basal metabolic rate (BMR)</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>• Age:</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Affects your metabolism and calorie needs</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>• Activity Level:</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Determines how many additional calories you need</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>• Fitness Goal:</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Adjusts calories up or down based on whether you want to lose, maintain, or gain</Text>
            </View>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Understanding Your Macros</Text>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.calorieColor }]} />
              <View style={styles.macroInfo}>
                <Text style={[styles.macroTitle, { color: colors.text }]}>Calories</Text>
                <Text style={[styles.macroDescription, { color: colors.textSecondary }]}>
                  The total energy your body needs daily. This is the foundation of your nutrition plan.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroProtein }]} />
              <View style={styles.macroInfo}>
                <Text style={[styles.macroTitle, { color: colors.text }]}>Protein (4 calories/gram)</Text>
                <Text style={[styles.macroDescription, { color: colors.textSecondary }]}>
                  Essential for muscle repair and growth. We recommend 1.6-2.2g per kg of body weight for active individuals. Each gram of protein provides 4 calories of energy.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroCarbs }]} />
              <View style={styles.macroInfo}>
                <Text style={[styles.macroTitle, { color: colors.text }]}>Carbs (4 calories/gram)</Text>
                <Text style={[styles.macroDescription, { color: colors.textSecondary }]}>
                  Your body's primary energy source, especially important for high-intensity activities. Like protein, each gram of carbohydrates provides 4 calories of energy.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroFat }]} />
              <View style={styles.macroInfo}>
                <Text style={[styles.macroTitle, { color: colors.text }]}>Fat (9 calories/gram)</Text>
                <Text style={[styles.macroDescription, { color: colors.textSecondary }]}>
                  Essential for hormone production and vitamin absorption. Healthy fats are an important part of your diet. Fat is more energy-dense, providing 9 calories per gram.
                </Text>
              </View>
            </View>
            
            <View style={[styles.macroCaloriesExplanation, { backgroundColor: colors.highlight }]}>
              <Text style={[styles.macroCaloriesTitle, { color: colors.text }]}>Why We Show Calories per Gram</Text>
              <Text style={[styles.macroCaloriesText, { color: colors.textSecondary }]}>
                The calorie values (4 cal/g for protein and carbs, 9 cal/g for fat) represent how much energy each macronutrient provides when metabolized by your body. This helps you understand why balancing your macros is important:
              </Text>
              <View style={styles.macroCaloriesList}>
                <Text style={[styles.macroCaloriesItem, { color: colors.textSecondary }]}>• Protein (4 cal/g): Building blocks for muscle and tissue repair</Text>
                <Text style={[styles.macroCaloriesItem, { color: colors.textSecondary }]}>• Carbs (4 cal/g): Primary energy source for daily activities and workouts</Text>
                <Text style={[styles.macroCaloriesItem, { color: colors.textSecondary }]}>• Fat (9 cal/g): Energy-dense nutrient essential for hormone production</Text>
              </View>
              <Text style={[styles.macroCaloriesText, { color: colors.textSecondary }]}>
                Understanding these values helps you make informed choices about your diet composition based on your specific fitness goals.
              </Text>
            </View>
            
            <View style={[styles.disclaimer, { borderLeftColor: colors.warning }]}>
              <Text style={[styles.disclaimerTitle, { color: colors.text }]}>Important Note</Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                These calculations provide general guidelines only. For personalized nutrition advice, please consult with a registered dietitian or healthcare provider.
              </Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                Your actual needs may vary based on individual factors like metabolism, medical conditions, and specific training goals.
              </Text>
            </View>
            
            <TouchableOpacity style={[styles.closeModalButton, { backgroundColor: colors.primary }]} onPress={onClose}>
              <Text style={styles.closeModalButtonText}>Got It</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    marginLeft: 16,
  },
  macroExplanation: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  macroIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 2,
  },
  macroInfo: {
    flex: 1,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  macroDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  macroCaloriesExplanation: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  macroCaloriesTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  macroCaloriesText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  macroCaloriesList: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  macroCaloriesItem: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  closeModalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  closeModalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});