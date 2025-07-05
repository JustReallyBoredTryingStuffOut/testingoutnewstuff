import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { equipmentCategories, equipment, getEquipmentCategoryMapping } from '@/mocks/filterData';
import HorizontalScrollSelector from './HorizontalScrollSelector';

type EquipmentTypeSelectorProps = {
  selectedEquipmentCategory: string | null;
  selectedEquipment: string | null;
  onSelectEquipmentCategory: (category: string) => void;
  onSelectEquipment: (equipment: string) => void;
};

export default function EquipmentTypeSelector({
  selectedEquipmentCategory,
  selectedEquipment,
  onSelectEquipmentCategory,
  onSelectEquipment,
}: EquipmentTypeSelectorProps) {
  const { colors } = useTheme();

  const handleCategorySelect = (category: string) => {
    if (selectedEquipmentCategory === category) {
      onSelectEquipmentCategory('');
      onSelectEquipment('');
    } else {
      onSelectEquipmentCategory(category);
      onSelectEquipment('');
    }
  };

  const handleEquipmentSelect = (equipmentName: string) => {
    if (selectedEquipment === equipmentName) {
      onSelectEquipment('');
    } else {
      onSelectEquipment(equipmentName);
    }
  };

  // Filter equipment by selected category
  const filteredEquipment = selectedEquipmentCategory
    ? equipment.filter(eq => getEquipmentCategoryMapping(eq.id) === selectedEquipmentCategory)
    : [];

  // Transform data for HorizontalScrollSelector
  const categoryItems = equipmentCategories.map(category => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
  }));

  const equipmentItems = filteredEquipment.map(eq => ({
    id: eq.id,
    name: eq.name,
  }));

  return (
    <View style={styles.container}>
      {/* Equipment Categories with Horizontal Scroll */}
      <HorizontalScrollSelector
        title="Equipment Type"
        items={categoryItems}
        selectedItem={selectedEquipmentCategory}
        onSelectItem={handleCategorySelect}
        maxVisibleItems={4}
        showMoreButton={true}
        itemWidth={140}
        itemHeight={48}
        showFadeIndicators={true}
      />

      {/* Specific Equipment with Horizontal Scroll */}
      {selectedEquipmentCategory && filteredEquipment.length > 0 && (
        <HorizontalScrollSelector
          title="Equipment"
          items={equipmentItems}
          selectedItem={selectedEquipment}
          onSelectItem={handleEquipmentSelect}
          maxVisibleItems={3}
          showMoreButton={true}
          itemWidth={120}
          itemHeight={48}
          showFadeIndicators={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
}); 