import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import GdprConsentModal from './GdprConsentModal';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { theme, colorScheme } = useThemeStore();
  const currentTheme = theme === "system" ? "light" : theme;
  const colors = getColors(currentTheme, colorScheme);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = async () => {
    try {
      const consentGiven = await AsyncStorage.getItem('gdpr-consent');
      if (consentGiven === null) {
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Error checking consent status:', error);
    }
  };

  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem('gdpr-consent', 'true');
      setShowBanner(false);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await AsyncStorage.setItem('gdpr-consent', 'false');
      setShowBanner(false);
      setShowModal(false);
      
      // Show limited functionality message or navigate to a page explaining limitations
      alert('Some features may be limited without consent to data processing.');
    } catch (error) {
      console.error('Error saving consent rejection:', error);
    }
  };

  const openPrivacyPolicy = () => {
    router.push('/privacy-policy');
  };

  if (!showBanner) return null;

  return (
    <>
      <View style={[styles.banner, { backgroundColor: colors.card }]}>
        <Text style={[styles.bannerText, { color: colors.text }]}>
          We value your privacy. This app collects data to enhance your fitness experience.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleAccept}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => setShowModal(true)}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>More Info</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.linkButton} onPress={openPrivacyPolicy}>
          <Text style={[styles.link, { color: colors.primary }]}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      
      {showModal && (
        <GdprConsentModal 
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    zIndex: 1000,
  },
  bannerText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 4,
  },
  link: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});