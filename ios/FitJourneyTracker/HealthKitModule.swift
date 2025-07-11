import Foundation
import HealthKit
import React

@objc(HealthKitModule)
class HealthKitModule: RCTEventEmitter {
    private let healthStore = HKHealthStore()

    static func moduleName() -> String! {
        return "HealthKitModule"
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    // Helper function for robust ISO 8601 date parsing
    private func parseISODate(_ dateString: String) -> Date? {
        print("[HealthKitModule] Parsing date string: \(dateString)")
        
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        
        if let date = isoFormatter.date(from: dateString) {
            print("[HealthKitModule] Successfully parsed with fractional seconds: \(date)")
            return date
        }
        
        // Try without fractional seconds
        isoFormatter.formatOptions = [.withInternetDateTime]
        if let date = isoFormatter.date(from: dateString) {
            print("[HealthKitModule] Successfully parsed without fractional seconds: \(date)")
            return date
        }
        
        // Try with DateFormatter as last resort
        let fallbackFormatter = DateFormatter()
        fallbackFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        fallbackFormatter.locale = Locale(identifier: "en_US_POSIX")
        fallbackFormatter.timeZone = TimeZone(secondsFromGMT: 0)
        
        if let date = fallbackFormatter.date(from: dateString) {
            print("[HealthKitModule] Successfully parsed with DateFormatter: \(date)")
            return date
        }
        
        print("[HealthKitModule] Failed to parse date string: \(dateString)")
        return nil
    }

    @objc
    func isHealthDataAvailable(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve(HKHealthStore.isHealthDataAvailable())
    }

    @objc
    func requestAuthorization(_ dataTypes: NSArray?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        var typesToRead: Set<HKObjectType> = []
        var typesToWrite: Set<HKSampleType> = []
        
        // Convert string data types to HealthKit types
        if let dataTypes = dataTypes as? [String] {
            for dataType in dataTypes {
                switch dataType {
                case "stepCount":
                    if let stepType = HKObjectType.quantityType(forIdentifier: .stepCount) {
                        typesToRead.insert(stepType)
                    }
                case "distance":
                    if let distanceType = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) {
                        typesToRead.insert(distanceType)
                    }
                case "calories":
                    if let calorieType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) {
                        typesToRead.insert(calorieType)
                    }
                case "heartRate":
                    if let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) {
                        typesToRead.insert(heartRateType)
                    }
                case "sleep":
                    if let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) {
                        typesToRead.insert(sleepType)
                    }
                case "workouts":
                    let workoutType = HKObjectType.workoutType()
                    typesToRead.insert(workoutType)
                case "bodyMass":
                    if let weightType = HKObjectType.quantityType(forIdentifier: .bodyMass) {
                        typesToRead.insert(weightType)
                        typesToWrite.insert(weightType)
                    }
                case "bodyFat":
                    if let bodyFatType = HKObjectType.quantityType(forIdentifier: .bodyFatPercentage) {
                        typesToRead.insert(bodyFatType)
                        typesToWrite.insert(bodyFatType)
                    }
                case "muscleMass":
                    if let muscleMassType = HKObjectType.quantityType(forIdentifier: .leanBodyMass) {
                        typesToRead.insert(muscleMassType)
                        typesToWrite.insert(muscleMassType)
                    }
                default:
                    break
                }
            }
        }
        
        // If no specific types requested, add common ones
        if typesToRead.isEmpty {
            if let stepType = HKObjectType.quantityType(forIdentifier: .stepCount) {
                typesToRead.insert(stepType)
            }
            if let distanceType = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) {
                typesToRead.insert(distanceType)
            }
            if let calorieType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) {
                typesToRead.insert(calorieType)
            }
        }
        
        healthStore.requestAuthorization(toShare: typesToWrite, read: typesToRead) { (success, error) in
            if let error = error {
                reject("E_AUTH", error.localizedDescription, error)
            } else {
                let result: [String: Any] = [
                    "authorized": success,
                    "dataTypes": dataTypes ?? ["stepCount", "distance", "calories", "heartRate", "sleep", "workouts", "bodyMass"]
                ]
                resolve(result)
            }
        }
    }

    @objc
    func getStepCount(_ startDateStr: String, endDateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] getStepCount called with startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates - startDate: \(startDate), endDate: \(endDate)")
        
        let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
        let query = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            if let error = error {
                print("[HealthKitModule] Query error: \(error)")
                reject("E_QUERY", error.localizedDescription, error)
                return
            }
            let steps = result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
            print("[HealthKitModule] Query successful - steps: \(steps)")
            resolve(["success": true, "steps": steps])
        }
        healthStore.execute(query)
    }
    
    @objc
    func getDistanceWalking(_ startDateStr: String, endDateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] getDistanceWalking called with startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates for distance - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates for distance - startDate: \(startDate), endDate: \(endDate)")
        
        let distanceType = HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
        let query = HKStatisticsQuery(quantityType: distanceType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            if let error = error {
                print("[HealthKitModule] Distance query error: \(error)")
                reject("E_QUERY", error.localizedDescription, error)
                return
            }
            let distance = result?.sumQuantity()?.doubleValue(for: HKUnit.meter()) ?? 0
            let distanceKm = distance / 1000.0
            print("[HealthKitModule] Distance query successful - distance: \(distanceKm) km")
            resolve(["success": true, "distance": distanceKm])
        }
        healthStore.execute(query)
    }
    
    @objc
    func getActiveEnergyBurned(_ startDateStr: String, endDateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] getActiveEnergyBurned called with startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates for calories - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates for calories - startDate: \(startDate), endDate: \(endDate)")
        
        let calorieType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
        let query = HKStatisticsQuery(quantityType: calorieType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            if let error = error {
                print("[HealthKitModule] Calories query error: \(error)")
                reject("E_QUERY", error.localizedDescription, error)
                return
            }
            let calories = result?.sumQuantity()?.doubleValue(for: HKUnit.kilocalorie()) ?? 0
            print("[HealthKitModule] Calories query successful - calories: \(calories)")
            resolve(["success": true, "calories": calories])
        }
        healthStore.execute(query)
    }
    
    @objc
    func getHeartRateSamples(_ startDateStr: String, endDateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] getHeartRateSamples called with startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates for heart rate - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates for heart rate - startDate: \(startDate), endDate: \(endDate)")
        
        let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
        let query = HKSampleQuery(sampleType: heartRateType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            if let error = error {
                print("[HealthKitModule] Heart rate query error: \(error)")
                reject("E_QUERY", error.localizedDescription, error)
                return
            }
            
            let heartRateSamples = samples?.compactMap { sample -> [String: Any]? in
                guard let quantitySample = sample as? HKQuantitySample else { return nil }
                return [
                    "value": quantitySample.quantity.doubleValue(for: HKUnit(from: "count/min")),
                    "startDate": ISO8601DateFormatter().string(from: quantitySample.startDate),
                    "endDate": ISO8601DateFormatter().string(from: quantitySample.endDate),
                    "source": quantitySample.sourceRevision.source.name
                ]
            } ?? []
            
            print("[HealthKitModule] Heart rate query successful - samples count: \(heartRateSamples.count)")
            resolve(["success": true, "samples": heartRateSamples])
        }
        healthStore.execute(query)
    }
    
    @objc
    func getSleepAnalysis(_ startDateStr: String, endDateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] getSleepAnalysis called with startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates for sleep - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates for sleep - startDate: \(startDate), endDate: \(endDate)")
        
        let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
        let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            if let error = error {
                print("[HealthKitModule] Sleep query error: \(error)")
                reject("E_QUERY", error.localizedDescription, error)
                return
            }
            
            var sleepData: [String: Double] = [
                "inBed": 0,
                "asleep": 0,
                "awake": 0,
                "deep": 0,
                "rem": 0,
                "light": 0
            ]
            
            if let samples = samples {
                for sample in samples {
                    guard let categorySample = sample as? HKCategorySample else { continue }
                    let duration = sample.endDate.timeIntervalSince(sample.startDate) / 60.0 // Convert to minutes
                    
                    switch categorySample.value {
                    case HKCategoryValueSleepAnalysis.inBed.rawValue:
                        sleepData["inBed"]! += duration
                    case HKCategoryValueSleepAnalysis.asleep.rawValue:
                        sleepData["asleep"]! += duration
                    case HKCategoryValueSleepAnalysis.awake.rawValue:
                        sleepData["awake"]! += duration
                    default:
                        break
                    }
                }
            }
            
            print("[HealthKitModule] Sleep query successful - sleepData: \(sleepData)")
            resolve(["success": true, "sleepData": sleepData])
        }
        healthStore.execute(query)
    }
    
    @objc
    func getWorkouts(_ startDateStr: String, endDateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] getWorkouts called with startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates for workouts - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates for workouts - startDate: \(startDate), endDate: \(endDate)")
        
        let workoutType = HKObjectType.workoutType()
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
        let query = HKSampleQuery(sampleType: workoutType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            if let error = error {
                print("[HealthKitModule] Workouts query error: \(error)")
                reject("E_QUERY", error.localizedDescription, error)
                return
            }
            
            let workouts = samples?.compactMap { sample -> [String: Any]? in
                guard let workout = sample as? HKWorkout else { return nil }
                return [
                    "type": workout.workoutActivityType.rawValue,
                    "startDate": ISO8601DateFormatter().string(from: workout.startDate),
                    "endDate": ISO8601DateFormatter().string(from: workout.endDate),
                    "duration": workout.duration,
                    "distance": workout.totalDistance?.doubleValue(for: HKUnit.meter()) ?? 0,
                    "energyBurned": workout.totalEnergyBurned?.doubleValue(for: HKUnit.kilocalorie()) ?? 0
                ]
            } ?? []
            
            print("[HealthKitModule] Workouts query successful - workouts count: \(workouts.count)")
            resolve(["success": true, "workouts": workouts])
        }
        healthStore.execute(query)
    }
    
    @objc
    func getBodyMass(_ startDateStr: String, endDateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] getBodyMass called with startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates for body mass - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates for body mass - startDate: \(startDate), endDate: \(endDate)")
        
        let bodyMassType = HKQuantityType.quantityType(forIdentifier: .bodyMass)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
        let query = HKSampleQuery(sampleType: bodyMassType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]) { _, samples, error in
            if let error = error {
                print("[HealthKitModule] Body mass query error: \(error)")
                reject("E_QUERY", error.localizedDescription, error)
                return
            }
            
            let weightSamples = samples?.compactMap { sample -> [String: Any]? in
                guard let quantitySample = sample as? HKQuantitySample else { return nil }
                return [
                    "value": quantitySample.quantity.doubleValue(for: HKUnit.gramUnit(with: .kilo)),
                    "startDate": ISO8601DateFormatter().string(from: quantitySample.startDate),
                    "endDate": ISO8601DateFormatter().string(from: quantitySample.endDate),
                    "source": quantitySample.sourceRevision.source.name
                ]
            } ?? []
            
            print("[HealthKitModule] Body mass query successful - samples count: \(weightSamples.count)")
            resolve(["success": true, "samples": weightSamples])
        }
        healthStore.execute(query)
    }
    
    @objc
    func writeBodyMass(_ weight: Double, dateStr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] writeBodyMass called with weight: \(weight), dateStr: \(dateStr)")
        
        guard let date = parseISODate(dateStr) else {
            print("[HealthKitModule] Failed to parse date for writing body mass - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed date for writing body mass - date: \(date)")
        
        let bodyMassType = HKQuantityType.quantityType(forIdentifier: .bodyMass)!
        let weightQuantity = HKQuantity(unit: HKUnit.gramUnit(with: .kilo), doubleValue: weight)
        let weightSample = HKQuantitySample(type: bodyMassType, quantity: weightQuantity, start: date, end: date)
        
        healthStore.save(weightSample) { success, error in
            if let error = error {
                print("[HealthKitModule] Failed to save body mass: \(error)")
                reject("E_WRITE", error.localizedDescription, error)
            } else {
                print("[HealthKitModule] Successfully saved body mass")
                resolve(["success": success])
            }
        }
    }
    
    @objc
    func observeStepCount(_ callback: @escaping RCTResponseSenderBlock) {
        print("[HealthKitModule] observeStepCount called")
        let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount)!
        let query = HKObserverQuery(sampleType: stepType, predicate: nil) { _, _, error in
            if error == nil {
                // Get the latest step count
                let now = Date()
                let startOfDay = Calendar.current.startOfDay(for: now)
                let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: [])
                let statisticsQuery = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
                    let steps = result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
                    print("[HealthKitModule] Observer triggered - steps: \(steps)")
                    callback([["success": true, "steps": steps]])
                }
                self.healthStore.execute(statisticsQuery)
            }
        }
        healthStore.execute(query)
    }
    
    @objc
    func writeWorkout(_ workoutType: Int, startDateStr: String, endDateStr: String, totalEnergyBurned: Double, totalDistance: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("[HealthKitModule] writeWorkout called with workoutType: \(workoutType), startDateStr: \(startDateStr), endDateStr: \(endDateStr)")
        
        guard let startDate = parseISODate(startDateStr), let endDate = parseISODate(endDateStr) else {
            print("[HealthKitModule] Failed to parse dates for writing workout - rejecting with E_DATE")
            reject("E_DATE", "Invalid date format", nil)
            return
        }
        
        print("[HealthKitModule] Successfully parsed dates for writing workout - startDate: \(startDate), endDate: \(endDate)")
        
        let activityType = HKWorkoutActivityType(rawValue: UInt(workoutType)) ?? .other
        let energyBurned = HKQuantity(unit: HKUnit.kilocalorie(), doubleValue: totalEnergyBurned)
        let distance = HKQuantity(unit: HKUnit.meter(), doubleValue: totalDistance)
        
        let workout = HKWorkout(activityType: activityType, start: startDate, end: endDate, duration: endDate.timeIntervalSince(startDate), totalEnergyBurned: energyBurned, totalDistance: distance, metadata: nil)
        
        healthStore.save(workout) { success, error in
            if let error = error {
                print("[HealthKitModule] Failed to save workout: \(error)")
                reject("E_WRITE", error.localizedDescription, error)
            } else {
                print("[HealthKitModule] Successfully saved workout")
                resolve(["success": success])
            }
        }
    }
    
    @objc
    func getBiologicalSex(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let biologicalSex = try healthStore.biologicalSex()
            let sexString: String
            switch biologicalSex.biologicalSex {
            case .female:
                sexString = "female"
            case .male:
                sexString = "male"
            case .other:
                sexString = "other"
            default:
                sexString = "notSet"
            }
            resolve(sexString)
        } catch {
            reject("E_QUERY", error.localizedDescription, error)
        }
    }
    
    @objc
    func getDateOfBirth(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let dateOfBirth = try healthStore.dateOfBirthComponents()
            if let date = Calendar.current.date(from: dateOfBirth) {
                resolve(ISO8601DateFormatter().string(from: date))
            } else {
                reject("E_QUERY", "Could not parse date of birth", nil)
            }
        } catch {
            reject("E_QUERY", error.localizedDescription, error)
        }
    }
} 