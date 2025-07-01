import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Flame, 
  Footprints, 
  Timer, 
  Share2 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import ActivityMap from "@/components/ActivityMap";

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { activityLogs } = useHealthStore();
  
  const activity = activityLogs.find(log => log.id === id);
  
  if (!activity) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: "Activity Details",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Activity not found</Text>
          <TouchableOpacity 
            style={styles.backToActivitiesButton}
            onPress={() => router.push("/activity-history")}
          >
            <Text style={styles.backToActivitiesText}>Back to Activities</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const activityDate = new Date(activity.date);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleShare = () => {
    // Share functionality would go here
    console.log("Share activity:", activity);
  };
  
  // Calculate pace (minutes per km)
  const calculatePace = () => {
    if (activity.distance <= 0) return "N/A";
    
    const paceMinutes = activity.duration / activity.distance;
    const minutes = Math.floor(paceMinutes);
    const seconds = Math.round((paceMinutes - minutes) * 60);
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min/km`;
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Details`,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.activityIconContainer}>
            <Footprints size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.activityType}>
            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
          </Text>
          <View style={styles.dateTimeContainer}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.dateTimeText}>
              {activityDate.toLocaleDateString()}
            </Text>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.dateTimeText}>
              {activityDate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Footprints size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{activity.distance} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Timer size={20} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>{activity.duration} min</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Flame size={20} color="#FF9500" />
            </View>
            <Text style={styles.statValue}>{activity.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pace</Text>
            <Text style={styles.detailValue}>{calculatePace()}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Avg. Calories/Min</Text>
            <Text style={styles.detailValue}>
              {activity.duration > 0 
                ? (activity.calories / activity.duration).toFixed(1) 
                : "N/A"}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Activity Type</Text>
            <Text style={styles.detailValue}>
              {activity.isOutdoor ? "Outdoor" : "Indoor"}
            </Text>
          </View>
        </View>
        
        {activity.isOutdoor && activity.location && (
          <View style={styles.locationSection}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            
            <View style={styles.mapContainer}>
              <ActivityMap height={200} focusedActivityId={activity.id} />
            </View>
            
            <Text style={styles.locationText}>{activity.location}</Text>
          </View>
        )}
        
        {activity.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{activity.notes}</Text>
            </View>
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  activityIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  activityType: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
  },
  locationSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  backToActivitiesButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToActivitiesText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});