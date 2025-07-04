import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Alert,
  AppState,
  AppStateStatus,
  Platform,
  Dimensions
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { 
  Camera, 
  Plus, 
  Trash2, 
  X, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Lock, 
  Heart, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore, ProgressPhoto } from "@/store/photoStore";
import { useMacroStore } from "@/store/macroStore";
import Button from "@/components/Button";
import EncryptedImage from "@/components/EncryptedImage";
import { cleanupTempDecryptedFiles } from "@/utils/fileEncryption";
import ProgressPhotoCapture from "@/components/ProgressPhotoCapture";

const { width: screenWidth } = Dimensions.get('window');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const { progressPhotos, addProgressPhoto, deleteProgressPhoto } = usePhotoStore();
  const { userProfile } = useMacroStore();
  
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProgressPhoto["category"]>("front");
  const [viewMode, setViewMode] = useState<'calendar' | 'gallery'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEducationalTip, setShowEducationalTip] = useState(true);
  const [healthBannerMinimized, setHealthBannerMinimized] = useState(false);
  
  // Mock weight progress for demo
  const weightProgress = {
    currentWeight: 75,
    targetWeight: 70,
    startWeight: 80
  };
  
  // Clean up temp files when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
      // Also clean up when component unmounts
      cleanupTempDecryptedFiles().catch(err => 
        console.warn('Error cleaning up temp files on unmount:', err)
      );
    };
  }, []);
  
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      // App is going to background, clean up temp files
      cleanupTempDecryptedFiles().catch(err => 
        console.warn('Error cleaning up temp files on background:', err)
      );
    }
    
    setAppState(nextAppState);
  };
  
  // Get current date
  const getCurrentDate = () => new Date();
  
  // Get educational tip based on user's fitness level and goals
  const getEducationalTip = () => {
    const isBeginnerOrIntermediate = userProfile?.fitnessLevel === 'beginner' ||
      userProfile?.fitnessLevel === 'intermediate';
    const fitnessGoal = userProfile?.fitnessGoal;
    
    if (isBeginnerOrIntermediate) {
      if (fitnessGoal === 'lose_weight') {
        return {
          title: "Be Patient with Visual Changes",
          content: "Weight loss changes happen gradually and may not be immediately visible in photos. Focus on consistency rather than daily changes. Take photos at the same time of day (preferably morning) to avoid variations from food intake and water retention.",
          icon: <Heart size={20} color={colors.primary} />
        };
      } else if (fitnessGoal === 'build_muscle') {
        return {
          title: "Muscle Building Takes Time",
          content: "Building visible muscle mass typically takes 8-12 weeks for beginners. Don't get discouraged if changes aren't immediately apparent. Your strength gains will come before visible changes, so celebrate those wins too!",
          icon: <TrendingUp size={20} color={colors.primary} />
        };
      }
    }
    
    return {
      title: "Consistency is Key",
      content: "Take photos under similar lighting conditions, at the same time of day, and in the same poses. Morning photos are often best as they show your body before food intake affects your appearance. Remember, progress isn't always linear!",
      icon: <Clock size={20} color={colors.primary} />
    };
  };
  
  // Get health reminder based on user's fitness level
  const getHealthReminder = () => {
    // Always show health-first message for all users
    return {
      title: "Your Health & Wellbeing Come First",
      content: "Fitness is a lifelong journey, not a race. Real progress takes months, not weeks. Focus on how you feel - increased energy, better sleep, and improved strength are just as important as visual changes. If you find yourself obsessing over photos or feeling negative about your body, consider taking a break from progress photos and speak with a healthcare professional. Your mental health matters more than any photo.",
      type: "health" as const
    };
  };
  
  // Get dates for calendar view
  const getDatesForCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the start date (Sunday of the week containing the 1st)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - dayOfWeek);
    
    const dates = [];
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
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
  
  // Group photos by date
  const photosByDate = progressPhotos.reduce((acc, photo) => {
    const date = new Date(photo.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, ProgressPhoto[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(photosByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  
  const handleAddPhoto = (category: ProgressPhoto["category"]) => {
    setSelectedCategory(category);
    setShowCaptureModal(true);
  };
  
  const handlePhotoTaken = async (photo: ProgressPhoto) => {
    await addProgressPhoto(photo);
    setShowCaptureModal(false);
  };
  
  const handleDeletePhoto = (photo: ProgressPhoto) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo? The photo will be securely wiped from your device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteProgressPhoto(photo.id);
            setSelectedPhoto(null);
          },
          style: "destructive",
        },
      ]
    );
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
  
  const renderCalendarView = () => {
    const dates = getDatesForCalendar();
    
    return (
      <View style={styles.calendarContainer}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>
              {new Date(currentYear, currentMonth).toLocaleString('default', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                const today = getCurrentDate();
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
                setSelectedDate(today);
              }}
              style={styles.todayButton}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
            <ChevronRight size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Day Headers */}
        <View style={styles.dayHeaderRow}>
          {DAYS.map((day) => (
            <View key={day} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>
        
        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {dates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const today = getCurrentDate();
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
        
        {/* Selected Date Photos */}
        {getPhotosForDate(selectedDate).length > 0 && (
          <View style={styles.selectedDatePhotos}>
            <Text style={styles.selectedDateTitle}>
              Photos from {selectedDate.toLocaleDateString()}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalPhotos}>
              {getPhotosForDate(selectedDate).map((photo) => (
                <TouchableOpacity 
                  key={photo.id}
                  style={styles.horizontalPhotoItem}
                  onPress={() => setSelectedPhoto(photo)}
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
      </View>
    );
  };
  
  const renderGalleryView = () => {
    if (progressPhotos.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Camera size={40} color={colors.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No Progress Photos</Text>
          <Text style={styles.emptyText}>
            Start documenting your fitness journey with regular progress photos
          </Text>
          <Button
            title="Take Your First Photo"
            onPress={() => handleAddPhoto("front")}
            icon={<Plus size={18} color="#FFFFFF" />}
            style={styles.emptyButton}
          />
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.photosContainer}>
        {sortedDates.map((date) => (
          <View key={date} style={styles.dateSection}>
            <Text style={styles.dateTitle}>
              {new Date(date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            
            <View style={styles.photosGrid}>
              {photosByDate[date].map((photo) => (
                <TouchableOpacity 
                  key={photo.id} 
                  style={styles.photoItem}
                  onPress={() => setSelectedPhoto(photo)}
                >
                  <EncryptedImage 
                    uri={photo.uri} 
                    style={styles.photoThumbnail}
                    fallbackUri="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  />
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoCategory}>{photo.category}</Text>
                    <Text style={styles.photoWeight}>{photo.weight} kg</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };
  
  const educationalTip = getEducationalTip();
  const healthReminder = getHealthReminder();
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Progress Photos",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Health Reminder Banner - Minimizable for Experienced Users */}
        <View style={styles.healthReminderBanner}>
          <TouchableOpacity 
            style={styles.healthReminderToggle}
            onPress={() => setHealthBannerMinimized(!healthBannerMinimized)}
          >
            <View style={styles.healthReminderHeader}>
              <View style={styles.healthReminderIconContainer}>
                <Heart size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.healthReminderTitle}>
                {healthBannerMinimized ? "Health & Wellbeing" : healthReminder.title}
              </Text>
              <View style={styles.toggleIcon}>
                {healthBannerMinimized ? (
                  <ChevronRight size={16} color={colors.text} />
                ) : (
                  <ChevronLeft size={16} color={colors.text} />
                )}
              </View>
            </View>
          </TouchableOpacity>
          
          {!healthBannerMinimized && (
            <View style={styles.healthReminderContent}>
              <Text style={styles.healthReminderText}>{healthReminder.content}</Text>
            </View>
          )}
        </View>
        
        {/* Educational Tip Banner */}
        {showEducationalTip && (
          <View style={styles.tipBanner}>
            <View style={styles.tipContent}>
              <View style={styles.tipIconContainer}>
                {educationalTip.icon}
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{educationalTip.title}</Text>
                <Text style={styles.tipText}>{educationalTip.content}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.tipCloseButton}
              onPress={() => setShowEducationalTip(false)}
            >
              <X size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Track Your Progress</Text>
          <Text style={styles.subtitle}>
            Document your fitness journey with regular photos
          </Text>
          <View style={styles.securityContainer}>
            <Lock size={12} color={colors.primary} />
            <Text style={styles.securityNote}>
              Photos are encrypted and stored locally for your privacy
            </Text>
          </View>
        </View>
        
        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
            onPress={() => setViewMode('calendar')}
          >
            <CalendarIcon size={16} color={viewMode === 'calendar' ? colors.white : colors.text} />
            <Text style={[
              styles.toggleText, 
              viewMode === 'calendar' && styles.activeToggleText
            ]}>
              Calendar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'gallery' && styles.activeToggle]}
            onPress={() => setViewMode('gallery')}
          >
            <Camera size={16} color={viewMode === 'gallery' ? colors.white : colors.text} />
            <Text style={[
              styles.toggleText, 
              viewMode === 'gallery' && styles.activeToggleText
            ]}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleAddPhoto("front")}
          >
            <Camera size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Front</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleAddPhoto("side")}
          >
            <Camera size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Side</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleAddPhoto("back")}
          >
            <Camera size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleAddPhoto("other")}
          >
            <Plus size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Other</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={styles.contentContainer}>
          {viewMode === 'calendar' ? renderCalendarView() : renderGalleryView()}
        </View>
      </ScrollView>
      
      {/* Photo Capture Modal */}
      <Modal
        visible={showCaptureModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ProgressPhotoCapture
          category={selectedCategory}
          weight={weightProgress.currentWeight}
          onPhotoTaken={handlePhotoTaken}
          onCancel={() => setShowCaptureModal(false)}
        />
      </Modal>
      
      {/* Photo Detail Modal */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onDismiss={() => {
          cleanupTempDecryptedFiles().catch(err => 
            console.warn('Error cleaning up temp files on modal dismiss:', err)
          );
        }}
      >
        {selectedPhoto && (
          <View style={styles.photoDetailOverlay}>
            <View style={styles.photoDetailContainer}>
              <View style={styles.photoDetailHeader}>
                <Text style={styles.photoDetailTitle}>
                  {selectedPhoto.category.charAt(0).toUpperCase() + selectedPhoto.category.slice(1)} View
                </Text>
                <TouchableOpacity 
                  onPress={() => setSelectedPhoto(null)}
                  style={styles.closeButton}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <EncryptedImage 
                uri={selectedPhoto.uri} 
                style={styles.photoDetailImage}
                fallbackUri="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              />
              
              <View style={styles.photoDetailInfo}>
                <Text style={styles.photoDetailDate}>
                  {new Date(selectedPhoto.date).toLocaleDateString()}
                </Text>
                <Text style={styles.photoDetailWeight}>
                  Weight: {selectedPhoto.weight} kg
                </Text>
                {selectedPhoto.notes && (
                  <Text style={styles.photoDetailNotes}>
                    {selectedPhoto.notes}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeletePhoto(selectedPhoto)}
              >
                <Trash2 size={18} color="#FF3B30" />
                <Text style={styles.deleteButtonText}>Delete Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
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
  tipBanner: {
    backgroundColor: colors.card,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipCloseButton: {
    padding: 4,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  securityNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeToggleText: {
    color: colors.white,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderCell: {
    flex: 1,
    maxWidth: '14.28%', // Same as calendar cells
    minWidth: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    width: '100%',
  },
  calendarCell: {
    flex: 1,
    maxWidth: '14.28%', // 100/7 = 14.28% - ensures exactly 7 columns
    minWidth: '14.28%',
    height: 60,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  todayCell: {
    backgroundColor: colors.backgroundLight,
  },
  selectedCell: {
    backgroundColor: colors.primary,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  otherMonthText: {
    color: colors.textLight,
  },
  todayText: {
    color: colors.primary,
    fontWeight: '700',
  },
  selectedText: {
    color: colors.white,
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
  selectedDatePhotos: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  photosContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: (screenWidth - 48) / 3,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoThumbnail: {
    width: '100%',
    height: 120,
  },
  photoInfo: {
    padding: 8,
  },
  photoCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
  },
  photoWeight: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  photoDetailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoDetailContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    margin: 20,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  photoDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  photoDetailImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  photoDetailInfo: {
    marginBottom: 20,
  },
  photoDetailDate: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  photoDetailWeight: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  photoDetailNotes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
  },
  healthReminderBanner: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16, // Reduced from 20 to 16
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  healthReminderContent: {
    paddingTop: 4,
    paddingLeft: 28, // Align with the title text (icon width + margin)
    paddingRight: 8,
    maxHeight: 150, // Prevent banner from getting too tall
  },
  healthReminderIconContainer: {
    marginRight: 8, // Reduced from 16 to 8
    minWidth: 20, // Reduced from 28 to 20
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthReminderTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  healthReminderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
    lineHeight: 20, // Reduced to match icon height better
    flex: 1, // Take up remaining space
    alignSelf: 'center', // Ensure vertical alignment with icon
  },
  healthReminderText: {
    fontSize: 14, // Slightly smaller for better fit
    color: '#2D3748',
    lineHeight: 20, // Reduced line height for compactness
    letterSpacing: 0.2,
  },
  healthReminderToggle: {
    // No additional styles needed - the TouchableOpacity wraps the header
  },
  healthReminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    minHeight: 28, // Ensure consistent height
  },
  toggleIcon: {
    marginLeft: 8,
    opacity: 0.7,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});