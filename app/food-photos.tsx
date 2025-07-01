import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Alert,
  AppState,
  AppStateStatus
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Camera, Plus, Trash2, X, ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore, FoodPhoto } from "@/store/photoStore";
import Button from "@/components/Button";
import EncryptedImage from "@/components/EncryptedImage";
import { cleanupTempDecryptedFiles } from "@/utils/fileEncryption";

export default function FoodPhotosScreen() {
  const router = useRouter();
  const { foodPhotos, deleteFoodPhoto } = usePhotoStore();
  
  const [selectedPhoto, setSelectedPhoto] = useState<FoodPhoto | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Clean up temp files when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
      // Also clean up when component unmounts
      cleanupTempDecryptedFiles().catch(err => 
        console.warn('Error cleaning up temp files on unmount:', err)
      );
    };
  }, []);
  
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      // App is going to background, clean up temp files
      cleanupTempDecryptedFiles().catch(err => 
        console.warn('Error cleaning up temp files on background:', err)
      );
    }
    
    setAppState(nextAppState);
  };
  
  // Group photos by date
  const photosByDate = foodPhotos.reduce((acc, photo) => {
    const date = new Date(photo.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, FoodPhoto[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(photosByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  
  const handleDeletePhoto = (photo: FoodPhoto) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this food photo? The photo will be securely wiped from your device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteFoodPhoto(photo.id);
            setSelectedPhoto(null);
          },
          style: "destructive",
        },
      ]
    );
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Food Photos",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Food Photo Log</Text>
        <Text style={styles.subtitle}>
          Track your meals visually with nutritional analysis
        </Text>
        <Text style={styles.securityNote}>
          Photos are encrypted and stored locally for your privacy
        </Text>
      </View>
      
      {foodPhotos.length > 0 ? (
        <ScrollView style={styles.photosContainer}>
          {sortedDates.map((date) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateTitle}>{date}</Text>
              
              <View style={styles.photosGrid}>
                {photosByDate[date].map((photo) => (
                  <TouchableOpacity 
                    key={photo.id} 
                    style={styles.photoItem}
                    onPress={() => setSelectedPhoto(photo)}
                  >
                    <EncryptedImage 
                      uri={photo.uri} 
                      style={styles.photoThumbnail}
                      fallbackUri="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    />
                    <View style={styles.photoInfo}>
                      <Text style={styles.photoName} numberOfLines={1}>
                        {photo.name}
                      </Text>
                      <Text style={styles.photoCalories}>
                        {photo.calories} kcal
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Camera size={40} color={colors.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No Food Photos</Text>
          <Text style={styles.emptyText}>
            Take photos of your meals to automatically analyze their nutritional content
          </Text>
          <Button
            title="Analyze Food"
            onPress={() => router.push("/capture-food")}
            icon={<Plus size={18} color="#FFFFFF" />}
            style={styles.emptyButton}
          />
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push("/capture-food")}
      >
        <Camera size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Photo Detail Modal */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onDismiss={() => {
          // Clean up temp files when modal is dismissed
          cleanupTempDecryptedFiles().catch(err => 
            console.warn('Error cleaning up temp files on modal dismiss:', err)
          );
        }}
      >
        {selectedPhoto && (
          <View style={styles.photoDetailOverlay}>
            <View style={styles.photoDetailContainer}>
              <View style={styles.photoDetailHeader}>
                <Text style={styles.photoDetailTitle}>
                  {selectedPhoto.name}
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setSelectedPhoto(null);
                    // Clean up temp files when closing modal
                    cleanupTempDecryptedFiles().catch(err => 
                      console.warn('Error cleaning up temp files on modal close:', err)
                    );
                  }}
                  style={styles.photoDetailClose}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <EncryptedImage 
                uri={selectedPhoto.uri} 
                style={styles.photoDetailImage} 
                resizeMode="contain"
                fallbackUri="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              />
              
              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{selectedPhoto.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{selectedPhoto.protein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{selectedPhoto.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{selectedPhoto.fat}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
              
              <View style={styles.photoDetailInfo}>
                <Text style={styles.photoDetailDate}>
                  {new Date(selectedPhoto.date).toLocaleString()}
                </Text>
                
                {selectedPhoto.notes && (
                  <Text style={styles.photoDetailNotes}>
                    {selectedPhoto.notes}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeletePhoto(selectedPhoto)}
              >
                <Trash2 size={20} color={colors.error} />
                <Text style={styles.deleteText}>Delete Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  securityNote: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 8,
    fontStyle: "italic",
  },
  photosContainer: {
    flex: 1,
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  photoItem: {
    width: "50%",
    padding: 6,
  },
  photoThumbnail: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  photoInfo: {
    padding: 8,
  },
  photoName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  photoCalories: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    width: 200,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  photoDetailOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoDetailContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    overflow: "hidden",
  },
  photoDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  photoDetailTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  photoDetailClose: {
    padding: 4,
  },
  photoDetailImage: {
    width: "100%",
    height: 200,
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  nutritionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  photoDetailInfo: {
    padding: 16,
  },
  photoDetailDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  photoDetailNotes: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteText: {
    fontSize: 16,
    color: colors.error,
    marginLeft: 8,
  },
  backButton: {
    padding: 8,
  },
});