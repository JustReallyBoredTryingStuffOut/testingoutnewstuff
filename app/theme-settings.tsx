import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Moon, Sun, Smartphone, Check, ArrowLeft } from "lucide-react-native";
import { useThemeStore, ColorScheme } from "@/store/themeStore";
import { useTheme } from "@/context/ThemeContext";
import Button from "@/components/Button";

export default function ThemeSettingsScreen() {
  const { theme, colorScheme, setTheme, setColorScheme } = useThemeStore();
  const { colors, currentColorScheme } = useTheme();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedColorScheme, setSelectedColorScheme] = useState(colorScheme);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Update local state when store values change
  useEffect(() => {
    setSelectedTheme(theme);
    setSelectedColorScheme(colorScheme);
  }, [theme, colorScheme]);
  
  const colorSchemes: { name: string; value: ColorScheme; color: string; description: string }[] = [
    { name: "Blue", value: "blue", color: "#4A90E2", description: "Classic blue theme" },
    { name: "Green", value: "green", color: "#50C878", description: "Fresh green theme" },
    { name: "Purple", value: "purple", color: "#8A2BE2", description: "Rich purple theme" },
    { name: "Orange", value: "orange", color: "#FF9500", description: "Warm orange theme" },
    { name: "Pink", value: "pink", color: "#FF6B6B", description: "Soft pink theme" },
    // New modern themes
    { name: "Pastel", value: "pastel", color: "#B5D8EB", description: "Soft pastel colors" },
    { name: "Monochrome", value: "monochrome", color: "#555555", description: "Elegant grayscale" },
    { name: "Nature", value: "nature", color: "#7D9D9C", description: "Earthy natural tones" },
    { name: "Vibrant", value: "vibrant", color: "#FF3366", description: "Bold vibrant colors" },
    { name: "Minimal", value: "minimal", color: "#007AFF", description: "Clean minimal design" },
  ];
  
  const handleSaveTheme = () => {
    // Apply the selected theme and color scheme
    setTheme(selectedTheme);
    setColorScheme(selectedColorScheme);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Automatically close modal and navigate back after a delay
    setTimeout(() => {
      setShowSuccessModal(false);
      router.back();
    }, 1500);
  };
  
  const handleGoBack = () => {
    router.navigate("/(tabs)");
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: "Theme Settings",
          headerBackTitle: "Profile",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Customize the app's look and feel</Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
        
        <View style={styles.themeOptions}>
          <TouchableOpacity 
            style={[
              styles.themeOption, 
              selectedTheme === "light" && [styles.selectedTheme, { borderColor: colors.primary }]
            ]}
            onPress={() => setSelectedTheme("light")}
          >
            <View style={[styles.themeIconContainer, { backgroundColor: "#F8F9FA" }]}>
              <Sun size={24} color="#333333" />
            </View>
            <Text style={[styles.themeText, { color: colors.text }]}>Light</Text>
            {selectedTheme === "light" && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Check size={16} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.themeOption, 
              selectedTheme === "dark" && [styles.selectedTheme, { borderColor: colors.primary }]
            ]}
            onPress={() => setSelectedTheme("dark")}
          >
            <View style={[styles.themeIconContainer, { backgroundColor: "#121212" }]}>
              <Moon size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.themeText, { color: colors.text }]}>Dark</Text>
            {selectedTheme === "dark" && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Check size={16} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.themeOption, 
              selectedTheme === "system" && [styles.selectedTheme, { borderColor: colors.primary }]
            ]}
            onPress={() => setSelectedTheme("system")}
          >
            <View style={[styles.themeIconContainer, { backgroundColor: "#E8F0FE" }]}>
              <Smartphone size={24} color="#333333" />
            </View>
            <Text style={[styles.themeText, { color: colors.text }]}>System</Text>
            {selectedTheme === "system" && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Check size={16} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Color Scheme</Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>Choose from classic or modern themes</Text>
        
        <View style={styles.colorSchemesContainer}>
          <Text style={[styles.categoryTitle, { color: colors.text }]}>Classic</Text>
          <View style={styles.colorSchemes}>
            {colorSchemes.slice(0, 5).map((scheme) => (
              <TouchableOpacity 
                key={scheme.value}
                style={[
                  styles.colorScheme,
                  selectedColorScheme === scheme.value && [styles.selectedColorScheme, { borderColor: scheme.color }]
                ]}
                onPress={() => setSelectedColorScheme(scheme.value)}
              >
                <View style={[styles.colorCircle, { backgroundColor: scheme.color }]} />
                <View style={styles.colorSchemeTextContainer}>
                  <Text style={[styles.colorText, { color: colors.text }]}>{scheme.name}</Text>
                  <Text style={[styles.colorDescription, { color: colors.textSecondary }]}>{scheme.description}</Text>
                </View>
                {selectedColorScheme === scheme.value && (
                  <View style={[styles.colorCheckmark, { backgroundColor: scheme.color }]}>
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={[styles.categoryTitle, { color: colors.text, marginTop: 16 }]}>Modern</Text>
          <View style={styles.colorSchemes}>
            {colorSchemes.slice(5).map((scheme) => (
              <TouchableOpacity 
                key={scheme.value}
                style={[
                  styles.colorScheme,
                  selectedColorScheme === scheme.value && [styles.selectedColorScheme, { borderColor: scheme.color }]
                ]}
                onPress={() => setSelectedColorScheme(scheme.value)}
              >
                <View style={[styles.colorCircle, { backgroundColor: scheme.color }]} />
                <View style={styles.colorSchemeTextContainer}>
                  <Text style={[styles.colorText, { color: colors.text }]}>{scheme.name}</Text>
                  <Text style={[styles.colorDescription, { color: colors.textSecondary }]}>{scheme.description}</Text>
                </View>
                {selectedColorScheme === scheme.value && (
                  <View style={[styles.colorCheckmark, { backgroundColor: scheme.color }]}>
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      <View style={[styles.previewSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>
        
        <View style={styles.previewContainer}>
          <View style={[styles.previewHeader, { backgroundColor: colors.primary }]}>
            <Text style={styles.previewHeaderText}>Header</Text>
          </View>
          
          <View style={[styles.previewContent, { backgroundColor: colors.background }]}>
            <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Card Title</Text>
              <Text style={[styles.previewDescription, { color: colors.textSecondary }]}>
                This is how your content will look with the selected theme and color scheme.
              </Text>
              <TouchableOpacity style={[styles.previewButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.previewButtonText}>Button</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.currentSettingsContainer}>
        <Text style={[styles.currentSettingsText, { color: colors.textSecondary }]}>
          Current settings: {theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"} theme, {currentColorScheme.charAt(0).toUpperCase() + currentColorScheme.slice(1)} color scheme
        </Text>
      </View>
      
      <Button
        title="Save and Apply Theme"
        onPress={handleSaveTheme}
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
      />
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowSuccessModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.successIconContainer, { backgroundColor: colors.primary }]}>
              <Check size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.successText, { color: colors.text }]}>Theme Updated</Text>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeOption: {
    width: "30%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 12,
    alignItems: "center",
  },
  selectedTheme: {
    borderWidth: 2,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  themeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSchemesContainer: {
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  colorSchemes: {
    flexDirection: "column",
  },
  colorScheme: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedColorScheme: {
    borderWidth: 2,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  colorSchemeTextContainer: {
    flex: 1,
  },
  colorText: {
    fontSize: 16,
    fontWeight: "500",
  },
  colorDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  colorCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  previewSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  previewHeader: {
    padding: 16,
    alignItems: "center",
  },
  previewHeaderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  previewContent: {
    padding: 16,
  },
  previewCard: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  previewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  previewButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "70%",
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
  },
  currentSettingsContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  currentSettingsText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});