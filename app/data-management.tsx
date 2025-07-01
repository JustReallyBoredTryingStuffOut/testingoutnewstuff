import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, SafeAreaView } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { Stack, useRouter } from 'expo-router';
import { useAiStore } from '@/store/aiStore';
import { useHealthStore } from '@/store/healthStore';
import { useMacroStore } from '@/store/macroStore';
import { usePhotoStore } from '@/store/photoStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useSecureStore } from '@/store/secureStore';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react-native";

// Handle conditional import for expo-sharing (not available on web)
let Sharing: any = null;
if (Platform.OS !== 'web') {
  import('expo-sharing').then(module => {
    Sharing = module;
  }).catch(err => {
    console.warn('expo-sharing is not available:', err);
  });
}

export default function DataManagement() {
  const router = useRouter();
  const { theme, colorScheme } = useThemeStore();
  const currentTheme = theme === "system" ? "light" : theme;
  const colors = getColors(currentTheme, colorScheme);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCleaningCache, setIsCleaningCache] = useState(false);
  
  // Get all stores
  const aiStore = useAiStore();
  const healthStore = useHealthStore();
  const macroStore = useMacroStore();
  const photoStore = usePhotoStore();
  const workoutStore = useWorkoutStore();
  const notificationStore = useNotificationStore();
  const themeStore = useThemeStore();
  const secureStore = useSecureStore();
  
  const exportData = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Data export is not available on web.');
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Collect all data
      const exportData = {
        goals: aiStore.goals,
        chats: aiStore.chats,
        weightLogs: healthStore.weightLogs,
        stepLogs: healthStore.stepLogs,
        activityLogs: healthStore.activityLogs,
        healthGoals: healthStore.healthGoals,
        macroLogs: macroStore.macroLogs,
        macroGoals: macroStore.macroGoals,
        userProfile: macroStore.userProfile,
        foodPhotos: photoStore.foodPhotos.map(photo => ({
          ...photo,
          uri: 'PHOTO_URI_REMOVED_FOR_EXPORT' // Don't export actual photo URIs
        })),
        progressPhotos: photoStore.progressPhotos.map(photo => ({
          ...photo,
          uri: 'PHOTO_URI_REMOVED_FOR_EXPORT' // Don't export actual photo URIs
        })),
        exercises: workoutStore.exercises,
        workouts: workoutStore.workouts,
        workoutLogs: workoutStore.workoutLogs,
        scheduledWorkouts: workoutStore.scheduledWorkouts,
        notificationSettings: notificationStore.settings,
        themeSettings: {
          theme: themeStore.theme,
          colorScheme: themeStore.colorScheme
        },
        exportDate: new Date().toISOString(),
      };
      
      // Create a JSON file
      const exportDir = `${FileSystem.documentDirectory}exports/`;
      const exportDirInfo = await FileSystem.getInfoAsync(exportDir);
      if (!exportDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(exportDir, { intermediates: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileUri = `${exportDir}fitness_data_export_${timestamp}.json`;
      
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(exportData, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      
      // Share the file
      if (Sharing && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'There was an error exporting your data.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const deleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all your data? This action cannot be undone and will securely wipe all your personal information.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDeleteAllData
        }
      ]
    );
  };
  
  const confirmDeleteAllData = async () => {
    setIsDeleting(true);
    
    try {
      // Use the secure wipe function from secureStore
      await secureStore.secureWipeAllData();
      
      // Also delete all photos
      await photoStore.deleteAllPhotos();
      
      Alert.alert(
        'Data Deleted',
        'All your data has been securely deleted. The app will now restart.',
        [
          { 
            text: 'OK',
            onPress: () => {
              // Navigate back to the home screen
              router.replace('/');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting data:', error);
      Alert.alert('Delete Failed', 'There was an error deleting your data.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cleanupCache = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Cache cleanup is not available on web.');
      return;
    }
    
    setIsCleaningCache(true);
    
    try {
      // Clean up temporary decrypted files
      await photoStore.cleanupTempFiles();
      
      // Clean up cache directory
      if (FileSystem.cacheDirectory) {
        const cacheContents = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
        let deletedCount = 0;
        
        for (const item of cacheContents) {
          // Skip system files and directories
          if (item.startsWith('.') || item === 'temp_decrypted') continue;
          
          try {
            await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true });
            deletedCount++;
          } catch (error) {
            console.warn(`Could not delete cache item ${item}:`, error);
          }
        }
        
        Alert.alert(
          'Cache Cleaned',
          `Successfully cleaned up ${deletedCount} cached files and temporary decrypted images.`
        );
      }
    } catch (error) {
      console.error('Error cleaning cache:', error);
      Alert.alert('Cleanup Failed', 'There was an error cleaning the cache.');
    } finally {
      setIsCleaningCache(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Data Management",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      
      {/* Prominent back button at the top for better visibility */}
      <TouchableOpacity 
        onPress={handleGoBack}
        style={[styles.prominentBackButton, { backgroundColor: colors.primary }]}
        accessibilityLabel="Go back to previous screen"
        accessibilityRole="button"
      >
        <ArrowLeft size={20} color="#FFFFFF" />
        <Text style={styles.prominentBackButtonText}>Back to Profile</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>Data Management</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            Manage your personal data stored in this app. Your data is encrypted and stored locally on your device.
          </Text>
          
          <View style={[styles.securityInfoCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Shield size={24} color={colors.primary} style={styles.securityIcon} />
            <Text style={[styles.securityTitle, { color: colors.text }]}>Your Data Privacy</Text>
            <Text style={[styles.securityText, { color: colors.textSecondary }]}>
              • All photos are encrypted using AES-GCM encryption
            </Text>
            <Text style={[styles.securityText, { color: colors.textSecondary }]}>
              • Data is stored locally on your device only
            </Text>
            <Text style={[styles.securityText, { color: colors.textSecondary }]}>
              • When you delete data, it is securely wiped
            </Text>
          </View>
          
          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Export Your Data</Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Export all your data in JSON format. This includes your profile, workouts, nutrition logs, and health data.
              Photos will not be included in the export.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={exportData}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Export Data</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Clean Temporary Files</Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Remove temporary decrypted photos and cached files to free up space. This won't delete your actual data.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.secondary }]}
              onPress={cleanupCache}
              disabled={isCleaningCache}
            >
              {isCleaningCache ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Clean Cache</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={[styles.card, styles.dangerCard, { borderColor: colors.error, backgroundColor: colors.card }]}>
            <View style={styles.dangerHeaderContainer}>
              <AlertTriangle size={24} color={colors.error} />
              <Text style={[styles.cardTitle, styles.dangerTitle, { color: colors.error }]}>Delete All Data</Text>
            </View>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Permanently delete all your data from this app. This action cannot be undone.
              All your profile information, workouts, logs, and photos will be securely wiped.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.error }]}
              onPress={deleteAllData}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Delete All Data</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/privacy-policy')}
          >
            <Text style={[styles.link, { color: colors.primary }]}>View Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  securityInfoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  securityIcon: {
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  securityText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dangerCard: {
    marginTop: 24,
  },
  dangerHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  dangerTitle: {
    marginLeft: 8,
    marginBottom: 0,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  prominentBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 16,
    marginBottom: 0,
  },
  prominentBackButtonText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
});