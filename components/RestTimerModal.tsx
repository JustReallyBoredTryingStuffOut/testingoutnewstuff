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
  Vibration
} from "react-native";
import { X, Clock, Volume2, VolumeX } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useWorkoutStore } from "@/store/workoutStore";
import Button from "./Button";

type RestTimerModalProps = {
  visible: boolean;
  onClose: () => void;
  defaultTime?: number;
};

const presetTimes = [30, 60, 90, 120, 180, 300];

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
  const [voiceEnabled, setVoiceEnabled] = useState(timerSettings.voicePrompts);
  const [autoStart, setAutoStart] = useState(timerSettings.autoStartRest);
  const [countdownBeep, setCountdownBeep] = useState(timerSettings.countdownBeep);
  
  // Update selected time when defaultTime changes
  useEffect(() => {
    setSelectedTime(defaultTime);
  }, [defaultTime]);
  
  // Update state when timer settings change
  useEffect(() => {
    setVoiceEnabled(timerSettings.voicePrompts);
    setAutoStart(timerSettings.autoStartRest);
    setCountdownBeep(timerSettings.countdownBeep);
  }, [timerSettings]);
  
  const handleStartRest = () => {
    startRestTimer(selectedTime);
    
    // Update timer settings if they've changed
    if (voiceEnabled !== timerSettings.voicePrompts || 
        autoStart !== timerSettings.autoStartRest ||
        countdownBeep !== timerSettings.countdownBeep ||
        selectedTime !== timerSettings.defaultRestTime) {
      setTimerSettings({
        ...timerSettings,
        voicePrompts: voiceEnabled,
        autoStartRest: autoStart,
        countdownBeep: countdownBeep,
        defaultRestTime: selectedTime
      });
    }
    
    // Provide haptic feedback when starting timer
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
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Set Rest Timer</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.content}>
                <View style={styles.iconContainer}>
                  <Clock size={40} color={colors.primary} />
                </View>
                
                <Text style={styles.description}>
                  Set a timer for your rest period between sets
                </Text>
                
                <View style={styles.timeOptions}>
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
                    title="Start Rest Timer"
                    onPress={handleStartRest}
                    style={styles.startButton}
                  />
                  
                  <Button
                    title="Close"
                    onPress={onClose}
                    variant="outline"
                    style={styles.closeButton}
                  />
                </View>
              </View>
            </View>
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
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
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
    marginBottom: 24,
    gap: 12,
  },
  timeOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  selectedTimeOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  selectedTimeText: {
    color: "#FFFFFF",
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
});