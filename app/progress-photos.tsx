import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Alert,
  Platform,
  AppState,
  AppStateStatus
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Camera, Plus, Trash2, X, ArrowLeft, Lock } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore, ProgressPhoto } from "@/store/photoStore";
import { useHealthStore } from "@/store/healthStore";
import ProgressPhotoCapture from "@/components/ProgressPhotoCapture";
import Button from "@/components/Button";
import EncryptedImage from "@/components/EncryptedImage";
import { cleanupTempDecryptedFiles } from "@/utils/fileEncryption";

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const { progressPhotos, addProgressPhoto, deleteProgressPhoto } = usePhotoStore();
  const { calculateWeightProgress } = useHealthStore();
  
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProgressPhoto["category"]>("front");
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  
  const weightProgress = calculateWeightProgress();
  
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
  const photosByDate = progressPhotos.reduce((acc, photo) => {
    const date = new Date(photo.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, ProgressPhoto[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(photosByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  
  const handleAddPhoto = (category: ProgressPhoto["category"]) => {
    setSelectedCategory(category);
    setShowCaptureModal(true);
  };
  
  const handlePhotoTaken = async (photo: ProgressPhoto) => {
    await addProgressPhoto(photo);
    setShowCaptureModal(false);
  };
  
  const handleDeletePhoto = (photo: ProgressPhoto) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo? The photo will be securely wiped from your device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteProgressPhoto(photo.id);
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
          title: "Progress Photos",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Track Your Progress</Text>
        <Text style={styles.subtitle}>
          Take photos regularly to visualize your fitness journey
        </Text>
        <View style={styles.securityContainer}>
          <Lock size={12} color={colors.primary} />
          <Text style={styles.securityNote}>
            Photos are encrypted and stored locally for your privacy
          </Text>
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => handleAddPhoto("front")}
        >
          <View style={styles.categoryIcon}>
            <Camera size={24} color={colors.primary} />
          </View>
          <Text style={styles.categoryText}>Front</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => handleAddPhoto("side")}
        >
          <View style={styles.categoryIcon}>
            <Camera size={24} color={colors.primary} />
          </View>
          <Text style={styles.categoryText}>Side</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => handleAddPhoto("back")}
        >
          <View style={styles.categoryIcon}>
            <Camera size={24} color={colors.primary} />
          </View>
          <Text style={styles.categoryText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      {progressPhotos.length > 0 ? (
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
                      fallbackUri="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    />
                    <View style={styles.photoInfo}>
                      <Text style={styles.photoCategory}>{photo.category}</Text>
                      <Text style={styles.photoWeight}>{photo.weight} kg</Text>
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
          <Text style={styles.emptyTitle}>No Progress Photos</Text>
          <Text style={styles.emptyText}>
            Take photos regularly to track your physical changes over time
          </Text>
          <Button
            title="Take Your First Photo"
            onPress={() => handleAddPhoto("front")}
            icon={<Plus size={18} color="#FFFFFF" />}
            style={styles.emptyButton}
          />
        </View>
      )}
      
      {/* Photo Capture Modal */}
      <Modal
        visible={showCaptureModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ProgressPhotoCapture
          category={selectedCategory}
          weight={weightProgress.currentWeight}
          onPhotoTaken={handlePhotoTaken}
          onCancel={() => setShowCaptureModal(false)}
        />
      </Modal>
      
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
                  {selectedPhoto.category} View
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
                fallbackUri="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              />
              
              <View style={styles.photoDetailInfo}>
                <View style={styles.photoDetailItem}>
                  <Text style={styles.photoDetailLabel}>Date:</Text>
                  <Text style={styles.photoDetailValue}>
                    {new Date(selectedPhoto.date).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.photoDetailItem}>
                  <Text style={styles.photoDetailLabel}>Weight:</Text>
                  <Text style={styles.photoDetailValue}>{selectedPhoto.weight} kg</Text>
                </View>
                
                {selectedPhoto.notes && (
                  <View style={styles.photoDetailNotes}>
                    <Text style={styles.photoDetailLabel}>Notes:</Text>
                    <Text style={styles.photoDetailValue}>{selectedPhoto.notes}</Text>
                  </View>
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
    paddingBottom: 8,
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
  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  securityNote: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontStyle: "italic",
  },
  categoriesContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryButton: {
    flex: 1,
    alignItems: "center",
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
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
    width: "33.33%",
    padding: 6,
  },
  photoThumbnail: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  photoInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  photoCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  photoWeight: {
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
    textTransform: "capitalize",
  },
  photoDetailClose: {
    padding: 4,
  },
  photoDetailImage: {
    width: "100%",
    height: 300,
  },
  photoDetailInfo: {
    padding: 16,
  },
  photoDetailItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  photoDetailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    width: 80,
  },
  photoDetailValue: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  photoDetailNotes: {
    marginTop: 8,
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