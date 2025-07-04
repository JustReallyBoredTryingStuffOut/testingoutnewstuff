import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { X, Calendar, Target, ChevronDown, ChevronUp, Droplet } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from './Button';
import DateTimePicker from '@react-native-community/datetimepicker';

interface GoalPromptProps {
  visible: boolean;
  prompt: string;
  onClose: () => void;
  onSubmit: (goalText: string, timeframe: "weekly" | "monthly", targetDate?: string, waterBottleSize?: number) => void;
  isLoading?: boolean;
  examples?: string[];
  timeframe: "weekly" | "monthly";
  onTimeframeChange: (timeframe: "weekly" | "monthly") => void;
}

const GoalPrompt: React.FC<GoalPromptProps> = ({ 
  visible, 
  prompt, 
  onClose, 
  onSubmit, 
  isLoading = false,
  examples = [],
  timeframe,
  onTimeframeChange
}) => {
  const { colors } = useTheme();
  const [goalText, setGoalText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [showWaterBottlePrompt, setShowWaterBottlePrompt] = useState(false);
  const [waterBottleSize, setWaterBottleSize] = useState<string>('');
  
  // Calculate default target date based on timeframe
  useEffect(() => {
    if (visible) {
      const now = new Date();
      let defaultDate = new Date();
      
      if (timeframe === "weekly") {
        // Set to next week
        defaultDate.setDate(now.getDate() + 7);
      } else {
        // Set to next month
        defaultDate.setMonth(now.getMonth() + 1);
      }
      
      setTargetDate(defaultDate);
    }
  }, [visible, timeframe]);
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!visible) {
      setGoalText('');
      setShowExamples(false);
      setShowDatePicker(false);
      setShowWaterBottlePrompt(false);
      setWaterBottleSize('');
    }
  }, [visible]);
  
  const handleSubmit = () => {
    if (goalText.trim()) {
      // Check if it's a water goal
      const isWaterGoal = goalText.toLowerCase().includes('water') || 
                          goalText.toLowerCase().includes('drink') || 
                          goalText.toLowerCase().includes('hydrate') ||
                          goalText.toLowerCase().includes('liter');
      
      if (isWaterGoal && !showWaterBottlePrompt) {
        // Show water bottle size prompt
        setShowWaterBottlePrompt(true);
        return;
      }
      
      // If water bottle prompt is shown and size is entered, or it's not a water goal
      let bottleSize: number | undefined = undefined;
      
      if (waterBottleSize) {
        // Replace comma with dot for decimal parsing
        const normalizedSize = waterBottleSize.replace(',', '.');
        const parsedSize = parseFloat(normalizedSize);
        if (!isNaN(parsedSize) && parsedSize > 0) {
          bottleSize = parsedSize;
        }
      }
      
      onSubmit(goalText, timeframe, targetDate?.toISOString(), bottleSize);
      
      // Reset water bottle prompt
      setShowWaterBottlePrompt(false);
    }
  };
  
  const handleSelectExample = (example: string) => {
    setGoalText(example);
    setShowExamples(false);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Close the date picker on Android after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    // Only update the date if a date was actually selected
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };
  
  const toggleTimeframe = () => {
    onTimeframeChange(timeframe === "weekly" ? "monthly" : "weekly");
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return "Set Target Date";
    
    // Format date as "Month Day, Year" (e.g., "June 15, 2025")
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to open date picker
  const openDatePicker = () => {
    setShowDatePicker(true);
  };
  
  // Handle water bottle size input
  const handleWaterBottleSizeChange = (text: string) => {
    // Allow only numbers and a single decimal separator (comma or dot)
    const sanitizedText = text.replace(/[^0-9.,]/g, '');
    
    // Ensure only one decimal separator
    const commaCount = (sanitizedText.match(/,/g) || []).length;
    const dotCount = (sanitizedText.match(/\./g) || []).length;
    
    if (commaCount + dotCount <= 1) {
      setWaterBottleSize(sanitizedText);
    }
  };
  
  // Calculate number of bottles needed
  const calculateBottlesNeeded = () => {
    if (!waterBottleSize || (isNaN(parseFloat(waterBottleSize.replace(',', '.'))) || parseFloat(waterBottleSize.replace(',', '.')) <= 0)) {
      return null;
    }
    
    // Extract target water amount from goal text (assuming it's in liters)
    const matches = goalText.match(/(\d+(\.\d+)?)\s*(l|liter|liters)/i);
    if (!matches || !matches[1]) return null;
    
    const targetLiters = parseFloat(matches[1]);
    const bottleSize = parseFloat(waterBottleSize.replace(',', '.'));
    
    // Calculate bottles needed
    const bottlesNeeded = Math.ceil(targetLiters / bottleSize);
    return bottlesNeeded;
  };
  
  const bottlesNeeded = calculateBottlesNeeded();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable 
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable 
          style={[styles.container, { backgroundColor: colors.card }]} 
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {timeframe === "weekly" ? "Weekly Goal" : "Monthly Goal"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {showWaterBottlePrompt ? (
            // Water bottle size prompt
            <View style={styles.waterBottlePromptContainer}>
              <View style={styles.waterIconContainer}>
                <Droplet size={40} color={colors.primary} />
              </View>
              
              <Text style={[styles.waterPromptTitle, { color: colors.text }]}>
                Water Bottle Size
              </Text>
              
              <Text style={[styles.waterPromptDescription, { color: colors.textSecondary }]}>
                To help track your water intake, please enter the size of your water bottle in liters.
              </Text>
              
              <View style={styles.waterInputContainer}>
                <TextInput
                  style={[
                    styles.waterInput, 
                    { 
                      backgroundColor: colors.background, 
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="0.5"
                  placeholderTextColor={colors.textLight}
                  value={waterBottleSize}
                  onChangeText={handleWaterBottleSizeChange}
                  keyboardType="numeric"
                  autoFocus
                />
                <Text style={[styles.waterInputUnit, { color: colors.text }]}>L</Text>
              </View>
              
              {bottlesNeeded !== null && (
                <View style={[styles.bottlesNeededContainer, { backgroundColor: colors.background }]}>
                  <Text style={[styles.bottlesNeededText, { color: colors.text }]}>
                    You'll need to drink approximately {bottlesNeeded} {bottlesNeeded === 1 ? 'bottle' : 'bottles'} per day to reach your goal.
                  </Text>
                </View>
              )}
              
              <View style={styles.waterButtonsContainer}>
                <Button
                  title="Back"
                  onPress={() => setShowWaterBottlePrompt(false)}
                  variant="outline"
                  style={styles.waterBackButton}
                />
                <Button
                  title={isLoading ? "Setting Goal..." : "Set Goal"}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={styles.waterSubmitButton}
                  icon={isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
                />
              </View>
            </View>
          ) : (
            // Regular goal prompt
            <>
              <Text style={[styles.prompt, { color: colors.textSecondary }]}>{prompt}</Text>
              
              <View style={styles.timeframeSelector}>
                <TouchableOpacity 
                  style={[
                    styles.timeframeOption, 
                    timeframe === "weekly" && { backgroundColor: colors.primary },
                    { borderColor: colors.border }
                  ]}
                  onPress={() => onTimeframeChange("weekly")}
                >
                  <Target size={16} color={timeframe === "weekly" ? "#FFFFFF" : colors.text} />
                  <Text 
                    style={[
                      styles.timeframeText, 
                      { color: timeframe === "weekly" ? "#FFFFFF" : colors.text }
                    ]}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.timeframeOption, 
                    timeframe === "monthly" && { backgroundColor: colors.primary },
                    { borderColor: colors.border }
                  ]}
                  onPress={() => onTimeframeChange("monthly")}
                >
                  <Calendar size={16} color={timeframe === "monthly" ? "#FFFFFF" : colors.text} />
                  <Text 
                    style={[
                      styles.timeframeText, 
                      { color: timeframe === "monthly" ? "#FFFFFF" : colors.text }
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: colors.background, 
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="Enter your fitness goal..."
                  placeholderTextColor={colors.textLight}
                  value={goalText}
                  onChangeText={setGoalText}
                  multiline
                  autoFocus
                />
              </View>
              
              {/* Target Date Button - Made more prominent and clearly interactive */}
              <TouchableOpacity 
                style={[
                  styles.targetDateButton, 
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                    borderWidth: 1
                  }
                ]}
                onPress={openDatePicker}
                activeOpacity={0.7}
              >
                <Calendar size={20} color={colors.primary} />
                <Text style={[styles.targetDateText, { color: colors.text }]}>
                  {targetDate 
                    ? `Target Date: ${formatDate(targetDate)}` 
                    : "Set Target Date (Optional)"}
                </Text>
                <View style={styles.editIndicator}>
                  <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
                </View>
              </TouchableOpacity>
              
              {/* Date Picker */}
              {showDatePicker && (
                <View style={[styles.datePickerContainer, { backgroundColor: colors.background }]}>
                  {Platform.OS === 'ios' && (
                    <View style={styles.datePickerHeader}>
                      <Text style={[styles.datePickerTitle, { color: colors.text }]}>
                        Select Target Date
                      </Text>
                    </View>
                  )}
                  
                  <DateTimePicker
                    value={targetDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    style={styles.datePicker}
                    testID="dateTimePicker"
                  />
                  
                  {Platform.OS === 'ios' && (
                    <View style={styles.datePickerActions}>
                      <TouchableOpacity 
                        style={[styles.datePickerCancel, { backgroundColor: colors.background }]}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={[styles.datePickerButtonText, { color: colors.error }]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.datePickerDone, { backgroundColor: colors.background }]}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={[styles.datePickerButtonText, { color: colors.primary }]}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.examplesHeader}
                onPress={() => setShowExamples(!showExamples)}
              >
                <Text style={[styles.examplesTitle, { color: colors.primary }]}>
                  Need inspiration? View examples
                </Text>
                {showExamples ? (
                  <ChevronUp size={20} color={colors.primary} />
                ) : (
                  <ChevronDown size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
              
              {showExamples && (
                <ScrollView style={styles.examplesList} contentContainerStyle={styles.examplesContent}>
                  {examples.map((example, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={[styles.exampleItem, { backgroundColor: colors.background }]}
                      onPress={() => handleSelectExample(example)}
                    >
                      <Text style={[styles.exampleText, { color: colors.text }]}>{example}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              
              <View style={styles.footer}>
                <Button
                  title="Cancel"
                  onPress={onClose}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title={isLoading ? "Setting Goal..." : "Set Goal"}
                  onPress={handleSubmit}
                  disabled={!goalText.trim() || isLoading}
                  style={styles.submitButton}
                  icon={isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
                />
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  prompt: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  timeframeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeframeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  targetDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  targetDateText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  editIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editText: {
    fontSize: 12,
    fontWeight: '500',
  },
  datePickerContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  datePickerHeader: {
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePicker: {
    width: '100%',
    ...Platform.select({
      ios: {
        height: 200,
      },
    }),
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  datePickerCancel: {
    padding: 8,
    borderRadius: 8,
  },
  datePickerDone: {
    padding: 8,
    borderRadius: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  examplesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  examplesContent: {
    paddingBottom: 8,
  },
  exampleItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
  },
  // Water bottle prompt styles
  waterBottlePromptContainer: {
    alignItems: 'center',
  },
  waterIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterPromptTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  waterPromptDescription: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  waterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  waterInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  waterInputUnit: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  bottlesNeededContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  bottlesNeededText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  waterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  waterBackButton: {
    flex: 1,
    marginRight: 8,
  },
  waterSubmitButton: {
    flex: 2,
  },
});

export default GoalPrompt;