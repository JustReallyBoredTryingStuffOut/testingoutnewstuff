import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, MapPin, Calendar, Filter } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import ActivityMap from "@/components/ActivityMap";

export default function ActivityMapScreen() {
  const router = useRouter();
  const { activityLogs } = useHealthStore();
  
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  // Get unique activity types for filtering
  const activityTypes = Array.from(new Set(activityLogs
    .filter(log => log.isOutdoor)
    .map(log => log.type)
  ));
  
  // Filter logs based on selected filter
  const filteredLogs = activityLogs
    .filter(log => log.isOutdoor)
    .filter(log => {
      // Filter by activity type
      if (selectedFilter) {
        return log.type === selectedFilter;
      }
      return true;
    });
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Activity Map",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.mapContainer}>
        <ActivityMap height={300} />
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <TouchableOpacity 
            style={[
              styles.filterChip,
              selectedFilter === null && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(null)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === null && styles.filterChipTextActive
            ]}>
              All Activities
            </Text>
          </TouchableOpacity>
          
          {activityTypes.map(type => (
            <TouchableOpacity 
              key={type}
              style={[
                styles.filterChip,
                selectedFilter === type && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(type)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === type && styles.filterChipTextActive
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>Recent Outdoor Activities</Text>
        
        {filteredLogs.length > 0 ? (
          filteredLogs
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map(activity => (
              <TouchableOpacity 
                key={activity.id}
                style={styles.activityCard}
                onPress={() => router.push(`/activity/${activity.id}`)}
              >
                <View style={styles.activityHeader}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityType}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Text>
                    <Text style={styles.activityDate}>
                      {new Date(activity.date).toLocaleDateString()} • {activity.duration} min
                    </Text>
                  </View>
                  
                  <View style={styles.activityStats}>
                    <Text style={styles.activityDistance}>{activity.distance} km</Text>
                    <Text style={styles.activityCalories}>{activity.calories} kcal</Text>
                  </View>
                </View>
                
                {activity.location && (
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={styles.locationText}>{activity.location}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No outdoor activities found</Text>
            <Text style={styles.emptyText}>
              Log an outdoor activity to see it on the map
            </Text>
            <TouchableOpacity 
              style={styles.logButton}
              onPress={() => router.push("/activity-log")}
            >
              <Text style={styles.logButtonText}>Log Activity</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  mapContainer: {
    width: "100%",
    height: 300,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersScrollContent: {
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  activitiesContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activityStats: {
    alignItems: "flex-end",
  },
  activityDistance: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  activityCalories: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  logButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});