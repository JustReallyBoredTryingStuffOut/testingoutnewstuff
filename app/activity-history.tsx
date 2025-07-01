import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Calendar, ChevronRight, MapPin, Clock, Zap } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";

export default function ActivityHistoryScreen() {
  const router = useRouter();
  const { activityLogs } = useHealthStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  // Group activities by date
  const groupedActivities = activityLogs.reduce((acc, activity) => {
    const date = new Date(activity.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(b) - new Date(a));
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleActivityPress = (activityId) => {
    router.push(`/activity/${activityId}`);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Activity History",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your Activities</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color={colors.primary} />
          <Text style={styles.calendarButtonText}>
            {selectedMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
      </View>
      
      {sortedDates.length > 0 ? (
        <FlatList
          data={sortedDates}
          keyExtractor={(date) => date}
          renderItem={({ item: date }) => (
            <View style={styles.dateSection}>
              <Text style={styles.dateHeader}>
                {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
              
              {groupedActivities[date].map((activity) => (
                <TouchableOpacity 
                  key={activity.id}
                  style={styles.activityCard}
                  onPress={() => handleActivityPress(activity.id)}
                >
                  <View style={styles.activityTypeIcon}>
                    <Text style={styles.activityTypeText}>
                      {activity.type.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.activityContent}>
                    <Text style={styles.activityType}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Text>
                    
                    <View style={styles.activityDetails}>
                      <View style={styles.activityDetail}>
                        <Clock size={14} color={colors.textSecondary} />
                        <Text style={styles.activityDetailText}>
                          {formatDuration(activity.duration)}
                        </Text>
                      </View>
                      
                      {activity.distance && (
                        <View style={styles.activityDetail}>
                          <MapPin size={14} color={colors.textSecondary} />
                          <Text style={styles.activityDetailText}>
                            {activity.distance.toFixed(2)} km
                          </Text>
                        </View>
                      )}
                      
                      <View style={styles.activityDetail}>
                        <Zap size={14} color={colors.textSecondary} />
                        <Text style={styles.activityDetailText}>
                          {activity.calories} kcal
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <ChevronRight size={20} color={colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No activities yet</Text>
          <Text style={styles.emptyText}>
            Start logging your workouts and activities to see them here
          </Text>
          <TouchableOpacity 
            style={styles.logActivityButton}
            onPress={() => router.push("/log-cardio")}
          >
            <Text style={styles.logActivityButtonText}>Log Activity</Text>
          </TouchableOpacity>
        </View>
      )}
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
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.highlight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  calendarButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
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
  activityTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityTypeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  activityDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  activityDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  activityDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
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
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  logActivityButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logActivityButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});