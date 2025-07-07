import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
  Platform,
  Vibration,
  TextInput,
  ScrollView
} from "react-native";
import { X, Clock, Volume2, VolumeX, Dumbbell } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useWorkoutStore } from "@/store/workoutStore";
import Button from "./Button";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type RestTimerModalProps = {
  visible: boolean;
  onClose: () => void;
  defaultTime?: number;
};

const presetTimes = [30, 60, 90, 120, 180, 300];
const presetSetCounts = [3, 4, 6];
const presetExerciseTimes = [30, 60, 120, 300, 600];

export default function RestTimerModal({ 
  visible, 
  onClose,
  defaultTime = 60
}: RestTimerModalProps) {
  const { 
    startRestTimer, 
    activeTimer, 
    timerSettings,
    setTimerSettings
  } = useWorkoutStore();
  
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [selectedExerciseTime, setSelectedExerciseTime] = useState(timerSettings.exerciseTime || 0);
  const [voiceEnabled, setVoiceEnabled] = useState(timerSettings.voicePrompts);
  const [autoStart, setAutoStart] = useState(timerSettings.autoStartRest);
  const [countdownBeep, setCountdownBeep] = useState(timerSettings.countdownBeep);
  const [selectedSetCount, setSelectedSetCount] = useState(timerSettings.defaultSetCount || 3);
  const [customSetCount, setCustomSetCount] = useState("");
  const [customExerciseTime, setCustomExerciseTime] = useState("");
  
  const insets = useSafeAreaInsets ? useSafeAreaInsets() : { top: 44 };
  
  // Update selected time when defaultTime changes
  useEffect(() => {
    setSelectedTime(defaultTime);
  }, [defaultTime]);
  
  // Update state when timer settings change
  useEffect(() => {
    setVoiceEnabled(timerSettings.voicePrompts);
    setAutoStart(timerSettings.autoStartRest);
    setCountdownBeep(timerSettings.countdownBeep);
    setSelectedSetCount(timerSettings.defaultSetCount || 3);
    setSelectedExerciseTime(timerSettings.exerciseTime || 0);
  }, [timerSettings]);
  
  const handleApplySettings = () => {
      setTimerSettings({
        ...timerSettings,
        voicePrompts: voiceEnabled,
        autoStartRest: autoStart,
        countdownBeep: countdownBeep,
      restTime: selectedTime,
      defaultSetCount: selectedSetCount,
      exerciseTime: selectedExerciseTime,
      });
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16, paddingHorizontal: 18, width: '92%', alignSelf: 'center' }]}> 
              <View style={[styles.header, { marginTop: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
                <Text style={[styles.title, { flex: 1, textAlign: 'left', fontSize: 20, fontWeight: '700', marginLeft: 8 }]}>Workout Timer Settings</Text>
                <TouchableOpacity onPress={onClose} style={[styles.closeButton, { position: 'absolute', right: 8, top: 0, padding: 8 }]}> 
                  <X size={22} color={colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={{ height: 8 }} />
                <Text style={[styles.sectionTitle, { textAlign: 'left', fontSize: 15, marginBottom: 10, marginLeft: 4 }]}>Number of sets per exercise</Text>
                <View style={[styles.timeOptions, { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', marginLeft: 4, marginBottom: 8 }]}>
                  {presetSetCounts.map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.timeOption,
                        selectedSetCount === count && styles.selectedTimeOption,
                      ]}
                      onPress={() => {
                        setSelectedSetCount(count);
                        setCustomSetCount("");
                      }}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          selectedSetCount === count && styles.selectedTimeText,
                        ]}
                      >
                        {count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[
                      styles.timeOption,
                      typeof selectedSetCount === 'number' && !presetSetCounts.includes(selectedSetCount) && styles.selectedTimeOption,
                      { paddingHorizontal: 0, justifyContent: 'center', alignItems: 'center' }
                    ]}
                    onPress={() => {
                      // Focus input if possible (not needed for now)
                    }}
                    activeOpacity={1}
                  >
                    <TextInput
                      style={[
                        styles.timeText,
                        { width: 28, textAlign: 'center', borderBottomWidth: 0, backgroundColor: 'transparent', paddingVertical: 0 },
                        typeof selectedSetCount === 'number' && !presetSetCounts.includes(selectedSetCount) && styles.selectedTimeText
                      ]}
                      keyboardType="numeric"
                      value={customSetCount}
                      onChangeText={text => {
                        setCustomSetCount(text);
                        const num = parseInt(text);
                        if (!isNaN(num) && num > 0) setSelectedSetCount(num);
                      }}
                      placeholder="#"
                      maxLength={2}
                      placeholderTextColor={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.sectionTitle, { textAlign: 'left', fontSize: 15, marginTop: 24, marginBottom: 10, marginLeft: 4 }]}>Rest timer between exercises</Text>
                <View style={[styles.timeOptions, { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', marginLeft: 4, marginBottom: 8 }]}>
                  {presetExerciseTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        selectedExerciseTime === time && styles.selectedTimeOption,
                      ]}
                      onPress={() => {
                        setSelectedExerciseTime(time);
                        setCustomExerciseTime("");
                      }}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          selectedExerciseTime === time && styles.selectedTimeText,
                        ]}
                      >
                        {time >= 60 ? `${time / 60}m` : `${time}s`}
                </Text>
                    </TouchableOpacity>
                  ))}
                  {/* Custom input as a button */}
                  <TouchableOpacity
                    style={[
                      styles.timeOption,
                      typeof selectedExerciseTime === 'number' && !presetExerciseTimes.includes(selectedExerciseTime) && styles.selectedTimeOption,
                      { paddingHorizontal: 0, justifyContent: 'center', alignItems: 'center' }
                    ]}
                    onPress={() => {}}
                    activeOpacity={1}
                  >
                    <TextInput
                      style={[
                        styles.timeText,
                        { width: 28, textAlign: 'center', borderBottomWidth: 0, backgroundColor: 'transparent', paddingVertical: 0 },
                        typeof selectedExerciseTime === 'number' && !presetExerciseTimes.includes(selectedExerciseTime) && styles.selectedTimeText
                      ]}
                      keyboardType="numeric"
                      value={customExerciseTime}
                      onChangeText={text => {
                        setCustomExerciseTime(text);
                        const num = parseInt(text);
                        if (!isNaN(num) && num > 0) setSelectedExerciseTime(num);
                      }}
                      placeholder="#"
                      maxLength={3}
                      placeholderTextColor={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.sectionTitle, { textAlign: 'left', fontSize: 15, marginTop: 24, marginBottom: 10, marginLeft: 4 }]}>Rest timer between sets</Text>
                <View style={[styles.timeOptions, { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', marginLeft: 4, marginBottom: 8 }]}>
                  {presetTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        selectedTime === time && styles.selectedTimeOption,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          selectedTime === time && styles.selectedTimeText,
                        ]}
                      >
                        {time >= 60 ? `${time / 60}m` : `${time}s`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.settingsContainer}>
                  <View style={styles.settingRow}>
                    <View style={styles.settingLabelContainer}>
                      <Volume2 size={20} color={colors.text} style={styles.settingIcon} />
                      <Text style={styles.settingLabel}>Voice prompts</Text>
                    </View>
                    
                    {Platform.OS === 'web' ? (
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          voiceEnabled && styles.toggleButtonActive
                        ]}
                        onPress={() => setVoiceEnabled(!voiceEnabled)}
                      >
                        <View style={[
                          styles.toggleKnob,
                          voiceEnabled && styles.toggleKnobActive
                        ]} />
                      </TouchableOpacity>
                    ) : (
                      <Switch
                        value={voiceEnabled}
                        onValueChange={setVoiceEnabled}
                        trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                        thumbColor={voiceEnabled ? colors.white : colors.background}
                      />
                    )}
                  </View>
                  
                  <View style={styles.settingRow}>
                    <View style={styles.settingLabelContainer}>
                      <Clock size={20} color={colors.text} style={styles.settingIcon} />
                      <Text style={styles.settingLabel}>Auto-start after set</Text>
                    </View>
                    
                    {Platform.OS === 'web' ? (
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          autoStart && styles.toggleButtonActive
                        ]}
                        onPress={() => setAutoStart(!autoStart)}
                      >
                        <View style={[
                          styles.toggleKnob,
                          autoStart && styles.toggleKnobActive
                        ]} />
                      </TouchableOpacity>
                    ) : (
                      <Switch
                        value={autoStart}
                        onValueChange={setAutoStart}
                        trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                        thumbColor={autoStart ? colors.white : colors.background}
                      />
                    )}
                  </View>
                  
                  <View style={styles.settingRow}>
                    <View style={styles.settingLabelContainer}>
                      <Volume2 size={20} color={colors.text} style={styles.settingIcon} />
                      <Text style={styles.settingLabel}>Countdown beep</Text>
                    </View>
                    
                    {Platform.OS === 'web' ? (
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          countdownBeep && styles.toggleButtonActive
                        ]}
                        onPress={() => setCountdownBeep(!countdownBeep)}
                      >
                        <View style={[
                          styles.toggleKnob,
                          countdownBeep && styles.toggleKnobActive
                        ]} />
                      </TouchableOpacity>
                    ) : (
                      <Switch
                        value={countdownBeep}
                        onValueChange={setCountdownBeep}
                        trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                        thumbColor={countdownBeep ? colors.white : colors.background}
                      />
                    )}
                  </View>
                </View>
                
                <View style={styles.buttonContainer}>
                  <Button
                    title="Apply Settings"
                    onPress={handleApplySettings}
                    style={styles.startButton}
                  />
                  
                  <Button
                    title="Close"
                    onPress={onClose}
                    variant="outline"
                    style={styles.closeButton}
                  />
                </View>
                <View style={{ height: 8 }} />
              </ScrollView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "92%",
    maxWidth: 370,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 0,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.timerBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  timeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 4,
  },
  timeOption: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    margin: 5,
    minWidth: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTimeOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  selectedTimeText: {
    color: colors.white,
    fontWeight: "700",
  },
  settingsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  startButton: {
    width: "100%",
  },
  closeButton: {
    width: "100%",
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.text,
    fontSize: 15,
    marginBottom: 0,
  },
});