import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGamificationStore } from '@/store/gamificationStore';

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const { onboardingCompleted } = useGamificationStore();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        setIsFirstLaunch(hasLaunched === null);
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  // If still checking first launch status, don't redirect yet
  if (isFirstLaunch === null) {
    return null;
  }

  // If it's the first launch or onboarding is not completed, show the welcome screen
  if (isFirstLaunch || !onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, go to the tabs
  return <Redirect href="/(tabs)" />;
}