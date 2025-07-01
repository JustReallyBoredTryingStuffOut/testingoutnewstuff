import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from "react-native";
import { Camera, ArrowLeft, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants/colors";
import { ProgressPhoto } from "@/store/photoStore";
import Button from "@/components/Button";
import NoteInput from "@/components/NoteInput";

// Define CameraType as a string type
type CameraType = "front" | "back";

type ProgressPhotoCaptureProps = {
  category: ProgressPhoto["category"];
  weight: number;
  onPhotoTaken: (photo: ProgressPhoto) => void;
  onCancel: () => void;
};

export default function ProgressPhotoCapture({ 
  category, 
  weight, 
  onPhotoTaken, 
  onCancel 
}: ProgressPhotoCaptureProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera and photo library permissions to use this feature.",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };
  
  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
      
      // For demo purposes, use a placeholder image if camera fails
      if (Platform.OS === "web") {
        setPhoto("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80");
      }
    }
  };
  
  const handleChooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
      
      // For demo purposes, use a placeholder image if gallery fails
      if (Platform.OS === "web") {
        setPhoto("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80");
      }
    }
  };
  
  const handleSave = () => {
    if (!photo) return;
    
    const newProgressPhoto: ProgressPhoto = {
      id: Date.now().toString(),
      uri: photo,
      date: new Date().toISOString(),
      weight,
      notes,
      category
    };
    
    onPhotoTaken(newProgressPhoto);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress Photo</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {!photo ? (
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            <Camera size={48} color={colors.textLight} />
            <Text style={styles.cameraText}>
              Take a {category} view photo to track your progress
            </Text>
            <View style={styles.photoButtonsContainer}>
              <Button 
                title="Take Photo" 
                onPress={handleTakePhoto} 
                style={styles.photoButton}
              />
              <Button 
                title="Choose from Gallery" 
                onPress={handleChooseFromGallery} 
                variant="outline"
                style={styles.photoButton}
              />
            </View>
            
            {/* Added CLOSE button */}
            <Button
              title="CLOSE"
              onPress={onCancel}
              variant="outline"
              style={styles.closeModalButton}
            />
          </View>
        </View>
      ) : (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
          
          <View style={styles.detailsContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{category}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Current Weight:</Text>
              <Text style={styles.infoValue}>{weight} kg</Text>
            </View>
            
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <NoteInput
                initialValue={notes}
                onSave={setNotes}
                placeholder="Add notes about your progress..."
                multiline
              />
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Save Photo" 
              onPress={handleSave} 
              style={styles.saveButton}
            />
            <Button 
              title="Retake Photo" 
              onPress={() => setPhoto(null)} 
              variant="outline"
              style={styles.retakeButton}
            />
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cameraPlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: colors.card,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cameraText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 24,
    textAlign: "center",
  },
  photoButtonsContainer: {
    width: "100%",
    gap: 12,
  },
  photoButton: {
    width: "100%",
  },
  closeModalButton: {
    width: "100%",
    marginTop: 16,
  },
  photoContainer: {
    flex: 1,
    padding: 16,
  },
  photo: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    textTransform: "capitalize",
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    width: "100%",
  },
  retakeButton: {
    width: "100%",
  },
  cancelButton: {
    width: "100%",
  },
});