# Fitness App with Core Bluetooth Integration

This fitness app includes integration with Core Bluetooth for iOS to connect with health devices like Apple Watch, Fitbit, and other fitness trackers.

## Core Bluetooth Implementation

The app uses a JavaScript interface to communicate with the native Core Bluetooth framework on iOS. In this implementation, we've created:

1. A JavaScript interface in `src/NativeModules/CoreBluetooth.js`
2. Integration with the health devices screen in `app/health-devices.tsx`
3. Step counter integration in `hooks/useStepCounter.ts` and `components/StepCounter.tsx`

### Current Implementation

The current implementation includes:

- A simulation mode for development and testing
- Proper event handling for device discovery, connection, and disconnection
- Error handling for Bluetooth state and permissions
- UI components to show Bluetooth status and device information

### Native Module Implementation

To fully implement Core Bluetooth in a production app, you would need to create a native iOS module:

#### 1. Create the Native Module

Create a new file `ios/CoreBluetoothModule.swift`:

```swift
import Foundation
import CoreBluetooth

@objc(CoreBluetoothModule)
class CoreBluetoothModule: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
  
  private var centralManager: CBCentralManager!
  private var discoveredPeripherals: [CBPeripheral] = []
  private var connectedPeripherals: [CBPeripheral] = []
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  override init() {
    super.init()
    centralManager = CBCentralManager(delegate: self, queue: nil)
  }
  
  // MARK: - Public Methods
  
  @objc func getState(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let stateString = bluetoothStateToString(centralManager.state)
    resolve(["state": stateString])
  }
  
  @objc func requestPermissions(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // In iOS, starting a scan will prompt for permissions if needed
    let granted = centralManager.state == .poweredOn
    resolve(["granted": granted])
  }
  
  @objc func startScan(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard centralManager.state == .poweredOn else {
      reject("ERROR", "Bluetooth is not powered on", nil)
      return
    }
    
    discoveredPeripherals.removeAll()
    centralManager.scanForPeripherals(withServices: nil, options: [CBCentralManagerScanOptionAllowDuplicatesKey: false])
    resolve(nil)
  }
  
  @objc func stopScan(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    centralManager.stopScan()
    resolve(nil)
  }
  
  @objc func connect(_ peripheralId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let peripheral = getPeripheralById(peripheralId) else {
      reject("ERROR", "Peripheral not found", nil)
      return
    }
    
    centralManager.connect(peripheral, options: nil)
    resolve(["id": peripheralId])
  }
  
  @objc func disconnect(_ peripheralId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let peripheral = getPeripheralById(peripheralId) else {
      reject("ERROR", "Peripheral not found", nil)
      return
    }
    
    centralManager.cancelPeripheralConnection(peripheral)
    resolve(["id": peripheralId])
  }
  
  // MARK: - CBCentralManagerDelegate
  
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    let stateString = bluetoothStateToString(central.state)
    sendEvent(withName: "bluetoothStateChanged", body: ["state": stateString])
  }
  
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    peripheral.delegate = self
    
    // Add to discovered peripherals if not already present
    if !discoveredPeripherals.contains(peripheral) {
      discoveredPeripherals.append(peripheral)
    }
    
    // Extract device information
    let name = peripheral.name ?? "Unknown Device"
    let id = peripheral.identifier.uuidString
    
    // Send event to JavaScript
    sendEvent(withName: "deviceDiscovered", body: [
      "id": id,
      "name": name,
      "rssi": RSSI.intValue
    ])
  }
  
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
    if !connectedPeripherals.contains(peripheral) {
      connectedPeripherals.append(peripheral)
    }
    
    peripheral.discoverServices(nil)
    
    sendEvent(withName: "deviceConnected", body: [
      "id": peripheral.identifier.uuidString,
      "name": peripheral.name ?? "Unknown Device"
    ])
  }
  
  func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?) {
    sendEvent(withName: "connectionError", body: [
      "id": peripheral.identifier.uuidString,
      "error": error?.localizedDescription ?? "Unknown error"
    ])
  }
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
    if let index = connectedPeripherals.firstIndex(of: peripheral) {
      connectedPeripherals.remove(at: index)
    }
    
    sendEvent(withName: "deviceDisconnected", body: [
      "id": peripheral.identifier.uuidString
    ])
  }
  
  // MARK: - CBPeripheralDelegate
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
    guard error == nil else {
      print("Error discovering services: \(error!.localizedDescription)")
      return
    }
    
    guard let services = peripheral.services else { return }
    
    for service in services {
      peripheral.discoverCharacteristics(nil, for: service)
    }
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
    guard error == nil else {
      print("Error discovering characteristics: \(error!.localizedDescription)")
      return
    }
    
    // Handle characteristics discovery
  }
  
  // MARK: - Helper Methods
  
  private func getPeripheralById(_ peripheralId: String) -> CBPeripheral? {
    return discoveredPeripherals.first { $0.identifier.uuidString == peripheralId }
  }
  
  private func bluetoothStateToString(_ state: CBManagerState) -> String {
    switch state {
    case .poweredOn:
      return "poweredOn"
    case .poweredOff:
      return "poweredOff"
    case .resetting:
      return "resetting"
    case .unauthorized:
      return "unauthorized"
    case .unsupported:
      return "unsupported"
    case .unknown:
      return "unknown"
    @unknown default:
      return "unknown"
    }
  }
  
  // MARK: - Events
  
  private func sendEvent(withName name: String, body: Any) {
    // This would be implemented to send events to JavaScript
    // In a real implementation, you would use RCTEventEmitter
  }
}
```

#### 2. Create the Objective-C Bridge

Create a new file `ios/CoreBluetoothModule.m`:

```objc
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(CoreBluetoothModule, RCTEventEmitter)

RCT_EXTERN_METHOD(getState:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startScan:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopScan:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(connect:(NSString *)peripheralId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disconnect:(NSString *)peripheralId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
```

#### 3. Update Info.plist

Add the following to your `ios/YourApp/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app uses Bluetooth to connect to health devices like Apple Watch and fitness trackers.</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app uses Bluetooth to connect to health devices like Apple Watch and fitness trackers.</string>
```

#### 4. Integrate with HealthKit

For a complete health app, you would also want to integrate with HealthKit to access health data from connected devices:

```swift
import HealthKit

// Request HealthKit permissions
func requestHealthKitPermissions() {
  guard HKHealthStore.isHealthDataAvailable() else {
    return
  }
  
  let healthStore = HKHealthStore()
  
  // Define the types to read and write
  let typesToRead: Set<HKObjectType> = [
    HKObjectType.quantityType(forIdentifier: .stepCount)!,
    HKObjectType.quantityType(forIdentifier: .heartRate)!,
    HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
    HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
  ]
  
  // Request authorization
  healthStore.requestAuthorization(toShare: nil, read: typesToRead) { (success, error) in
    if let error = error {
      print("Error requesting HealthKit authorization: \(error.localizedDescription)")
    }
  }
}
```

## Using the Core Bluetooth Module

The JavaScript interface provides the following methods:

- `getBluetoothState()`: Get the current Bluetooth state
- `requestPermissions()`: Request Bluetooth permissions
- `startScan()`: Start scanning for Bluetooth devices
- `stopScan()`: Stop scanning for Bluetooth devices
- `connect(peripheralId)`: Connect to a Bluetooth device
- `disconnect(peripheralId)`: Disconnect from a Bluetooth device
- `addListener(eventType, listener)`: Add a listener for Bluetooth events
- `removeListener(eventType, listener)`: Remove a listener for a specific event
- `removeAllListeners(eventType)`: Remove all listeners for an event type

## Events

The module emits the following events:

- `bluetoothStateChanged`: When the Bluetooth state changes
- `deviceDiscovered`: When a new device is discovered
- `deviceConnected`: When a device is connected
- `deviceDisconnected`: When a device is disconnected
- `connectionError`: When there's an error connecting to a device

## Example Usage

```javascript
import CoreBluetooth from '../src/NativeModules/CoreBluetooth';

// Check Bluetooth state
const checkBluetoothState = async () => {
  try {
    const result = await CoreBluetooth.getBluetoothState();
    console.log('Bluetooth state:', result.state);
  } catch (error) {
    console.error('Error checking Bluetooth state:', error);
  }
};

// Start scanning for devices
const startScan = async () => {
  try {
    await CoreBluetooth.startScan();
    console.log('Scanning started');
  } catch (error) {
    console.error('Error starting scan:', error);
  }
};

// Listen for discovered devices
const discoveryListener = CoreBluetooth.addListener(
  'deviceDiscovered',
  (device) => {
    console.log('Device discovered:', device);
  }
);

// Clean up listeners when done
discoveryListener();
```