import { NativeModules, Platform } from 'react-native';

/**
 * Production HealthKit module bridge
 * 
 * This module provides a bridge to the native HealthKit framework on iOS.
 * NO MOCK DATA - Production ready implementation
 */

// Error codes for better error handling
const ERROR_CODES = {
  NOT_AVAILABLE: 'HEALTHKIT_NOT_AVAILABLE',
  PERMISSION_DENIED: 'HEALTHKIT_PERMISSION_DENIED',
  DATA_FETCH_ERROR: 'HEALTHKIT_DATA_FETCH_ERROR',
  INVALID_PARAMETERS: 'HEALTHKIT_INVALID_PARAMETERS',
  UNKNOWN_ERROR: 'HEALTHKIT_UNKNOWN_ERROR',
};

// Get the native HealthKit module
const { HealthKitModule } = NativeModules;

// Validate native module availability
if (!HealthKitModule) {
  console.error('[HealthKit] Native HealthKit module not found!');
  console.error('[HealthKit] Available native modules:', Object.keys(NativeModules));
}

// Production HealthKit interface - NO MOCK DATA
const HealthKit = {
  /**
   * Check if HealthKit is available on this device
   */
  async isHealthDataAvailable() {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.isHealthDataAvailable) {
      throw new Error('HealthKit.isHealthDataAvailable method is not available');
    }

    try {
      return await HealthKitModule.isHealthDataAvailable();
    } catch (error) {
      console.error('[HealthKit] Error checking health data availability:', error);
      throw error;
    }
  },

  /**
   * Request authorization for health data types
   */
  async requestAuthorization(dataTypes) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.requestAuthorization) {
      throw new Error('HealthKit.requestAuthorization method is not available');
    }

    if (!dataTypes || !Array.isArray(dataTypes)) {
      throw new Error('dataTypes parameter must be a non-empty array');
    }

    try {
      return await HealthKitModule.requestAuthorization(dataTypes);
    } catch (error) {
      console.error('[HealthKit] Error requesting authorization:', error);
      throw error;
    }
  },

  /**
   * Get step count for a date range
   */
  async getStepCount(startDate, endDate) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getStepCount) {
      throw new Error('HealthKit.getStepCount method is not available');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    try {
      return await HealthKitModule.getStepCount(startDate, endDate);
    } catch (error) {
      console.error('[HealthKit] Error getting step count:', error);
      throw error;
    }
  },

  /**
   * Get walking distance for a date range
   */
  async getDistanceWalking(startDate, endDate) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getDistanceWalking) {
      throw new Error('HealthKit.getDistanceWalking method is not available');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    try {
      return await HealthKitModule.getDistanceWalking(startDate, endDate);
    } catch (error) {
      console.error('[HealthKit] Error getting distance:', error);
      throw error;
    }
  },

  /**
   * Get active energy burned for a date range
   */
  async getActiveEnergyBurned(startDate, endDate) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getActiveEnergyBurned) {
      throw new Error('HealthKit.getActiveEnergyBurned method is not available');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    try {
      return await HealthKitModule.getActiveEnergyBurned(startDate, endDate);
    } catch (error) {
      console.error('[HealthKit] Error getting active energy burned:', error);
      throw error;
    }
  },

  /**
   * Get heart rate samples for a date range
   */
  async getHeartRateSamples(startDate, endDate) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getHeartRateSamples) {
      throw new Error('HealthKit.getHeartRateSamples method is not available');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    try {
      return await HealthKitModule.getHeartRateSamples(startDate, endDate);
    } catch (error) {
      console.error('[HealthKit] Error getting heart rate samples:', error);
      throw error;
    }
  },

  /**
   * Get sleep analysis for a date range
   */
  async getSleepAnalysis(startDate, endDate) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getSleepAnalysis) {
      throw new Error('HealthKit.getSleepAnalysis method is not available');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    try {
      return await HealthKitModule.getSleepAnalysis(startDate, endDate);
    } catch (error) {
      console.error('[HealthKit] Error getting sleep analysis:', error);
      throw error;
    }
  },

  /**
   * Get workouts for a date range
   */
  async getWorkouts(startDate, endDate) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getWorkouts) {
      throw new Error('HealthKit.getWorkouts method is not available');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    try {
      return await HealthKitModule.getWorkouts(startDate, endDate);
    } catch (error) {
      console.error('[HealthKit] Error getting workouts:', error);
      throw error;
    }
  },

  /**
   * Observe step count changes
   */
  observeStepCount(callback) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.observeStepCount) {
      throw new Error('HealthKit.observeStepCount method is not available');
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    try {
      return HealthKitModule.observeStepCount(callback);
    } catch (error) {
      console.error('[HealthKit] Error setting up step count observer:', error);
      throw error;
    }
  },

  /**
   * Write workout data
   */
  async writeWorkout(workoutType, startDate, endDate, totalEnergyBurned, totalDistance) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.writeWorkout) {
      throw new Error('HealthKit.writeWorkout method is not available');
    }

    try {
      return await HealthKitModule.writeWorkout(workoutType, startDate, endDate, totalEnergyBurned, totalDistance);
    } catch (error) {
      console.error('[HealthKit] Error writing workout:', error);
      throw error;
    }
  },

  /**
   * Get biological sex
   */
  async getBiologicalSex() {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getBiologicalSex) {
      throw new Error('HealthKit.getBiologicalSex method is not available');
    }

    try {
      return await HealthKitModule.getBiologicalSex();
    } catch (error) {
      console.error('[HealthKit] Error getting biological sex:', error);
      throw error;
    }
  },

  /**
   * Get body mass (weight) samples for a date range
   */
  async getBodyMass(startDate, endDate) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getBodyMass) {
      throw new Error('HealthKit.getBodyMass method is not available');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    try {
      return await HealthKitModule.getBodyMass(startDate, endDate);
    } catch (error) {
      console.error('[HealthKit] Error getting body mass:', error);
      throw error;
    }
  },

  /**
   * Write body mass (weight) to HealthKit
   */
  async writeBodyMass(weight, date) {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.writeBodyMass) {
      throw new Error('HealthKit.writeBodyMass method is not available');
    }

    if (typeof weight !== 'number' || weight <= 0) {
      throw new Error('Weight must be a positive number');
    }

    if (!date) {
      throw new Error('Date is required');
    }

    try {
      return await HealthKitModule.writeBodyMass(weight, date);
    } catch (error) {
      console.error('[HealthKit] Error writing body mass:', error);
      throw error;
    }
  },

  /**
   * Get date of birth
   */
  async getDateOfBirth() {
    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit is only available on iOS devices');
    }

    if (!HealthKitModule) {
      throw new Error('HealthKit native module is not available');
    }

    if (!HealthKitModule.getDateOfBirth) {
      throw new Error('HealthKit.getDateOfBirth method is not available');
    }

    try {
      return await HealthKitModule.getDateOfBirth();
    } catch (error) {
      console.error('[HealthKit] Error getting date of birth:', error);
      throw error;
    }
  }
};

export default HealthKit;