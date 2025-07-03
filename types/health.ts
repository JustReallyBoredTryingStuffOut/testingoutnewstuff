// Health Module Types
export interface HealthKitAuthorization {
  authorized: boolean;
  dataTypes: string[];
}

export interface HealthKitAuthorizationStatus {
  status: 'notDetermined' | 'denied' | 'authorized' | 'unknown';
}

export interface StepCountResult {
  success: boolean;
  steps: number;
}

export interface HeartRateData {
  value: number;
  startDate: string;
  endDate: string;
  source: string;
}

export interface HeartRateSamplesResult {
  success: boolean;
  samples: HeartRateData[];
}

export interface ActiveEnergyResult {
  success: boolean;
  calories: number;
}

export interface DistanceResult {
  success: boolean;
  distance: number; // in kilometers
}

export interface WorkoutData {
  workoutActivityType: number;
  duration: number; // in seconds
  totalEnergyBurned: number; // in kcal
  totalDistance: number; // in meters
  startDate: string;
  endDate: string;
  source: string;
}

export interface WorkoutsResult {
  success: boolean;
  workouts: WorkoutData[];
}

export interface BiologicalSexResult {
  success: boolean;
  biologicalSex: 'notSet' | 'female' | 'male' | 'other' | 'unknown';
}

export interface DateOfBirthResult {
  success: boolean;
  dateOfBirth: string;
}

// Core Bluetooth Types
export interface BluetoothState {
  state: 'unknown' | 'resetting' | 'unsupported' | 'unauthorized' | 'poweredOff' | 'poweredOn';
}

export interface BluetoothPermissions {
  granted: boolean;
  reason?: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  services: string[];
  manufacturerData: string;
}

export interface BluetoothConnection {
  id: string;
  name: string;
}

export interface BluetoothDisconnection {
  id: string;
  name: string;
  error?: string;
}

export interface BluetoothError {
  id?: string;
  name?: string;
  error: string;
}

export interface BluetoothDataReceived {
  peripheralId: string;
  serviceUUID: string;
  characteristicUUID: string;
  data: string; // base64 encoded
  value: any; // parsed value based on characteristic type
}

// Parsed Bluetooth Data Types
export interface HeartRateBluetoothData {
  heartRate: number;
  sensorContactSupported: boolean;
  sensorContactDetected: boolean;
}

export interface BatteryLevelBluetoothData {
  batteryLevel: number;
}

export interface RSCBluetoothData {
  speed: number; // m/s
  cadence: number; // steps per minute
  strideLength: boolean;
}

// Native Module Interfaces
export interface HealthKitModule {
  isHealthDataAvailable(): Promise<boolean>;
  requestAuthorization(dataTypes: string[]): Promise<HealthKitAuthorization>;
  getStepCount(startDate: string, endDate: string): Promise<StepCountResult>;
  observeStepCount(): Promise<{ observerId: string }>;
  getHeartRateSamples(startDate: string, endDate: string): Promise<HeartRateSamplesResult>;
  getActiveEnergyBurned(startDate: string, endDate: string): Promise<ActiveEnergyResult>;
  getDistanceWalking(startDate: string, endDate: string): Promise<DistanceResult>;
  getWorkouts(startDate: string, endDate: string): Promise<WorkoutsResult>;
  writeWorkout(
    workoutType: number,
    startDate: string,
    endDate: string,
    totalEnergyBurned: number,
    totalDistance: number
  ): Promise<{ success: boolean }>;
  getBiologicalSex(): Promise<BiologicalSexResult>;
  getDateOfBirth(): Promise<DateOfBirthResult>;
  getAuthorizationStatus(dataType: string): Promise<HealthKitAuthorizationStatus>;
}

export interface CoreBluetoothModule {
  getState(): Promise<BluetoothState>;
  requestPermissions(): Promise<BluetoothPermissions>;
  startScan(): Promise<void>;
  stopScan(): Promise<void>;
  connect(peripheralId: string): Promise<BluetoothConnection>;
  disconnect(peripheralId: string): Promise<BluetoothConnection>;
  readCharacteristic(
    peripheralId: string,
    serviceUUID: string,
    characteristicUUID: string
  ): Promise<void>;
  writeCharacteristic(
    peripheralId: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: string
  ): Promise<void>;
}

// Event Types for React Native Event Emitters
export type HealthKitEvents = {
  onHealthDataUpdate: (data: {
    type: string;
    data: any;
  }) => void;
  onHealthKitError: (error: { error: string }) => void;
  onAuthorizationStatusChange: (status: HealthKitAuthorizationStatus) => void;
};

export type CoreBluetoothEvents = {
  onBluetoothStateChange: (state: BluetoothState) => void;
  onDeviceDiscovered: (device: BluetoothDevice) => void;
  onDeviceConnected: (connection: BluetoothConnection) => void;
  onDeviceDisconnected: (disconnection: BluetoothDisconnection) => void;
  onDataReceived: (data: BluetoothDataReceived) => void;
  onError: (error: BluetoothError) => void;
};

// Workout Activity Types (matching HealthKit)
export enum HKWorkoutActivityType {
  AmericanFootball = 1,
  Archery = 2,
  AustralianFootball = 3,
  Badminton = 4,
  Baseball = 5,
  Basketball = 6,
  Bowling = 7,
  Boxing = 8,
  Climbing = 9,
  Cricket = 10,
  CrossTraining = 11,
  Curling = 12,
  Cycling = 13,
  Dance = 14,
  DanceInspiredTraining = 15,
  Elliptical = 16,
  EquestrianSports = 17,
  Fencing = 18,
  Fishing = 19,
  FunctionalStrengthTraining = 20,
  Golf = 21,
  Gymnastics = 22,
  Handball = 23,
  Hiking = 24,
  Hockey = 25,
  Hunting = 26,
  Lacrosse = 27,
  MartialArts = 28,
  MindAndBody = 29,
  MixedMetabolicCardioTraining = 30,
  PaddleSports = 31,
  Play = 32,
  PreparationAndRecovery = 33,
  Racquetball = 34,
  Rowing = 35,
  Rugby = 36,
  Running = 37,
  Sailing = 38,
  SkatingSports = 39,
  SnowSports = 40,
  Soccer = 41,
  Softball = 42,
  Squash = 43,
  StairClimbing = 44,
  SurfingSports = 45,
  Swimming = 46,
  TableTennis = 47,
  Tennis = 48,
  TrackAndField = 49,
  TraditionalStrengthTraining = 50,
  Volleyball = 51,
  Walking = 52,
  WaterFitness = 53,
  WaterPolo = 54,
  WaterSports = 55,
  Wrestling = 56,
  Yoga = 57,
  Other = 3000
}

// Health Data Types
export const HEALTH_DATA_TYPES = {
  STEP_COUNT: 'stepCount',
  DISTANCE_WALKING_RUNNING: 'distanceWalkingRunning',
  ACTIVE_ENERGY_BURNED: 'activeEnergyBurned',
  HEART_RATE: 'heartRate',
  BODY_MASS: 'bodyMass',
  HEIGHT: 'height',
  WORKOUT: 'workout',
  SLEEP_ANALYSIS: 'sleepAnalysis'
} as const;

export type HealthDataType = typeof HEALTH_DATA_TYPES[keyof typeof HEALTH_DATA_TYPES]; 