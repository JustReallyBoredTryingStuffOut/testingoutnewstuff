import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trash2, 
  Share2,
  Lock
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore } from "@/store/photoStore";
import Button from "@/components/Button";
import EncryptedImage from "@/components/EncryptedImage";
import { cleanupTempDecryptedFiles } from "@/utils/fileEncryption";

export default function FoodPhotoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { foodPhotos, deleteFoodPhoto } = usePhotoStore();
  
  const photo = foodPhotos.find(photo => photo.id === id);
  
  // Clean up temp files when component unmounts
  useEffect(() => {
    return () => {
      cleanupTempDecryptedFiles().catch(err => 
        console.warn('Error cleaning up temp files on unmount:', err)
      );
    };
  }, []);
  
  if (!photo) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: "Food Photo",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Photo not found</Text>
          <TouchableOpacity 
            style={styles.backToPhotosButton}
            onPress={() => router.push("/food-photos")}
          >
            <Text style={styles.backToPhotosText}>Back to Food Photos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const handleGoBack = () => {
    // Clean up temp files when navigating away
    cleanupTempDecryptedFiles().catch(err => 
      console.warn('Error cleaning up temp files on navigation:', err)
    );
    router.back();
  };
  
  const handleShare = () => {
    // Share functionality would go here
    Alert.alert(
      "Privacy Notice",
      "This photo is encrypted for your privacy. Sharing will create a temporary unencrypted copy. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Share",
          onPress: () => console.log("Share photo:", photo)
        }
      ]
    );
  };
  
  const handleDelete = () => {
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
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };
  
  const photoDate = new Date(photo.date);
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: photo.name,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <EncryptedImage 
          uri={photo.uri} 
          style={styles.foodImage} 
          resizeMode="cover"
          fallbackUri="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        />
        
        <View style={styles.photoHeader}>
          <Text style={styles.photoName}>{photo.name}</Text>
          
          <View style={styles.dateTimeContainer}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.dateTimeText}>
              {photoDate.toLocaleDateString()}
            </Text>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.dateTimeText}>
              {photoDate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          
          <View style={styles.securityContainer}>
            <Lock size={14} color={colors.primary} />
            <Text style={styles.securityText}>
              This photo is encrypted and stored locally
            </Text>
          </View>
        </View>
        
        <View style={styles.macrosCard}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{photo.calories}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{photo.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{photo.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{photo.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
        
        {photo.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{photo.notes}</Text>
            </View>
          </View>
        )}
        
        <Button
          title="Delete Photo"
          onPress={handleDelete}
          icon={<Trash2 size={18} color="#FFFFFF" />}
          variant="danger"
          style={styles.deleteButton}
        />
      </ScrollView>
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
  foodImage: {
    width: "100%",
    height: 300,
  },
  photoHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  photoName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 12,
  },
  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  securityText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontStyle: "italic",
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
  notesSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  notesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  deleteButton: {
    margin: 16,
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
  backToPhotosButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToPhotosText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});