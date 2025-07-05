import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BodyRegion, MuscleGroup } from '@/types';

type MuscleGroupSelectorProps = {
  selectedBodyRegion: BodyRegion | null;
  selectedMuscleGroup: MuscleGroup | null;
  onSelectBodyRegion: (region: BodyRegion) => void;
  onSelectMuscleGroup: (group: MuscleGroup) => void;
  bodyRegions: BodyRegion[];
  muscleGroups: MuscleGroup[];
  viewMode: 'front' | 'back';
  toggleViewMode: () => void;
};

export default function MuscleGroupSelector({
  selectedBodyRegion,
  selectedMuscleGroup,
  onSelectBodyRegion,
  onSelectMuscleGroup,
  bodyRegions,
  muscleGroups,
  viewMode,
  toggleViewMode
}: MuscleGroupSelectorProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const imageHeight = 280;

  // Get the appropriate body map image based on region and view
  const getBodyMapImage = () => {
    if (selectedBodyRegion === 'Upper Body') {
      return viewMode === 'front' 
        ? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' // Muscular front view
        : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'; // Muscular back view
    } else if (selectedBodyRegion === 'Lower Body') {
      return viewMode === 'front'
        ? 'https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' // Muscular legs front view
        : 'https://images.unsplash.com/photo-1584863231364-2edc166de576?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'; // Muscular legs back view
    } else if (selectedBodyRegion === 'Core') {
      return viewMode === 'front'
        ? 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' // Muscular abs front view
        : 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'; // Muscular back core view
    }
    return '';
  };

  // Define clickable areas for each muscle group based on body region and view
  const getMuscleGroupAreas = () => {
    if (selectedBodyRegion === 'Upper Body') {
      if (viewMode === 'front') {
        return [
          { group: 'Chest', style: styles.chestFront },
          { group: 'Shoulders', style: styles.shouldersFront },
          { group: 'Biceps', style: styles.bicepsFront },
          { group: 'Forearms', style: styles.forearmsFront },
          { group: 'Traps', style: styles.trapsFront },
        ];
      } else {
        return [
          { group: 'Back', style: styles.backArea },
          { group: 'Traps', style: styles.trapsBack },
          { group: 'Triceps', style: styles.tricepsBack },
          { group: 'Lats', style: styles.latsBack },
          { group: 'Rear Deltoids', style: styles.rearDeltoids },
        ];
      }
    } else if (selectedBodyRegion === 'Lower Body') {
      if (viewMode === 'front') {
        return [
          { group: 'Quadriceps', style: styles.quadsFront },
          { group: 'Calves', style: styles.calvesFront },
          { group: 'Hip Flexors', style: styles.hipFlexors },
        ];
      } else {
        return [
          { group: 'Hamstrings', style: styles.hamstringsBack },
          { group: 'Glutes', style: styles.glutesBack },
          { group: 'Calves', style: styles.calvesBack },
        ];
      }
    } else if (selectedBodyRegion === 'Core') {
      if (viewMode === 'front') {
        return [
          { group: 'Abs', style: styles.absFront },
          { group: 'Obliques', style: styles.obliquesFront },
        ];
      } else {
        return [
          { group: 'Lower Back', style: styles.lowerBack },
          { group: 'Obliques', style: styles.obliquesBack },
        ];
      }
    }
    return [];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Region</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bodyRegionsContainer}
      >
        {bodyRegions.map((region) => (
          <TouchableOpacity
            key={region.id || region.name}
            style={[
              styles.bodyRegionButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedBodyRegion && (selectedBodyRegion.id === region.id || selectedBodyRegion.name === region.name) && [styles.selectedBodyRegion, { backgroundColor: colors.primary, borderColor: colors.primary }],
            ]}
            onPress={() => onSelectBodyRegion(region)}
          >
            <Text
              style={[
                styles.bodyRegionText,
                { color: colors.text },
                selectedBodyRegion && (selectedBodyRegion.id === region.id || selectedBodyRegion.name === region.name) && styles.selectedBodyRegionText,
              ]}
            >
              {region.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedBodyRegion && (
        <>
          <View style={styles.viewToggleContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
              {selectedBodyRegion === 'Upper Body' ? 'Upper Body View' : 
               selectedBodyRegion === 'Lower Body' ? 'Lower Body View' : 'Core View'}
            </Text>
            <TouchableOpacity 
              style={[styles.viewToggleButton, { backgroundColor: colors.primary }]} 
              onPress={toggleViewMode}
            >
              <Text style={styles.viewToggleText}>
                {viewMode === 'front' ? 'Switch to Back View' : 'Switch to Front View'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bodyMapContainer}>
            <Image
              source={{ uri: getBodyMapImage() }}
              style={[styles.bodyMapImage, { width: screenWidth - 32, height: imageHeight }]}
              resizeMode="contain"
            />
            
            <View style={[styles.bodyMapOverlay, { width: screenWidth - 32, height: imageHeight }]}>
              {getMuscleGroupAreas().map((area) => (
                <TouchableOpacity
                  key={area.group}
                  style={[
                    area.style,
                    styles.clickableArea,
                    selectedMuscleGroup === area.group && styles.selectedMuscleArea
                  ]}
                  onPress={() => onSelectMuscleGroup(area.group as MuscleGroup)}
                >
                  <Text style={styles.muscleGroupLabel}>{area.group}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Muscle Groups</Text>
          <View style={styles.muscleGroupsContainer}>
            {muscleGroups.map((group) => (
              <TouchableOpacity
                key={group.id || group.name}
                style={[
                  styles.muscleGroupButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedMuscleGroup && (selectedMuscleGroup.id === group.id || selectedMuscleGroup.name === group.name) && [styles.selectedMuscleGroup, { backgroundColor: colors.primary, borderColor: colors.primary }],
                ]}
                onPress={() => onSelectMuscleGroup(group)}
              >
                <Text
                  style={[
                    styles.muscleGroupText,
                    { color: colors.text },
                    selectedMuscleGroup && (selectedMuscleGroup.id === group.id || selectedMuscleGroup.name === group.name) && styles.selectedMuscleGroupText,
                  ]}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  bodyRegionsContainer: {
    paddingBottom: 8,
  },
  bodyRegionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedBodyRegion: {
  },
  bodyRegionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedBodyRegionText: {
    color: '#FFFFFF',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewToggleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  muscleGroupButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedMuscleGroup: {
  },
  muscleGroupText: {
    fontSize: 14,
  },
  selectedMuscleGroupText: {
    color: '#FFFFFF',
  },
  bodyMapContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  bodyMapImage: {
    borderRadius: 12,
    opacity: 0.8,
  },
  bodyMapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  clickableArea: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.7)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMuscleArea: {
    backgroundColor: 'rgba(255, 59, 48, 0.4)',
    borderColor: 'rgba(255, 59, 48, 0.8)',
  },
  muscleGroupLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 12,
  },
  // Upper body front
  chestFront: {
    width: 100,
    height: 60,
    top: 70,
    left: '50%',
    marginLeft: -50,
  },
  shouldersFront: {
    width: 120,
    height: 30,
    top: 40,
    left: '50%',
    marginLeft: -60,
  },
  bicepsFront: {
    width: 30,
    height: 60,
    top: 80,
    left: '30%',
  },
  forearmsFront: {
    width: 25,
    height: 60,
    top: 140,
    left: '30%',
  },
  trapsFront: {
    width: 60,
    height: 30,
    top: 30,
    left: '50%',
    marginLeft: -30,
  },
  // Upper body back
  backArea: {
    width: 100,
    height: 80,
    top: 70,
    left: '50%',
    marginLeft: -50,
  },
  trapsBack: {
    width: 80,
    height: 30,
    top: 40,
    left: '50%',
    marginLeft: -40,
  },
  tricepsBack: {
    width: 30,
    height: 60,
    top: 80,
    right: '30%',
  },
  latsBack: {
    width: 40,
    height: 70,
    top: 80,
    left: '35%',
  },
  rearDeltoids: {
    width: 30,
    height: 30,
    top: 50,
    left: '30%',
  },
  // Lower body front
  quadsFront: {
    width: 40,
    height: 80,
    top: 100,
    left: '40%',
  },
  calvesFront: {
    width: 30,
    height: 60,
    top: 200,
    left: '40%',
  },
  hipFlexors: {
    width: 40,
    height: 30,
    top: 90,
    left: '50%',
    marginLeft: -20,
  },
  // Lower body back
  hamstringsBack: {
    width: 40,
    height: 80,
    top: 120,
    left: '40%',
  },
  glutesBack: {
    width: 80,
    height: 40,
    top: 80,
    left: '50%',
    marginLeft: -40,
  },
  calvesBack: {
    width: 30,
    height: 60,
    top: 200,
    left: '40%',
  },
  // Core front
  absFront: {
    width: 60,
    height: 80,
    top: 80,
    left: '50%',
    marginLeft: -30,
  },
  obliquesFront: {
    width: 30,
    height: 80,
    top: 80,
    left: '30%',
  },
  // Core back
  lowerBack: {
    width: 80,
    height: 40,
    top: 100,
    left: '50%',
    marginLeft: -40,
  },
  obliquesBack: {
    width: 30,
    height: 80,
    top: 80,
    left: '30%',
  },
});