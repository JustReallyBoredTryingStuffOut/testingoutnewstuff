import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ChevronRight, X, Filter } from 'lucide-react-native';
import { getMuscleRegionMapping, getEquipmentCategoryMapping } from '@/mocks/filterData';

export interface FilterOption {
  id: string;
  name: string;
  icon?: string;
}

export interface FilterState {
  bodyRegion: FilterOption | null;
  muscleGroup: FilterOption | null;
  equipmentCategory: FilterOption | null;
  equipment: FilterOption | null;
}

interface HierarchicalFilterProps {
  bodyRegions: FilterOption[];
  muscleGroups: FilterOption[];
  equipmentCategories: FilterOption[];
  equipment: FilterOption[];
  filterState: FilterState;
  onFilterChange: (filterState: FilterState) => void;
  onClearFilters: () => void;
}

export default function HierarchicalFilter({
  bodyRegions,
  muscleGroups,
  equipmentCategories,
  equipment,
  filterState,
  onFilterChange,
  onClearFilters
}: HierarchicalFilterProps) {
  const { colors } = useTheme();
  const [activeLevel, setActiveLevel] = useState<'region' | 'muscle' | 'category' | 'equipment'>('region');

  const getFilteredMuscleGroups = () => {
    if (!filterState.bodyRegion) return muscleGroups;
    // Filter muscle groups based on selected body region
    return muscleGroups.filter(muscle => 
      getMuscleRegionMapping(muscle.name) === filterState.bodyRegion!.name
    );
  };

  const getFilteredEquipmentCategories = () => {
    if (!filterState.muscleGroup) return equipmentCategories;
    // Return all equipment categories for now, could be filtered based on muscle group
    return equipmentCategories;
  };

  const getFilteredEquipment = () => {
    if (!filterState.equipmentCategory) return equipment;
    // Filter equipment based on selected category
    return equipment.filter(eq => 
      getEquipmentCategoryMapping(eq.name) === filterState.equipmentCategory!.name
    );
  };

  const handleFilterSelect = (level: 'region' | 'muscle' | 'category' | 'equipment', option: FilterOption) => {
    const newFilterState = { ...filterState };
    
    switch (level) {
      case 'region':
        newFilterState.bodyRegion = option;
        newFilterState.muscleGroup = null;
        newFilterState.equipmentCategory = null;
        newFilterState.equipment = null;
        setActiveLevel('muscle');
        break;
      case 'muscle':
        newFilterState.muscleGroup = option;
        newFilterState.equipmentCategory = null;
        newFilterState.equipment = null;
        setActiveLevel('category');
        break;
      case 'category':
        newFilterState.equipmentCategory = option;
        newFilterState.equipment = null;
        setActiveLevel('equipment');
        break;
      case 'equipment':
        newFilterState.equipment = option;
        setActiveLevel('region');
        break;
    }
    
    onFilterChange(newFilterState);
  };

  const handleFilterRemove = (level: 'region' | 'muscle' | 'category' | 'equipment') => {
    const newFilterState = { ...filterState };
    
    switch (level) {
      case 'region':
        newFilterState.bodyRegion = null;
        newFilterState.muscleGroup = null;
        newFilterState.equipmentCategory = null;
        newFilterState.equipment = null;
        break;
      case 'muscle':
        newFilterState.muscleGroup = null;
        newFilterState.equipmentCategory = null;
        newFilterState.equipment = null;
        break;
      case 'category':
        newFilterState.equipmentCategory = null;
        newFilterState.equipment = null;
        break;
      case 'equipment':
        newFilterState.equipment = null;
        break;
    }
    
    onFilterChange(newFilterState);
  };

  const getActiveOptions = () => {
    switch (activeLevel) {
      case 'region':
        return bodyRegions;
      case 'muscle':
        return getFilteredMuscleGroups();
      case 'category':
        return getFilteredEquipmentCategories();
      case 'equipment':
        return getFilteredEquipment();
      default:
        return bodyRegions;
    }
  };

  const getLevelTitle = () => {
    switch (activeLevel) {
      case 'region':
        return 'Select Body Region';
      case 'muscle':
        return 'Select Muscle Group';
      case 'category':
        return 'Select Equipment Category';
      case 'equipment':
        return 'Select Equipment';
      default:
        return 'Select Filter';
    }
  };

  const hasActiveFilters = filterState.bodyRegion || filterState.muscleGroup || filterState.equipmentCategory || filterState.equipment;

  return (
    <View style={styles.container}>
      {/* Filter Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Filter size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {getLevelTitle()}
          </Text>
        </View>
        {hasActiveFilters && (
          <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
            <X size={16} color={colors.textSecondary} />
            <Text style={[styles.clearText, { color: colors.textSecondary }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.activeFiltersContainer}
          contentContainerStyle={styles.activeFiltersContent}
        >
          {filterState.bodyRegion && (
            <TouchableOpacity
              style={[styles.activeFilter, { backgroundColor: colors.primary + '20' }]}
              onPress={() => handleFilterRemove('region')}
            >
              <Text style={[styles.activeFilterText, { color: colors.primary }]}>
                {filterState.bodyRegion.name.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              <X size={12} color={colors.primary} />
            </TouchableOpacity>
          )}
          
          {filterState.muscleGroup && (
            <TouchableOpacity
              style={[styles.activeFilter, { backgroundColor: colors.success + '20' }]}
              onPress={() => handleFilterRemove('muscle')}
            >
              <Text style={[styles.activeFilterText, { color: colors.success }]}>
                {filterState.muscleGroup.name.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              <X size={12} color={colors.success} />
            </TouchableOpacity>
          )}
          
          {filterState.equipmentCategory && (
            <TouchableOpacity
              style={[styles.activeFilter, { backgroundColor: colors.warning + '20' }]}
              onPress={() => handleFilterRemove('category')}
            >
              <Text style={[styles.activeFilterText, { color: colors.warning }]}>
                {filterState.equipmentCategory.name.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              <X size={12} color={colors.warning} />
            </TouchableOpacity>
          )}
          
          {filterState.equipment && (
            <TouchableOpacity
              style={[styles.activeFilter, { backgroundColor: colors.secondary + '20' }]}
              onPress={() => handleFilterRemove('equipment')}
            >
              <Text style={[styles.activeFilterText, { color: colors.secondary }]}>
                {filterState.equipment.name.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              <X size={12} color={colors.secondary} />
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Filter Options */}
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {getActiveOptions().map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                { backgroundColor: colors.background },
                activeLevel === 'region' && filterState.bodyRegion?.id === option.id && { borderColor: colors.primary, borderWidth: 2 },
                activeLevel === 'muscle' && filterState.muscleGroup?.id === option.id && { borderColor: colors.success, borderWidth: 2 },
                activeLevel === 'category' && filterState.equipmentCategory?.id === option.id && { borderColor: colors.warning, borderWidth: 2 },
                activeLevel === 'equipment' && filterState.equipment?.id === option.id && { borderColor: colors.secondary, borderWidth: 2 },
              ]}
              onPress={() => handleFilterSelect(activeLevel, option)}
            >
              {option.icon && (
                <Text style={styles.optionIcon}>{option.icon}</Text>
              )}
              <Text style={[styles.optionText, { color: colors.text }]}>
                {option.name.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Breadcrumb */}
      <View style={styles.breadcrumb}>
        <TouchableOpacity
          style={[styles.breadcrumbItem, activeLevel === 'region' && styles.activeBreadcrumb]}
          onPress={() => setActiveLevel('region')}
        >
          <Text style={[
            styles.breadcrumbText,
            { color: activeLevel === 'region' ? colors.primary : colors.textSecondary }
          ]}>
            Region
          </Text>
        </TouchableOpacity>
        
        {filterState.bodyRegion && (
          <TouchableOpacity
            style={[styles.breadcrumbItem, activeLevel === 'muscle' && styles.activeBreadcrumb]}
            onPress={() => setActiveLevel('muscle')}
          >
            <ChevronRight size={12} color={colors.textSecondary} />
            <Text style={[
              styles.breadcrumbText,
              { color: activeLevel === 'muscle' ? colors.primary : colors.textSecondary }
            ]}>
              Muscle
            </Text>
          </TouchableOpacity>
        )}
        
        {filterState.muscleGroup && (
          <TouchableOpacity
            style={[styles.breadcrumbItem, activeLevel === 'category' && styles.activeBreadcrumb]}
            onPress={() => setActiveLevel('category')}
          >
            <ChevronRight size={12} color={colors.textSecondary} />
            <Text style={[
              styles.breadcrumbText,
              { color: activeLevel === 'category' ? colors.primary : colors.textSecondary }
            ]}>
              Category
            </Text>
          </TouchableOpacity>
        )}
        
        {filterState.equipmentCategory && (
          <TouchableOpacity
            style={[styles.breadcrumbItem, activeLevel === 'equipment' && styles.activeBreadcrumb]}
            onPress={() => setActiveLevel('equipment')}
          >
            <ChevronRight size={12} color={colors.textSecondary} />
            <Text style={[
              styles.breadcrumbText,
              { color: activeLevel === 'equipment' ? colors.primary : colors.textSecondary }
            ]}>
              Equipment
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearText: {
    fontSize: 14,
    marginLeft: 4,
  },
  activeFiltersContainer: {
    maxHeight: 50,
    paddingHorizontal: 20,
  },
  activeFiltersContent: {
    gap: 8,
    paddingVertical: 8,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionsGrid: {
    gap: 12,
    paddingVertical: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBreadcrumb: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  breadcrumbText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 