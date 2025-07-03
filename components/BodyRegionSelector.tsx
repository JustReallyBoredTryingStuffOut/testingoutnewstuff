import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BODY_REGIONS } from '@/constants/bodyRegions';

interface BodyRegionSelectorProps {
  selectedRegion: string | null;
  onSelectRegion: (regionKey: string) => void;
}

export default function BodyRegionSelector({ selectedRegion, onSelectRegion }: BodyRegionSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Select Body Region</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {BODY_REGIONS.map((region) => (
          <TouchableOpacity
            key={region.key}
            style={[
              styles.regionButton,
              { 
                backgroundColor: selectedRegion === region.key ? colors.primary : colors.card,
                borderColor: colors.border
              }
            ]}
            onPress={() => onSelectRegion(region.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.regionText,
              { 
                color: selectedRegion === region.key ? '#FFFFFF' : colors.text 
              }
            ]}>
              {region.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollContainer: {
    paddingHorizontal: 4,
  },
  regionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  regionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 