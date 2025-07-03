import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { equipmentCategories, equipment, getEquipmentCategoryMapping } from '@/mocks/filterData';

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

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipment Type</Text>
      
      {/* Equipment Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {equipmentCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedEquipmentCategory === category.id && [styles.selectedCategory, { backgroundColor: colors.primary, borderColor: colors.primary }],
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                { color: colors.text },
                selectedEquipmentCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Specific Equipment */}
      {selectedEquipmentCategory && filteredEquipment.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Equipment</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.equipmentContainer}
          >
            {filteredEquipment.map((eq) => (
              <TouchableOpacity
                key={eq.id}
                style={[
                  styles.equipmentButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedEquipment === eq.id && [styles.selectedEquipment, { backgroundColor: colors.primary, borderColor: colors.primary }],
                ]}
                onPress={() => handleEquipmentSelect(eq.id)}
              >
                <Text
                  style={[
                    styles.equipmentText,
                    { color: colors.text },
                    selectedEquipment === eq.id && styles.selectedEquipmentText,
                  ]}
                >
                  {eq.name}
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
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 120,
  },
  selectedCategory: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  equipmentContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  equipmentButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
  },
  selectedEquipment: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  equipmentText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedEquipmentText: {
    color: '#FFFFFF',
  },
}); 