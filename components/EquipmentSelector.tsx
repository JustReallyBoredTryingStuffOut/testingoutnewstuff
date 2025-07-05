import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { EquipmentType } from '@/types';
import { 
  Dumbbell, 
  User, 
  Box, 
  ArrowUp, 
  Circle, 
  Anchor, 
  Infinity, 
  Link, 
  Footprints, 
  ArrowDown, 
  MoveHorizontal,
  CircleDot,
  Activity
} from 'lucide-react-native';

type EquipmentSelectorProps = {
  selectedEquipmentCategory: string | null;
  selectedEquipment: EquipmentType | null;
  onSelectEquipmentCategory: (category: string) => void;
  onSelectEquipment: (equipment: EquipmentType) => void;
  equipmentTypes: EquipmentType[];
};

// Equipment categories
const EQUIPMENT_CATEGORIES = {
  'Free Weights': ['Barbell', 'Dumbbell', 'Kettlebell'],
  'Machines': ['Cable Machine', 'Machine', 'Leg Extension Machine', 'Leg Curl Machine', 'Lat Pulldown Machine', 'Leg Press Machine', 'Smith Machine', 'Chest Press Machine', 'Shoulder Press Machine'],
  'Bodyweight': ['Bodyweight', 'Pull-up Bar'],
  'Accessories': ['Bench', 'Stability Ball', 'Medicine Ball', 'TRX', 'Ab Wheel', 'Resistance Band', 'Rope Attachment', 'Foam Roller'],
};

export default function EquipmentSelector({
  selectedEquipmentCategory,
  selectedEquipment,
  onSelectEquipmentCategory,
  onSelectEquipment,
  equipmentTypes,
}: EquipmentSelectorProps) {
  const { colors } = useTheme();

  // Filter equipment types by selected category
  const getFilteredEquipment = () => {
    if (!selectedEquipmentCategory) return equipmentTypes;
    
    const categoryEquipment = EQUIPMENT_CATEGORIES[selectedEquipmentCategory as keyof typeof EQUIPMENT_CATEGORIES] || [];
    return equipmentTypes.filter(e => categoryEquipment.includes(e));
  };

  const filteredEquipment = getFilteredEquipment();

  const getEquipmentIcon = (equipment: string) => {
    const iconColor = selectedEquipment === equipment ? '#FFFFFF' : colors.text;
    const iconSize = 24;
    
    switch (equipment) {
      case 'Barbell':
        return (
          <View style={styles.barbellIconContainer}>
            <View style={[styles.barbellBar, { backgroundColor: iconColor }]} />
            <View style={[styles.barbellWeight, { left: 2, backgroundColor: iconColor }]} />
            <View style={[styles.barbellWeight, { right: 2, backgroundColor: iconColor }]} />
          </View>
        );
      case 'Dumbbell':
        return <Dumbbell size={iconSize} color={iconColor} />;
      case 'Kettlebell':
        return (
          <View style={styles.kettlebellIconContainer}>
            <View style={[styles.kettlebellHandle, { borderColor: iconColor }]} />
            <View style={[styles.kettlebellBody, { backgroundColor: iconColor }]} />
          </View>
        );
      case 'Cable Machine':
        return (
          <View style={styles.cableMachineIconContainer}>
            <View style={[styles.cableMachineFrame, { borderColor: iconColor }]} />
            <View style={[styles.cableMachineBar, { backgroundColor: iconColor }]} />
            <View style={[styles.cableMachineCable, { backgroundColor: iconColor }]} />
          </View>
        );
      case 'Machine':
        return <Box size={iconSize} color={iconColor} />;
      case 'Bodyweight':
        return <User size={iconSize} color={iconColor} />;
      case 'Pull-up Bar':
        return <ArrowUp size={iconSize} color={iconColor} />;
      case 'Bench':
        return (
          <View style={styles.benchIconContainer}>
            <View style={[styles.benchPad, { backgroundColor: iconColor }]} />
            <View style={[styles.benchLeg, { left: 4, backgroundColor: iconColor }]} />
            <View style={[styles.benchLeg, { right: 4, backgroundColor: iconColor }]} />
          </View>
        );
      case 'Stability Ball':
        return <Circle size={iconSize} color={iconColor} />;
      case 'Medicine Ball':
        return <Circle size={iconSize} color={iconColor} strokeWidth={2.5} />;
      case 'TRX':
        return <Anchor size={iconSize} color={iconColor} />;
      case 'Ab Wheel':
        return (
          <View style={styles.abWheelIconContainer}>
            <View style={[styles.abWheelWheel, { borderColor: iconColor }]} />
            <View style={[styles.abWheelHandle, { backgroundColor: iconColor }]} />
          </View>
        );
      case 'Resistance Band':
        return <Infinity size={iconSize} color={iconColor} />;
      case 'Rope Attachment':
        return <Link size={iconSize} color={iconColor} />;
      case 'Leg Extension Machine':
        return <Footprints size={iconSize} color={iconColor} />;
      case 'Leg Curl Machine':
        return <Footprints size={iconSize} color={iconColor} />;
      case 'Lat Pulldown Machine':
        return <ArrowDown size={iconSize} color={iconColor} />;
      case 'Leg Press Machine':
        return <MoveHorizontal size={iconSize} color={iconColor} />;
      case 'Smith Machine':
        return (
          <View style={styles.smithMachineIconContainer}>
            <View style={[styles.smithMachineFrame, { borderColor: iconColor }]} />
            <View style={[styles.smithMachineBar, { backgroundColor: iconColor }]} />
          </View>
        );
      case 'Foam Roller':
        return (
          <View style={[styles.foamRollerIcon, { borderColor: iconColor }]} />
        );
      default:
        return <Box size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipment Type</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            selectedEquipmentCategory === null && [styles.selectedCategoryButton, { backgroundColor: colors.primary, borderColor: colors.primary }],
          ]}
          onPress={() => {
            onSelectEquipmentCategory(null);
            onSelectEquipment(null);
          }}
        >
          <Text
            style={[
              styles.categoryButtonText,
              { color: colors.text },
              selectedEquipmentCategory === null && styles.selectedCategoryButtonText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {Object.keys(EQUIPMENT_CATEGORIES).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedEquipmentCategory === category && [styles.selectedCategoryButton, { backgroundColor: colors.primary, borderColor: colors.primary }],
            ]}
            onPress={() => {
              onSelectEquipmentCategory(category);
              onSelectEquipment(null);
            }}
          >
            <Text
              style={[
                styles.categoryButtonText,
                { color: colors.text },
                selectedEquipmentCategory === category && styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {filteredEquipment.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Equipment</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.equipmentContainer}
          >
            {filteredEquipment.map((equipment) => (
              <TouchableOpacity
                key={equipment.id || equipment.name}
                style={[
                  styles.equipmentButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedEquipment && (selectedEquipment.id === equipment.id || selectedEquipment.name === equipment.name) && [styles.selectedEquipment, { backgroundColor: colors.primary, borderColor: colors.primary }],
                ]}
                onPress={() => onSelectEquipment(equipment)}
              >
                {getEquipmentIcon(equipment.name)}
                <Text
                  style={[
                    styles.equipmentText,
                    { color: colors.text },
                    selectedEquipment && (selectedEquipment.id === equipment.id || selectedEquipment.name === equipment.name) && styles.selectedEquipmentText,
                  ]}
                >
                  {equipment.name.replace('Machine', '').trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedCategoryButton: {
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  equipmentContainer: {
    paddingBottom: 8,
  },
  equipmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderWidth: 1,
  },
  selectedEquipment: {
  },
  equipmentText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedEquipmentText: {
    color: '#FFFFFF',
  },
  // Barbell icon
  barbellIconContainer: {
    width: 40,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  barbellBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  barbellWeight: {
    position: 'absolute',
    width: 8,
    height: 16,
    borderRadius: 2,
    top: 4,
  },
  // Kettlebell icon
  kettlebellIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  kettlebellHandle: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  kettlebellBody: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  // Cable machine icon
  cableMachineIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  cableMachineFrame: {
    width: 20,
    height: 24,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    left: 2,
  },
  cableMachineBar: {
    width: 16,
    height: 2,
    position: 'absolute',
    top: 8,
    left: 4,
  },
  cableMachineCable: {
    width: 2,
    height: 16,
    position: 'absolute',
    top: 8,
    left: 11,
  },
  // Bench icon
  benchIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  benchPad: {
    width: 24,
    height: 8,
    borderRadius: 2,
    position: 'absolute',
    top: 4,
  },
  benchLeg: {
    width: 3,
    height: 10,
    position: 'absolute',
    bottom: 2,
  },
  // Ab wheel icon
  abWheelIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  abWheelWheel: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  abWheelHandle: {
    width: 20,
    height: 2,
    position: 'absolute',
  },
  // Smith machine icon
  smithMachineIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  smithMachineFrame: {
    width: 20,
    height: 24,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    left: 2,
  },
  smithMachineBar: {
    width: 24,
    height: 2,
    position: 'absolute',
    top: 12,
    left: 0,
  },
  // Foam roller icon
  foamRollerIcon: {
    width: 20,
    height: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
});