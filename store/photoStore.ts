import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Conditionally import RNFS only for native platforms
let RNFS: any = null;
if (Platform.OS !== "web") {
  try {
    RNFS = require('react-native-fs');
  } catch (error) {
    console.warn('react-native-fs not available:', error);
  }
}
import { 
  encryptAndSavePhoto, 
  deleteEncryptedPhoto, 
  ENCRYPTED_PHOTOS_DIR,
  setupEncryptedPhotoDirectory,
  cleanupTempDecryptedFiles,
  deleteAllEncryptedPhotos,
  verifyEncryptedFile,
  reEncryptFile
} from "@/utils/fileEncryption";
import { secureDeleteFile, secureDeleteDirectory, secureDeleteFileWithMetadata } from "@/utils/secureDelete";

export type FoodPhoto = {
  id: string;
  uri: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  isAnalyzed: boolean;
};

export type ProgressPhoto = {
  id: string;
  uri: string;
  date: string;
  weight: number;
  notes: string;
  category: "front" | "side" | "back" | "other";
};

export type MediaType = {
  id: string;
  uri: string;
  type: "image" | "gif";
  date: string;
  workoutId?: string;
  notes?: string;
};

interface PhotoState {
  foodPhotos: FoodPhoto[];
  progressPhotos: ProgressPhoto[];
  workoutMedia: MediaType[];
  encryptionEnabled: boolean;
  lastEncryptionCheck: string | null;
  
  // Actions
  addFoodPhoto: (photo: FoodPhoto) => Promise<void>;
  updateFoodPhoto: (photo: FoodPhoto) => Promise<void>;
  deleteFoodPhoto: (id: string) => Promise<void>;
  
  addProgressPhoto: (photo: ProgressPhoto) => Promise<void>;
  updateProgressPhoto: (photo: ProgressPhoto) => Promise<void>;
  deleteProgressPhoto: (id: string) => Promise<void>;
  
  // Media functions
  addWorkoutMedia: (media: MediaType) => Promise<void>;
  updateWorkoutMedia: (media: MediaType) => Promise<void>;
  deleteWorkoutMedia: (id: string) => Promise<void>;
  
  // Encryption settings
  toggleEncryption: (enabled: boolean) => void;
  verifyEncryptedPhotos: () => Promise<{total: number, valid: number, invalid: number}>;
  reEncryptPhotos: () => Promise<{total: number, success: number, failed: number}>;
  
  // Helpers
  getFoodPhotosByDate: (date: string) => FoodPhoto[];
  getProgressPhotosByDate: (date: string) => ProgressPhoto[];
  getProgressPhotosByCategory: (category: ProgressPhoto["category"]) => ProgressPhoto[];
  getWorkoutMediaByWorkoutId: (workoutId: string) => MediaType[];
  isGifUrl: (url: string) => boolean;
  
  // Data management
  deleteAllPhotos: () => Promise<void>;
  cleanupTempFiles: () => Promise<void>;
  exportPhotoMetadata: () => Promise<string>;
}

// Create photo directory if it doesn't exist
const setupPhotoDirectories = async () => {
  if (Platform.OS === "web" || !RNFS) return;
  
  try {
  const photoDir = `${RNFS.DocumentDirectoryPath}/photos/`;
  const foodPhotoDir = `${photoDir}food/`;
  const progressPhotoDir = `${photoDir}progress/`;
  const workoutMediaDir = `${photoDir}workout/`;
  
  const photoDirExists = await RNFS.exists(photoDir);
  if (!photoDirExists) {
    await RNFS.mkdir(photoDir);
  }
  
  const foodDirExists = await RNFS.exists(foodPhotoDir);
  if (!foodDirExists) {
    await RNFS.mkdir(foodPhotoDir);
  }
  
  const progressDirExists = await RNFS.exists(progressPhotoDir);
  if (!progressDirExists) {
    await RNFS.mkdir(progressPhotoDir);
  }
  
  const workoutDirExists = await RNFS.exists(workoutMediaDir);
  if (!workoutDirExists) {
    await RNFS.mkdir(workoutMediaDir);
  }
  
  // Also setup encrypted photos directory
  await setupEncryptedPhotoDirectory();
  } catch (error) {
    console.warn('Error setting up photo directories:', error);
  }
};

// Initialize directories
if (Platform.OS !== "web" && RNFS) {
  setupPhotoDirectories();
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set, get) => ({
      foodPhotos: [],
      progressPhotos: [],
      workoutMedia: [],
      encryptionEnabled: true, // Encryption is enabled by default
      lastEncryptionCheck: null,
      
      toggleEncryption: (enabled) => {
        set({ encryptionEnabled: enabled });
      },
      
      addFoodPhoto: async (photo) => {
        // Only save to filesystem if there's a valid URI (skip for nutrition label scans with empty URI)
        if (Platform.OS !== "web" && RNFS && photo.uri && photo.uri.trim() !== "") {
          try {
            const fileName = `food_${photo.id}.jpg`;
            let newUri;
            
            if (get().encryptionEnabled) {
              // Encrypt and save the photo
              newUri = await encryptAndSavePhoto(photo.uri, fileName);
            } else {
              // Save without encryption (original behavior)
              newUri = `${RNFS.DocumentDirectoryPath}/photos/food/${fileName}`;
              await RNFS.copyFile(photo.uri, newUri);
            }
            
            // Update the URI to point to the saved file
            photo.uri = newUri;
          } catch (error) {
            console.error("Error saving food photo:", error);
          }
        }
        
        set((state) => ({
          foodPhotos: [...state.foodPhotos, photo]
        }));
      },
      
      updateFoodPhoto: async (photo) => {
        set((state) => ({
          foodPhotos: state.foodPhotos.map(p => p.id === photo.id ? photo : p)
        }));
      },
      
      deleteFoodPhoto: async (id) => {
        const { foodPhotos } = get();
        const photoToDelete = foodPhotos.find(p => p.id === id);
        
        if (photoToDelete && Platform.OS !== "web" && RNFS) {
          try {
            if (photoToDelete.uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
              // Use secure deletion for encrypted files
              await deleteEncryptedPhoto(photoToDelete.uri);
            } else {
              // For regular files, use secure deletion with metadata
              await secureDeleteFileWithMetadata(photoToDelete.uri, 3);
            }
          } catch (error) {
            console.error("Error deleting food photo:", error);
          }
        }
        
        set((state) => ({
          foodPhotos: state.foodPhotos.filter(p => p.id !== id)
        }));
      },
      
      addProgressPhoto: async (photo) => {
        // Only save to filesystem if there's a valid URI
        if (Platform.OS !== "web" && RNFS && photo.uri && photo.uri.trim() !== "") {
          try {
            const fileName = `progress_${photo.id}.jpg`;
            let newUri;
            
            if (get().encryptionEnabled) {
              // Encrypt and save the photo
              newUri = await encryptAndSavePhoto(photo.uri, fileName);
            } else {
              // Save without encryption (original behavior)
              newUri = `${RNFS.DocumentDirectoryPath}/photos/progress/${fileName}`;
              await RNFS.copyFile(photo.uri, newUri);
            }
            
            // Update the URI to point to the saved file
            photo.uri = newUri;
          } catch (error) {
            console.error("Error saving progress photo:", error);
          }
        }
        
        set((state) => ({
          progressPhotos: [...state.progressPhotos, photo]
        }));
      },
      
      updateProgressPhoto: async (photo) => {
        set((state) => ({
          progressPhotos: state.progressPhotos.map(p => p.id === photo.id ? photo : p)
        }));
      },
      
      deleteProgressPhoto: async (id) => {
        const { progressPhotos } = get();
        const photoToDelete = progressPhotos.find(p => p.id === id);
        
        if (photoToDelete && Platform.OS !== "web" && RNFS) {
          try {
            if (photoToDelete.uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
              // Use secure deletion for encrypted files
              await deleteEncryptedPhoto(photoToDelete.uri);
            } else {
              // For regular files, use secure deletion with metadata
              await secureDeleteFileWithMetadata(photoToDelete.uri, 3);
            }
          } catch (error) {
            console.error("Error deleting progress photo:", error);
          }
        }
        
        set((state) => ({
          progressPhotos: state.progressPhotos.filter(p => p.id !== id)
        }));
      },
      
      // Media functions
      addWorkoutMedia: async (media) => {
        // Only save to filesystem if it's a valid local file (not a URL or empty) and not on web
        if (Platform.OS !== "web" && RNFS && media.uri && media.uri.trim() !== "" && !media.uri.startsWith("http")) {
          try {
            const extension = get().isGifUrl(media.uri) ? "gif" : "jpg";
            const fileName = `workout_${media.id}.${extension}`;
            let newUri;
            
            if (get().encryptionEnabled) {
              // Encrypt and save the media
              newUri = await encryptAndSavePhoto(media.uri, fileName);
            } else {
              // Save without encryption (original behavior)
              newUri = `${RNFS.DocumentDirectoryPath}/photos/workout/${fileName}`;
              await RNFS.copyFile(media.uri, newUri);
            }
            
            // Update the URI to point to the saved file
            media.uri = newUri;
          } catch (error) {
            console.error("Error saving workout media:", error);
          }
        }
        
        set((state) => ({
          workoutMedia: [...state.workoutMedia, media]
        }));
      },
      
      updateWorkoutMedia: async (media) => {
        set((state) => ({
          workoutMedia: state.workoutMedia.map(m => m.id === media.id ? media : m)
        }));
      },
      
      deleteWorkoutMedia: async (id) => {
        const { workoutMedia } = get();
        const mediaToDelete = workoutMedia.find(m => m.id === id);
        
        if (mediaToDelete && Platform.OS !== "web" && RNFS && !mediaToDelete.uri.startsWith("http")) {
          try {
            if (mediaToDelete.uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
              // Use secure deletion for encrypted files
              await deleteEncryptedPhoto(mediaToDelete.uri);
            } else {
              // For regular files, use secure deletion with metadata
              await secureDeleteFileWithMetadata(mediaToDelete.uri, 3);
            }
          } catch (error) {
            console.error("Error deleting workout media:", error);
          }
        }
        
        set((state) => ({
          workoutMedia: state.workoutMedia.filter(m => m.id !== id)
        }));
      },
      
      // Verify the integrity of encrypted photos
      verifyEncryptedPhotos: async () => {
        if (Platform.OS === "web") {
          return { total: 0, valid: 0, invalid: 0 };
        }
        
        try {
          // Get all encrypted photos
          const { foodPhotos, progressPhotos, workoutMedia } = get();
          
          const encryptedPhotos = [
            ...foodPhotos.filter(p => p.uri.startsWith(ENCRYPTED_PHOTOS_DIR)).map(p => p.uri),
            ...progressPhotos.filter(p => p.uri.startsWith(ENCRYPTED_PHOTOS_DIR)).map(p => p.uri),
            ...workoutMedia.filter(m => m.uri.startsWith(ENCRYPTED_PHOTOS_DIR)).map(m => m.uri)
          ];
          
          let validCount = 0;
          let invalidCount = 0;
          
          // Verify each encrypted photo
          for (const uri of encryptedPhotos) {
            const isValid = await verifyEncryptedFile(uri);
            if (isValid) {
              validCount++;
            } else {
              invalidCount++;
            }
          }
          
          // Update last check timestamp
          set({ lastEncryptionCheck: new Date().toISOString() });
          
          return {
            total: encryptedPhotos.length,
            valid: validCount,
            invalid: invalidCount
          };
        } catch (error) {
          console.error("Error verifying encrypted photos:", error);
          return { total: 0, valid: 0, invalid: 0 };
        }
      },
      
      // Re-encrypt photos with the latest encryption method
      reEncryptPhotos: async () => {
        if (Platform.OS === "web") {
          return { total: 0, success: 0, failed: 0 };
        }
        
        try {
          // Get all encrypted photos
          const { foodPhotos, progressPhotos, workoutMedia } = get();
          
          const encryptedFoodPhotos = foodPhotos.filter(p => p.uri.startsWith(ENCRYPTED_PHOTOS_DIR));
          const encryptedProgressPhotos = progressPhotos.filter(p => p.uri.startsWith(ENCRYPTED_PHOTOS_DIR));
          const encryptedWorkoutMedia = workoutMedia.filter(m => m.uri.startsWith(ENCRYPTED_PHOTOS_DIR));
          
          let successCount = 0;
          let failedCount = 0;
          
          // Re-encrypt food photos
          for (const photo of encryptedFoodPhotos) {
            const newUri = await reEncryptFile(photo.uri);
            if (newUri) {
              // Update the URI in the store
              set((state) => ({
                foodPhotos: state.foodPhotos.map(p => 
                  p.id === photo.id ? { ...p, uri: newUri } : p
                )
              }));
              successCount++;
            } else {
              failedCount++;
            }
          }
          
          // Re-encrypt progress photos
          for (const photo of encryptedProgressPhotos) {
            const newUri = await reEncryptFile(photo.uri);
            if (newUri) {
              // Update the URI in the store
              set((state) => ({
                progressPhotos: state.progressPhotos.map(p => 
                  p.id === photo.id ? { ...p, uri: newUri } : p
                )
              }));
              successCount++;
            } else {
              failedCount++;
            }
          }
          
          // Re-encrypt workout media
          for (const media of encryptedWorkoutMedia) {
            const newUri = await reEncryptFile(media.uri);
            if (newUri) {
              // Update the URI in the store
              set((state) => ({
                workoutMedia: state.workoutMedia.map(m => 
                  m.id === media.id ? { ...m, uri: newUri } : m
                )
              }));
              successCount++;
            } else {
              failedCount++;
            }
          }
          
          // Update last check timestamp
          set({ lastEncryptionCheck: new Date().toISOString() });
          
          return {
            total: encryptedFoodPhotos.length + encryptedProgressPhotos.length + encryptedWorkoutMedia.length,
            success: successCount,
            failed: failedCount
          };
        } catch (error) {
          console.error("Error re-encrypting photos:", error);
          return { total: 0, success: 0, failed: 0 };
        }
      },
      
      getFoodPhotosByDate: (date) => {
        const { foodPhotos } = get();
        return foodPhotos.filter(
          photo => new Date(photo.date).toDateString() === new Date(date).toDateString()
        );
      },
      
      getProgressPhotosByDate: (date) => {
        const { progressPhotos } = get();
        return progressPhotos.filter(
          photo => new Date(photo.date).toDateString() === new Date(date).toDateString()
        );
      },
      
      getProgressPhotosByCategory: (category) => {
        const { progressPhotos } = get();
        return progressPhotos.filter(photo => photo.category === category);
      },
      
      getWorkoutMediaByWorkoutId: (workoutId) => {
        const { workoutMedia } = get();
        return workoutMedia.filter(media => media.workoutId === workoutId);
      },
      
      isGifUrl: (url: string) => {
        // Check if URL ends with .gif or contains giphy or tenor domains
        return url.toLowerCase().endsWith('.gif') || 
               url.includes('giphy.com') || 
               url.includes('tenor.com') ||
               url.includes('gph.is');
      },
      
      // Data management functions
      deleteAllPhotos: async () => {
        if (Platform.OS !== "web" && RNFS) {
          try {
            // Get all photos to delete
            const { foodPhotos, progressPhotos, workoutMedia } = get();
            
            // Delete all encrypted photos at once
            await deleteAllEncryptedPhotos();
            
            // Delete any non-encrypted photos
            const allPhotos = [
              ...foodPhotos.map(p => p.uri),
              ...progressPhotos.map(p => p.uri),
              ...workoutMedia.filter(m => !m.uri.startsWith('http')).map(m => m.uri)
            ];
            
            for (const uri of allPhotos) {
              if (!uri.startsWith(ENCRYPTED_PHOTOS_DIR) && !uri.startsWith('http')) {
                await secureDeleteFileWithMetadata(uri, 3);
              }
            }
            
            // Clean up temp files
            await cleanupTempDecryptedFiles();
            
            // Clean up photo directories
            const photoDir = `${RNFS.DocumentDirectoryPath}/photos/`;
            await secureDeleteDirectory(photoDir, 2);
            await setupPhotoDirectories();
            
            console.log("All photos deleted successfully");
          } catch (error) {
            console.error("Error deleting all photos:", error);
          }
        }
        
        // Clear the store state
        set({
          foodPhotos: [],
          progressPhotos: [],
          workoutMedia: []
        });
      },
      
      cleanupTempFiles: async () => {
        if (Platform.OS !== "web" && RNFS) {
          try {
            await cleanupTempDecryptedFiles();
          } catch (error) {
            console.error("Error cleaning up temp files:", error);
          }
        }
      },
      
      // Export photo metadata (without the actual photos)
      exportPhotoMetadata: async () => {
        const { foodPhotos, progressPhotos, workoutMedia } = get();
        
        // Create metadata objects without the actual image data
        const foodPhotosMeta = foodPhotos.map(photo => ({
          id: photo.id,
          date: photo.date,
          name: photo.name,
          calories: photo.calories,
          protein: photo.protein,
          carbs: photo.carbs,
          fat: photo.fat,
          notes: photo.notes,
          isAnalyzed: photo.isAnalyzed,
          isEncrypted: photo.uri.startsWith(ENCRYPTED_PHOTOS_DIR)
        }));
        
        const progressPhotosMeta = progressPhotos.map(photo => ({
          id: photo.id,
          date: photo.date,
          weight: photo.weight,
          notes: photo.notes,
          category: photo.category,
          isEncrypted: photo.uri.startsWith(ENCRYPTED_PHOTOS_DIR)
        }));
        
        const workoutMediaMeta = workoutMedia.map(media => ({
          id: media.id,
          type: media.type,
          date: media.date,
          workoutId: media.workoutId,
          notes: media.notes,
          isEncrypted: media.uri.startsWith(ENCRYPTED_PHOTOS_DIR) && !media.uri.startsWith('http')
        }));
        
        const metadata = {
          exportDate: new Date().toISOString(),
          foodPhotosCount: foodPhotos.length,
          progressPhotosCount: progressPhotos.length,
          workoutMediaCount: workoutMedia.length,
          encryptionEnabled: get().encryptionEnabled,
          encryptionVersion: 2, // Current encryption version
          lastEncryptionCheck: get().lastEncryptionCheck,
          foodPhotos: foodPhotosMeta,
          progressPhotos: progressPhotosMeta,
          workoutMedia: workoutMediaMeta
        };
        
        return JSON.stringify(metadata, null, 2);
      }
    }),
    {
      name: "photo-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);