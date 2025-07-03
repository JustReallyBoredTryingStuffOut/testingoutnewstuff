import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWaterStore } from '../store/waterStore';
import { useUserStore } from '../store/userStore';
import { WaterIntake } from '../types/water';
import { formatDate } from '../utils/dateUtils';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

export default function WaterIntakeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([]);
  
  const { getWaterIntakesByDate, addWaterIntake, deleteWaterIntake } = useWaterStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      const intakes = getWaterIntakesByDate(user.id, selectedDate);
      setWaterIntakes(intakes);
    }
  }, [user, selectedDate, getWaterIntakesByDate]);

  const handleAddWater = (amount: number) => {
    if (!user) return;

    const newIntake: WaterIntake = {
      id: Date.now().toString(),
      userId: user.id,
      amount,
      date: selectedDate.toISOString(),
      timestamp: new Date().toISOString(),
    };

    addWaterIntake(newIntake);
    const updatedIntakes = getWaterIntakesByDate(user.id, selectedDate);
    setWaterIntakes(updatedIntakes);
  };

  const handleDeleteIntake = (intakeId: string) => {
    Alert.alert(
      'Delete Water Intake',
      'Are you sure you want to delete this water intake?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWaterIntake(intakeId);
            if (user) {
              const updatedIntakes = getWaterIntakesByDate(user.id, selectedDate);
              setWaterIntakes(updatedIntakes);
            }
          },
        },
      ]
    );
  };

  const getTotalWater = () => {
    return waterIntakes.reduce((total, intake) => total + intake.amount, 0);
  };

  const getDailyGoal = () => {
    return user?.waterGoal || 2000; // Default 2L goal
  };

  const getProgressPercentage = () => {
    const total = getTotalWater();
    const goal = getDailyGoal();
    return Math.min((total / goal) * 100, 100);
  };

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const quickAddAmounts = [200, 300, 500, 1000];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Water Intake</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => changeDate('prev')} style={styles.dateButton}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity onPress={() => changeDate('next')} style={styles.dateButton}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Water Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressAmount}>
              {getTotalWater()}ml / {getDailyGoal()}ml
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
          </View>
          
          <Text style={styles.progressPercentage}>
            {Math.round(getProgressPercentage())}% Complete
          </Text>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {quickAddAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => handleAddWater(amount)}
              >
                <Ionicons name="water" size={24} color={colors.primary} />
                <Text style={styles.quickAddText}>{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Add */}
        <View style={styles.customAddSection}>
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          <View style={styles.customAddGrid}>
            {[100, 150, 200, 250, 300, 400, 500, 750].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.customAddButton}
                onPress={() => handleAddWater(amount)}
              >
                <Text style={styles.customAddText}>{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Intakes */}
        <View style={styles.intakesSection}>
          <Text style={styles.sectionTitle}>
            Today's Intakes ({waterIntakes.length})
          </Text>
          {waterIntakes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="water-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No water intake recorded yet</Text>
              <Text style={styles.emptySubtext}>Tap the buttons above to add water</Text>
            </View>
          ) : (
            waterIntakes.map((intake) => (
              <View key={intake.id} style={styles.intakeCard}>
                <View style={styles.intakeInfo}>
                  <Ionicons name="water" size={20} color={colors.primary} />
                  <Text style={styles.intakeAmount}>{intake.amount}ml</Text>
                  <Text style={styles.intakeTime}>
                    {new Date(intake.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteIntake(intake.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  dateButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
  },
  progressAmount: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickAddSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 16,
  },
  quickAddGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAddText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text,
    marginTop: 8,
  },
  customAddSection: {
    marginBottom: 24,
  },
  customAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  customAddButton: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customAddText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  intakesSection: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  intakeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  intakeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  intakeAmount: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginLeft: 12,
    marginRight: 16,
  },
  intakeTime: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
}); 