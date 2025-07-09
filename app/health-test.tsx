import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, NativeModules, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HealthTestScreen() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testNativeModule = async () => {
    try {
      addResult('=== NATIVE MODULE TEST START ===');
      addResult(`Platform: ${Platform.OS}`);
      addResult(`Available NativeModules: ${Object.keys(NativeModules).join(', ')}`);
      
      const healthKitModule = NativeModules.HealthKitModule;
      addResult(`HealthKitModule exists: ${!!healthKitModule}`);
      
      if (healthKitModule) {
        addResult(`HealthKitModule methods: ${Object.keys(healthKitModule).join(', ')}`);
        addResult(`isHealthDataAvailable exists: ${!!healthKitModule.isHealthDataAvailable}`);
        addResult(`requestAuthorization exists: ${!!healthKitModule.requestAuthorization}`);
        addResult(`getBodyMass exists: ${!!healthKitModule.getBodyMass}`);
        addResult(`writeBodyMass exists: ${!!healthKitModule.writeBodyMass}`);
        
        // Test direct native module call
        try {
          addResult('Testing direct native module call...');
          const directResult = await healthKitModule.isHealthDataAvailable();
          addResult(`Direct native call result: ${directResult}`);
        } catch (directError) {
          addResult(`Direct native call failed: ${directError}`);
        }
      } else {
        addResult('ERROR: HealthKitModule is UNDEFINED!');
        addResult('This means the native module is not properly registered.');
        addResult('You need to rebuild the app with the native code.');
      }
      
      addResult('=== NATIVE MODULE TEST END ===');
    } catch (error: any) {
      addResult(`ERROR: ${error.message}`);
    }
  };

  const testHealthKitImport = async () => {
    try {
      addResult('=== HEALTHKIT IMPORT TEST START ===');
      
      const HealthKit = require('@/src/NativeModules/HealthKit');
      addResult('HealthKit module imported successfully');
      addResult(`HealthKit methods: ${Object.keys(HealthKit).join(', ')}`);
      
      if (HealthKit.isHealthDataAvailable) {
        addResult('isHealthDataAvailable method exists');
        const result = await HealthKit.isHealthDataAvailable();
        addResult(`isHealthDataAvailable result: ${result}`);
      } else {
        addResult('ERROR: isHealthDataAvailable method not found');
      }
      
      if (HealthKit.getBodyMass) {
        addResult('getBodyMass method exists');
      } else {
        addResult('ERROR: getBodyMass method not found');
      }
      
      if (HealthKit.writeBodyMass) {
        addResult('writeBodyMass method exists');
      } else {
        addResult('ERROR: writeBodyMass method not found');
      }
      
      addResult('=== HEALTHKIT IMPORT TEST END ===');
    } catch (error: any) {
      addResult(`ERROR: ${error.message}`);
    }
  };

  const testHealthKitService = async () => {
    try {
      addResult('=== HEALTHKIT SERVICE TEST START ===');
      
      const HealthKitService = require('@/src/services/HealthKitService').default;
      addResult('HealthKitService imported successfully');
      
      // Test initialization
      try {
        const initialized = await HealthKitService.initialize();
        addResult(`HealthKitService initialized: ${initialized}`);
      } catch (error: any) {
        addResult(`HealthKitService initialization failed: ${error.message}`);
      }
      
      // Test authorization
      try {
        const authResult = await HealthKitService.requestAuthorization([
          'steps', 'distance', 'calories', 'weight', 'heartRate'
        ]);
        addResult(`Authorization result: ${authResult}`);
      } catch (error: any) {
        addResult(`Authorization failed: ${error.message}`);
      }
      
      // Test weight functionality
      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const weightSamples = await HealthKitService.getBodyMass(startOfDay, today);
        addResult(`Weight samples retrieved: ${weightSamples.length} samples`);
        
        if (weightSamples.length > 0) {
          addResult(`Latest weight: ${weightSamples[0].value} kg from ${weightSamples[0].source}`);
        }
      } catch (error: any) {
        addResult(`Weight retrieval failed: ${error.message}`);
      }
      
      addResult('=== HEALTHKIT SERVICE TEST END ===');
    } catch (error: any) {
      addResult(`ERROR: ${error.message}`);
    }
  };

  const testWeightWrite = async () => {
    try {
      addResult('=== WEIGHT WRITE TEST START ===');
      
      const HealthKitService = require('@/src/services/HealthKitService').default;
      
      // Test writing weight to HealthKit
      const testWeight = 70.5; // kg
      const testDate = new Date();
      
      try {
        const writeResult = await HealthKitService.writeBodyMass(testWeight, testDate);
        addResult(`Weight write result: ${writeResult}`);
        addResult(`Wrote ${testWeight} kg to HealthKit`);
      } catch (error: any) {
        addResult(`Weight write failed: ${error.message}`);
      }
      
      addResult('=== WEIGHT WRITE TEST END ===');
    } catch (error: any) {
      addResult(`ERROR: ${error.message}`);
    }
  };

  const testStepCount = async () => {
    try {
      addResult('=== STEP COUNT TEST START ===');
      
      const HealthKitService = require('@/src/services/HealthKitService').default;
      
      // Test step count retrieval
      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const steps = await HealthKitService.getStepCount(startOfDay, today);
        addResult(`Today's steps: ${steps}`);
      } catch (error: any) {
        addResult(`Step count retrieval failed: ${error.message}`);
      }
      
      addResult('=== STEP COUNT TEST END ===');
    } catch (error: any) {
      addResult(`ERROR: ${error.message}`);
    }
  };

  const testAllHealthData = async () => {
    try {
      addResult('=== ALL HEALTH DATA TEST START ===');
      
      const HealthKitService = require('@/src/services/HealthKitService').default;
      
      // Test comprehensive health data retrieval
      try {
        const healthData = await HealthKitService.getTodayHealthData();
        addResult(`Health data retrieved successfully:`);
        addResult(`- Steps: ${healthData.steps}`);
        addResult(`- Distance: ${healthData.distance} km`);
        addResult(`- Calories: ${healthData.calories}`);
        addResult(`- Heart rate samples: ${healthData.heartRateSamples.length}`);
        addResult(`- Workouts: ${healthData.workouts.length}`);
      } catch (error: any) {
        addResult(`Health data retrieval failed: ${error.message}`);
      }
      
      addResult('=== ALL HEALTH DATA TEST END ===');
    } catch (error: any) {
      addResult(`ERROR: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        HealthKit Native Module Test
      </Text>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 10 
        }}
        onPress={testNativeModule}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test Native Module
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#34C759', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 10 
        }}
        onPress={testHealthKitImport}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test HealthKit Import
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#FF9500', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 10 
        }}
        onPress={testHealthKitService}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test HealthKit Service
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#AF52DE', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 10 
        }}
        onPress={testWeightWrite}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test Weight Write
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#FF3B30', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 10 
        }}
        onPress={testStepCount}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test Step Count
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#5856D6', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 10 
        }}
        onPress={testAllHealthData}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test All Health Data
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#FF3B30', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 20 
        }}
        onPress={clearResults}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Clear Results
        </Text>
      </TouchableOpacity>
      
      <View style={{ 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 8, 
        minHeight: 400,
        borderWidth: 1,
        borderColor: '#ddd'
      }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Test Results:</Text>
        <View style={{ flex: 1 }}>
          {testResults.map((result, index) => (
            <Text key={index} style={{ fontSize: 12, marginBottom: 2, fontFamily: 'monospace' }}>
              {result}
            </Text>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#666', 
          padding: 15, 
          borderRadius: 8, 
          marginTop: 10 
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Back to Health
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
} 