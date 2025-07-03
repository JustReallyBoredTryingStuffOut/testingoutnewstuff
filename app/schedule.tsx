import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useScheduleStore } from '../store/scheduleStore';
import { useUserStore } from '../store/userStore';
import { ScheduleItem } from '../types/schedule';
import { formatDate, formatTime } from '../utils/dateUtils';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  
  const { getScheduleByDate, addScheduleItem, deleteScheduleItem, updateScheduleItem } = useScheduleStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      const items = getScheduleByDate(user.id, selectedDate);
      setScheduleItems(items);
    }
  }, [user, selectedDate, getScheduleByDate]);

  const handleAddScheduleItem = () => {
    if (!user) return;

    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      userId: user.id,
      title: 'New Activity',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      date: selectedDate.toISOString(),
      type: 'workout',
      isCompleted: false,
    };

    addScheduleItem(newItem);
    const updatedItems = getScheduleByDate(user.id, selectedDate);
    setScheduleItems(updatedItems);
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Schedule Item',
      'Are you sure you want to delete this schedule item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteScheduleItem(itemId);
            if (user) {
              const updatedItems = getScheduleByDate(user.id, selectedDate);
              setScheduleItems(updatedItems);
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = (item: ScheduleItem) => {
    const updatedItem = { ...item, isCompleted: !item.isCompleted };
    updateScheduleItem(updatedItem);
    if (user) {
      const updatedItems = getScheduleByDate(user.id, selectedDate);
      setScheduleItems(updatedItems);
    }
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return 'fitness';
      case 'meal':
        return 'restaurant';
      case 'appointment':
        return 'calendar';
      case 'reminder':
        return 'notifications';
      default:
        return 'time';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workout':
        return colors.primary;
      case 'meal':
        return colors.success;
      case 'appointment':
        return colors.warning;
      case 'reminder':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const sortedItems = [...scheduleItems].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Schedule</Text>
        <TouchableOpacity onPress={handleAddScheduleItem} style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
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

        {/* Schedule Items */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>
            Schedule ({sortedItems.length})
          </Text>
          {sortedItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No schedule items for this date</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add an activity</Text>
            </View>
          ) : (
            sortedItems.map((item) => (
              <View key={item.id} style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleInfo}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>
                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                      </Text>
                    </View>
                    <View style={styles.titleContainer}>
                      <Ionicons 
                        name={getTypeIcon(item.type) as any} 
                        size={20} 
                        color={getTypeColor(item.type)} 
                      />
                      <Text style={[
                        styles.itemTitle,
                        item.isCompleted && styles.completedTitle
                      ]}>
                        {item.title}
                      </Text>
                    </View>
                    {item.description && (
                      <Text style={[
                        styles.itemDescription,
                        item.isCompleted && styles.completedDescription
                      ]}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.scheduleActions}>
                    <TouchableOpacity
                      onPress={() => handleToggleComplete(item)}
                      style={[
                        styles.completeButton,
                        item.isCompleted && styles.completedButton
                      ]}
                    >
                      <Ionicons 
                        name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={item.isCompleted ? colors.success : colors.textSecondary} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteItem(item.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="close-circle" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
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
  addButton: {
    padding: 8,
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
  scheduleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 16,
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
  scheduleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleInfo: {
    flex: 1,
  },
  timeContainer: {
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginLeft: 28,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  scheduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeButton: {
    padding: 4,
  },
  completedButton: {
    // Additional styles for completed state if needed
  },
  deleteButton: {
    padding: 4,
  },
}); 