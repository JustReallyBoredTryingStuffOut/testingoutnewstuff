import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Lock, 
  Shield, 
  FileText, 
  Trash2, 
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore } from "@/store/photoStore";
import Button from "@/components/Button";

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { encryptionEnabled, toggleEncryption } = usePhotoStore();
  
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [dataCollection, setDataCollection] = useState(false);
  
  const handleToggleEncryption = (value: boolean) => {
    if (!value) {
      // Show warning when disabling encryption
      Alert.alert(
        "Disable Encryption?",
        "Disabling encryption will make your photos less secure. New photos will be stored without encryption. Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {}
          },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => toggleEncryption(false)
          }
        ]
      );
    } else {
      toggleEncryption(true);
    }
  };
  
  const handleToggleBiometric = (value: boolean) => {
    // This would normally request biometric permission
    setBiometricAuth(value);
  };
  
  const handleToggleDataCollection = (value: boolean) => {
    setDataCollection(value);
  };
  
  const handleDeleteAllData = () => {
    Alert.alert(
      "Delete All Data",
      "This will permanently delete all your photos and personal data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => {
            // This would normally delete all data
            Alert.alert("Data Deleted", "All your data has been permanently deleted.");
          }
        }
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
          title: "Privacy & Security",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Lock size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Encrypt Photos</Text>
                <Text style={styles.settingDescription}>
                  Encrypt all photos stored on your device
                </Text>
              </View>
            </View>
            <Switch
              value={encryptionEnabled}
              onValueChange={handleToggleEncryption}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Shield size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>
                  Require Face ID / Touch ID to view photos
                </Text>
              </View>
            </View>
            <Switch
              value={biometricAuth}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Eye size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Local Storage Only</Text>
                <Text style={styles.settingDescription}>
                  All your data is stored only on your device
                </Text>
              </View>
            </View>
            <Text style={styles.enabledText}>Enabled</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <EyeOff size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Anonymous Usage Data</Text>
                <Text style={styles.settingDescription}>
                  Share anonymous usage statistics to improve the app
                </Text>
              </View>
            </View>
            <Switch
              value={dataCollection}
              onValueChange={handleToggleDataCollection}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => router.push("/privacy-policy")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <FileText size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>
                  Read our privacy policy
                </Text>
              </View>
            </View>
            <ArrowLeft size={20} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dangerSection}>
          <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
          
          <View style={styles.dangerCard}>
            <View style={styles.dangerHeader}>
              <AlertTriangle size={20} color={colors.error} />
              <Text style={styles.dangerTitle}>Delete All Data</Text>
            </View>
            
            <Text style={styles.dangerDescription}>
              This will permanently delete all your photos, progress data, and settings. This action cannot be undone.
            </Text>
            
            <Button
              title="Delete All My Data"
              onPress={handleDeleteAllData}
              icon={<Trash2 size={18} color="#FFFFFF" />}
              variant="danger"
              style={styles.dangerButton}
            />
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  enabledText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  dangerSection: {
    padding: 16,
  },
  dangerSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.error,
    marginBottom: 16,
  },
  dangerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
});