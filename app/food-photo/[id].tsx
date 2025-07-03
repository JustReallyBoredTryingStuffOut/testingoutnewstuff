import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trash2, 
  Edit, 
  Coffee, 
  UtensilsCrossed, 
  Soup 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useMacroStore } from "@/store/macroStore";
import Button from "@/components/Button";

export default function LogDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { macroLogs, deleteMacroLog } = useMacroStore();
  
  const log = macroLogs.find(log => log.id === id);
  
  if (!log) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: "Log Details",
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
                accessibilityLabel="Go back"
                accessibilityHint="Returns to the previous screen"
              >
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Log not found</Text>
          <TouchableOpacity 
            style={styles.backToLogsButton}
            onPress={() => router.push("/nutrition-history")}
          >
            <Text style={styles.backToLogsText}>Back to Nutrition History</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleEdit = () => {
    // Navigate to edit screen
    router.push(`/edit-log/${log.id}`);
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to delete this food log?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteMacroLog(log.id);
            router.replace("/nutrition-history");
          },
          style: "destructive",
        },
      ]
    );
  };
  
  const getMealTypeIcon = () => {
    switch (log.mealType) {
      case "breakfast":
        return <Coffee size={24} color={colors.primary} />;
      case "lunch":
        return <UtensilsCrossed size={24} color={colors.primary} />;
      case "dinner":
        return <UtensilsCrossed size={24} color={colors.primary} />;
      case "snack":
        return <Soup size={24} color={colors.primary} />;
      default:
        return <UtensilsCrossed size={24} color={colors.primary} />;
    }
  };
  
  const logDate = new Date(log.date);
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Log Details",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Edit size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.mealTypeContainer}>
            {log.mealType && getMealTypeIcon()}
            <Text style={styles.mealType}>
              {log.mealType 
                ? log.mealType.charAt(0).toUpperCase() + log.mealType.slice(1) 
                : "Food Log"
              }
            </Text>
          </View>
          
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>
                {logDate.toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.dateTimeItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>
                {log.mealTime || logDate.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.macrosCard}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{log.calories}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{log.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{log.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{log.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
        
        {log.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{log.notes}</Text>
            </View>
          </View>
        )}
        
        <Button
          title="Delete Log"
          onPress={handleDelete}
          icon={<Trash2 size={18} color="#FFFFFF" />}
          variant="danger"
          style={styles.deleteButton}
        />
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mealType: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginLeft: 8,
  },
  dateTimeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  macrosCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  notesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
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
  deleteButton: {
    marginTop: 8,
    marginBottom: 24,
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
  backToLogsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToLogsText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});