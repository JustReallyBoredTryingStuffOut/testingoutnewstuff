import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useScheduleStore } from '../store/scheduleStore';
import { useUserStore } from '../store/userStore';
import { usePhotoStore } from '../store/photoStore';
import { useHealthStore } from '../store/healthStore';
import { useWaterStore } from '../store/waterStore';
import { useNotesStore } from '../store/notesStore';
import { ScheduleItem } from '../types/schedule';
import { formatDate, formatTime } from '../utils/dateUtils';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import EncryptedImage from '@/components/EncryptedImage';
import DailyNotesModal from '@/components/DailyNotesModal';

const { width: screenWidth } = Dimensions.get('window');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'calendar' | 'schedule'>('calendar');
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  const { getScheduleByDate, addScheduleItem, deleteScheduleItem, updateScheduleItem } = useScheduleStore();
  const { user } = useUserStore();
  const { progressPhotos, getProgressPhotosByDate } = usePhotoStore();
  const { getStepsForDate, getWaterIntakeForDate } = useHealthStore();
  const { getWaterIntakeByDate } = useWaterStore();
  const { getNoteByDate } = useNotesStore();

  useEffect(() => {
    if (user) {
      const items = getScheduleByDate(user.id, selectedDate);
      setScheduleItems(items);
    }
  }, [user, selectedDate, getScheduleByDate]);

  // Get dates for calendar view
  const getDatesForCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const dayOfWeek = firstDay.getDay();
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - dayOfWeek);
    
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Get photos for a specific date
  const getPhotosForDate = (date: Date) => {
    return progressPhotos.filter(photo => {
      const photoDate = new Date(photo.date);
      return photoDate.toDateString() === date.toDateString();
    });
  };

  // Get health data for a specific date
  const getHealthDataForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const stepLog = getStepsForDate(dateString);
    const waterIntake = getWaterIntakeByDate(date);
    
    return {
      steps: stepLog?.steps || 0,
      calories: stepLog ? Math.round(stepLog.steps * 0.04) : 0, // Rough estimate
      waterIntake: waterIntake?.amount || 0,
      waterTarget: waterIntake?.target || 2000
    };
  };

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
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

  const renderCalendarView = () => {
    const dates = getDatesForCalendar();
    const healthData = getHealthDataForDate(selectedDate);
    const photosForDate = getPhotosForDate(selectedDate);

    return (
      <View style={styles.calendarContainer}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.monthButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {new Date(currentYear, currentMonth).toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric'
            })}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.monthButton}>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {DAYS.map(day => (
            <Text key={day} style={styles.dayHeader}>{day}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {dates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const photosForDate = getPhotosForDate(date);
            const hasPhotos = photosForDate.length > 0;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarCell,
                  !isCurrentMonth && styles.otherMonthCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedCell,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[
                  styles.dateText,
                  !isCurrentMonth && styles.otherMonthText,
                  isToday && styles.todayText,
                  isSelected && styles.selectedText,
                ]}>
                  {date.getDate()}
                </Text>
                
                {hasPhotos && (
                  <View style={styles.photoIndicator}>
                    <View style={styles.photoDot} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Date Details */}
        <View style={styles.selectedDateDetails}>
          <Text style={styles.selectedDateTitle}>
            {selectedDate.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>

          {/* Health & Activity Section */}
          <View style={styles.healthSection}>
            <Text style={styles.sectionTitle}>Health & Activity</Text>
            <View style={styles.healthGrid}>
              <View style={styles.healthItem}>
                <Ionicons name="footsteps" size={20} color={colors.primary} />
                <Text style={styles.healthValue}>{healthData.steps.toLocaleString()}</Text>
                <Text style={styles.healthLabel}>Steps</Text>
              </View>
              <View style={styles.healthItem}>
                <Ionicons name="flame" size={20} color={colors.warning} />
                <Text style={styles.healthValue}>{healthData.calories}</Text>
                <Text style={styles.healthLabel}>Calories</Text>
              </View>
              <View style={styles.healthItem}>
                <Ionicons name="water" size={20} color={colors.info} />
                <Text style={styles.healthValue}>{healthData.waterIntake}ml</Text>
                <Text style={styles.healthLabel}>Water</Text>
              </View>
            </View>
          </View>

          {/* Progress Photos Section */}
          {photosForDate.length > 0 && (
            <View style={styles.photosSection}>
              <Text style={styles.sectionTitle}>Progress Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalPhotos}>
                {photosForDate.map((photo) => (
                  <TouchableOpacity 
                    key={photo.id}
                    style={styles.horizontalPhotoItem}
                    onPress={() => {
                      // Navigate to progress photos screen
                      router.push('/progress-photos');
                    }}
                  >
                    <EncryptedImage 
                      uri={photo.uri} 
                      style={styles.horizontalPhotoThumbnail}
                      fallbackUri="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    />
                    <Text style={styles.horizontalPhotoCategory}>{photo.category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Daily Notes & Reflections */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Daily Notes & Reflections</Text>
            <TouchableOpacity 
              style={styles.notesInput}
              onPress={() => setShowNotesModal(true)}
            >
              <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.notesPlaceholder}>
                {(() => {
                  const note = getNoteByDate(selectedDate.toISOString());
                  return note ? note.notes.substring(0, 50) + (note.notes.length > 50 ? '...' : '') : 'Add your thoughts and reflections for today...';
                })()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderScheduleView = () => {
    return (
      <View style={styles.scheduleContainer}>
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 1);
            setSelectedDate(newDate);
          }} style={styles.dateButton}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity onPress={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            setSelectedDate(newDate);
          }} style={styles.dateButton}>
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
      </View>
    );
  };

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

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
          onPress={() => setViewMode('calendar')}
        >
          <Ionicons name="calendar" size={16} color={viewMode === 'calendar' ? colors.white : colors.text} />
          <Text style={[
            styles.toggleText, 
            viewMode === 'calendar' && styles.activeToggleText
          ]}>
            Calendar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'schedule' && styles.activeToggle]}
          onPress={() => setViewMode('schedule')}
        >
          <Ionicons name="list" size={16} color={viewMode === 'schedule' ? colors.white : colors.text} />
          <Text style={[
            styles.toggleText, 
            viewMode === 'schedule' && styles.activeToggleText
          ]}>
            Schedule
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'calendar' ? renderCalendarView() : renderScheduleView()}
      </ScrollView>
      
      {/* Daily Notes Modal */}
      <DailyNotesModal
        visible={showNotesModal}
        date={selectedDate}
        onClose={() => setShowNotesModal(false)}
      />
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  activeToggleText: {
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarContainer: {
    flex: 1,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  calendarCell: {
    width: (screenWidth - 40) / 7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  todayCell: {
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  otherMonthText: {
    color: colors.textLight,
  },
  todayText: {
    color: colors.primary,
    fontFamily: fonts.weight.semibold,
  },
  selectedText: {
    color: colors.white,
    fontFamily: fonts.weight.semibold,
  },
  photoIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  photoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  selectedDateDetails: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 16,
  },
  healthSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 12,
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthValue: {
    fontSize: 18,
    fontFamily: fonts.weight.semibold,
    color: colors.text,
    marginTop: 4,
  },
  healthLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  photosSection: {
    marginBottom: 20,
  },
  horizontalPhotos: {
    flexDirection: 'row',
  },
  horizontalPhotoItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  horizontalPhotoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  horizontalPhotoCategory: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  notesPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  scheduleContainer: {
    flex: 1,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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