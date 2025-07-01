import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Vibration } from "react-native";
import { Play, Pause, RotateCcw, SkipForward, Settings } from "lucide-react-native";
import * as Speech from 'expo-speech';
import { colors } from "@/constants/colors";
import { useWorkoutStore } from "@/store/workoutStore";
import { useTheme } from "@/context/ThemeContext";

type TimerProps = {
  compact?: boolean;
  showSettings?: boolean;
  onSettingsPress?: () => void;
};

// Voice configuration for a more natural female voice
const voiceConfig = {
  language: 'en-US',
  pitch: 1.0,
  rate: 0.9,
};

// Helper function to speak with the default voice
const speakWithDefaultVoice = (text: string) => {
  if (Platform.OS === 'web') return;
  
  Speech.speak(text, voiceConfig);
};

export default function Timer({ 
  compact = false, 
  showSettings = false,
  onSettingsPress
}: TimerProps) {
  const { colors } = useTheme();
  const { 
    activeTimer, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipRestTimer,
    timerSettings
  } = useWorkoutStore();
  
  const [displayTime, setDisplayTime] = useState("00:00");
  const [lastSpokenSecond, setLastSpokenSecond] = useState(-1);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        let elapsedTime: number;
        
        if (activeTimer.isResting) {
          // For rest timer, count down from restDuration
          const timeElapsed = (currentTime - activeTimer.startTime) / 1000;
          const timeRemaining = Math.max(0, activeTimer.restDuration - timeElapsed);
          
          // Voice countdown for the last 10 seconds
          if (timerSettings.voicePrompts && Platform.OS !== 'web') {
            const secondsRemaining = Math.floor(timeRemaining);
            
            // Only speak if we haven't spoken this second yet
            if (secondsRemaining <= 10 && secondsRemaining >= 1 && secondsRemaining !== lastSpokenSecond) {
              speakWithDefaultVoice(secondsRemaining.toString());
              setLastSpokenSecond(secondsRemaining);
            }
            
            // When timer reaches zero
            if (secondsRemaining === 0 && lastSpokenSecond !== 0) {
              speakWithDefaultVoice("Rest complete. Ready for next set.");
              setLastSpokenSecond(0);
              
              // Vibrate when timer reaches zero
              if (Platform.OS !== 'web') {
                Vibration.vibrate([0, 500, 200, 500]);
              }
            }
          } else if (timeRemaining <= 0 && Platform.OS !== 'web') {
            // Vibrate even if voice prompts are off
            Vibration.vibrate([0, 500, 200, 500]);
          }
          
          if (timeRemaining <= 0) {
            skipRestTimer();
          }
          
          elapsedTime = timeRemaining;
        } else {
          // For workout timer, count up
          elapsedTime = (currentTime - activeTimer.startTime) / 1000;
          
          // Voice prompts at certain intervals if enabled
          if (timerSettings.voicePrompts && Platform.OS !== 'web') {
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = Math.floor(elapsedTime % 60);
            
            // Announce every 5 minutes
            if (minutes > 0 && seconds === 0 && minutes % 5 === 0) {
              speakWithDefaultVoice(`${minutes} minutes elapsed`);
            }
          }
        }
        
        setDisplayTime(formatTime(elapsedTime));
      }, 100);
    } else {
      // Reset the last spoken second when timer is not running
      setLastSpokenSecond(-1);
    }
    
    return () => clearInterval(interval);
  }, [activeTimer, timerSettings.voicePrompts, lastSpokenSecond]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const handleStartPause = () => {
    if (activeTimer.isRunning) {
      pauseTimer();
      
      if (timerSettings.voicePrompts && Platform.OS !== 'web') {
        speakWithDefaultVoice("Timer paused");
      }
    } else {
      startTimer();
    }
  };
  
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={[
          styles.compactTime, 
          activeTimer.isResting && styles.restingTime
        ]}>
          {displayTime}
        </Text>
        
        <TouchableOpacity
          style={styles.compactButton}
          onPress={handleStartPause}
        >
          {activeTimer.isRunning ? (
            <Pause size={16} color={colors.text} />
          ) : (
            <Play size={16} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[
      styles.container, 
      activeTimer.isResting && styles.restingContainer
    ]}>
      {showSettings && (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettingsPress}
        >
          <Settings size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
      
      <Text style={styles.label}>
        {activeTimer.isResting ? "REST TIME" : "WORKOUT TIME"}
      </Text>
      
      <Text style={styles.time}>{displayTime}</Text>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetTimer}
        >
          <RotateCcw size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.mainButton,
            activeTimer.isRunning ? styles.pauseButton : styles.playButton
          ]}
          onPress={handleStartPause}
        >
          {activeTimer.isRunning ? (
            <Pause size={24} color="#FFFFFF" />
          ) : (
            <Play size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        {activeTimer.isResting && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipRestTimer}
          >
            <SkipForward size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        
        {!activeTimer.isResting && (
          <View style={styles.placeholder} />
        )}
      </View>
      
      {activeTimer.isResting && (
        <Text style={styles.restPrompt}>
          Take a deep breath and prepare for your next set
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.timerBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginVertical: 16,
    position: "relative",
  },
  restingContainer: {
    backgroundColor: "#FFF5E6",
  },
  settingsButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  time: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.text,
    marginVertical: 8,
  },
  restingTime: {
    color: "#FF9500",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  playButton: {
    backgroundColor: colors.primary,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 40,
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.timerBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  compactTime: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginRight: 8,
  },
  compactButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  restPrompt: {
    fontSize: 14,
    color: "#FF9500",
    marginTop: 16,
    textAlign: "center",
  },
});