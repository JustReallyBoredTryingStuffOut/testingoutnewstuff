import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useHealthStore } from "@/store/healthStore";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

interface ActivityMapProps {
  height?: number;
  activityId?: string;
}

export default function ActivityMap({ height = 300, activityId }: ActivityMapProps) {
  const { colors } = useTheme();
  
  // This is a placeholder component since we can't actually implement location tracking
  // without native device capabilities
  
  if (Platform.OS === "web") {
    return (
      <View 
        style={[
          styles.container, 
          { height, backgroundColor: colors.card }
        ]}
      >
        <Text style={[styles.webText, { color: colors.textSecondary }]}>
          Activity map is not available on web
        </Text>
      </View>
    );
  }
  
  // In a real implementation, we would:
  // 1. Get location data from the health store
  // 2. Render a MapView with the route as a Polyline
  // 3. Show markers for start/end points
  
  // For this demo, we'll just show a placeholder map
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.mapPlaceholder}>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
          Map data would be displayed here
        </Text>
        <Text style={[styles.placeholderSubtext, { color: colors.textLight }]}>
          Location tracking requires device permissions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E1E4E8",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
  },
  webText: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
});