import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Droplets, Plus, Minus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface WaterTrackerProps {
  onAddWater?: () => void;
}

export default function WaterTracker({ onAddWater }: WaterTrackerProps) {
  const { colors } = useTheme();
  const [waterIntake, setWaterIntake] = useState(0); // in ml
  const dailyGoal = 2000; // 2L daily goal
  
  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
    if (onAddWater) {
      onAddWater();
    }
  };
  
  const progress = Math.min((waterIntake / dailyGoal) * 100, 100);
  const remainingWater = Math.max(0, dailyGoal - waterIntake);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
            <Droplets size={20} color="#007AFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Water Intake</Text>
        </View>
        <Text style={[styles.goal, { color: colors.textSecondary }]}>
          {waterIntake}ml / {dailyGoal}ml
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.highlight }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`,
                backgroundColor: '#007AFF'
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {Math.round(progress)}% of daily goal
        </Text>
      </View>
      
      {remainingWater > 0 && (
        <Text style={[styles.remainingText, { color: colors.textSecondary }]}>
          {remainingWater}ml remaining
        </Text>
      )}
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.highlight }]}
          onPress={() => addWater(-250)}
        >
          <Minus size={16} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.primary }]}>250ml</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => addWater(250)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>250ml</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.highlight }]}
          onPress={() => addWater(500)}
        >
          <Plus size={16} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.primary }]}>500ml</Text>
        </TouchableOpacity>
      </View>
      
      {waterIntake >= dailyGoal && (
        <View style={[styles.congratsContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
          <Text style={[styles.congratsText, { color: '#34C759' }]}>
            🎉 Daily goal achieved!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  goal: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  remainingText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  congratsContainer: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 14,
    fontWeight: '500',
  },
});