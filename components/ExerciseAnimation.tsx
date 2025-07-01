import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { colors } from "@/constants/colors";

type ExerciseAnimationProps = {
  exerciseId: string;
  style?: object;
};

export default function ExerciseAnimation({ exerciseId, style }: ExerciseAnimationProps) {
  // Get animation source based on exercise ID
  const getAnimationSource = (id: string) => {
    switch (id) {
      case "ex215": // Face Pull
        return require("@/assets/animations/face-pull.json");
      default:
        return null;
    }
  };

  const animationSource = getAnimationSource(exerciseId);

  if (!animationSource) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Exercise Animation</Text>
      <View style={styles.animationContainer}>
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      <Text style={styles.caption}>Follow this movement pattern for proper form</Text>
      
      {exerciseId === "ex215" && (
        <View style={styles.muscleInfo}>
          <Text style={styles.muscleInfoTitle}>Muscles Worked:</Text>
          <View style={styles.muscleList}>
            <View style={styles.muscleItem}>
              <View style={[styles.muscleColorIndicator, { backgroundColor: 'rgba(51, 102, 255, 0.8)' }]} />
              <Text style={styles.muscleText}>Rear Deltoids</Text>
            </View>
            <View style={styles.muscleItem}>
              <View style={[styles.muscleColorIndicator, { backgroundColor: 'rgba(204, 51, 204, 0.8)' }]} />
              <Text style={styles.muscleText}>Trapezius</Text>
            </View>
            <View style={styles.muscleItem}>
              <View style={[styles.muscleColorIndicator, { backgroundColor: 'rgba(255, 204, 26, 0.8)' }]} />
              <Text style={styles.muscleText}>Rotator Cuff</Text>
            </View>
            <View style={styles.muscleItem}>
              <View style={[styles.muscleColorIndicator, { backgroundColor: 'rgba(51, 204, 51, 0.8)' }]} />
              <Text style={styles.muscleText}>Latissimus Dorsi</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  animationContainer: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.highlight,
    borderRadius: 8,
    overflow: "hidden",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  muscleInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.highlight,
  },
  muscleInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  muscleList: {
    gap: 8,
  },
  muscleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  muscleColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  muscleText: {
    fontSize: 14,
    color: colors.text,
  },
});