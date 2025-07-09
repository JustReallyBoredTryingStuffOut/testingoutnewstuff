#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(HealthKitModule, NSObject)

RCT_EXTERN_METHOD(isHealthDataAvailable:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestAuthorization:(NSArray *)dataTypes
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getStepCount:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDistanceWalking:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getActiveEnergyBurned:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getHeartRateSamples:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getSleepAnalysis:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getWorkouts:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBodyMass:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeBodyMass:(double)weight
                  dateStr:(NSString *)dateStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(observeStepCount:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(writeWorkout:(int)workoutType
                  startDateStr:(NSString *)startDateStr
                  endDateStr:(NSString *)endDateStr
                  totalEnergyBurned:(double)totalEnergyBurned
                  totalDistance:(double)totalDistance
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBiologicalSex:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDateOfBirth:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end 