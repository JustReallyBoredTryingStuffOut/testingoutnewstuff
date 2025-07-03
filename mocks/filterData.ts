import { FilterOption } from '@/components/HierarchicalFilter';

// Body Regions
export const bodyRegions: FilterOption[] = [
  { id: 'upper_body', name: 'upper_body', icon: '💪' },
  { id: 'lower_body', name: 'lower_body', icon: '🦵' },
  { id: 'core', name: 'core', icon: '🏋️' },
  { id: 'full_body', name: 'full_body', icon: '👤' },
  { id: 'cardio', name: 'cardio', icon: '❤️' },
];

// Muscle Groups
export const muscleGroups: FilterOption[] = [
  // Upper Body
  { id: 'chest', name: 'chest', icon: '🫁' },
  { id: 'shoulders', name: 'shoulders', icon: '🏋️' },
  { id: 'biceps', name: 'biceps', icon: '💪' },
  { id: 'triceps', name: 'triceps', icon: '💪' },
  { id: 'forearms', name: 'forearms', icon: '🤏' },
  { id: 'back', name: 'back', icon: '🫁' },
  { id: 'lats', name: 'lats', icon: '🫁' },
  { id: 'traps', name: 'traps', icon: '🏋️' },
  { id: 'deltoids', name: 'deltoids', icon: '🏋️' },
  
  // Lower Body
  { id: 'quadriceps', name: 'quadriceps', icon: '🦵' },
  { id: 'hamstrings', name: 'hamstrings', icon: '🦵' },
  { id: 'glutes', name: 'glutes', icon: '🍑' },
  { id: 'calves', name: 'calves', icon: '🦵' },
  { id: 'hip_flexors', name: 'hip_flexors', icon: '🦵' },
  
  // Core
  { id: 'abs', name: 'abs', icon: '🏋️' },
  { id: 'obliques', name: 'obliques', icon: '🏋️' },
  { id: 'lower_back', name: 'lower_back', icon: '🫁' },
];

// Equipment Categories
export const equipmentCategories: FilterOption[] = [
  { id: 'bodyweight', name: 'Bodyweight', icon: '👤' },
  { id: 'free_weights', name: 'Free Weights', icon: '🏋️' },
  { id: 'machines', name: 'Machines', icon: '⚙️' },
  { id: 'cables', name: 'Cables', icon: '🔗' },
  { id: 'accessories', name: 'Accessories', icon: '🎯' },
  { id: 'cardio_equipment', name: 'Cardio', icon: '🏃' },
];

// Specific Equipment with better categorization
export const equipment: FilterOption[] = [
  // Bodyweight
  { id: 'bodyweight', name: 'Bodyweight', icon: '👤' },
  
  // Free Weights
  { id: 'dumbbell', name: 'Dumbbell', icon: '🏋️' },
  { id: 'barbell', name: 'Barbell', icon: '🏋️' },
  { id: 'kettlebell', name: 'Kettlebell', icon: '🏋️' },
  
  // Machines
  { id: 'smith_machine', name: 'Smith Machine', icon: '⚙️' },
  { id: 'leg_press_machine', name: 'Leg Press Machine', icon: '⚙️' },
  { id: 'chest_press_machine', name: 'Chest Press Machine', icon: '⚙️' },
  { id: 'shoulder_press_machine', name: 'Shoulder Press Machine', icon: '⚙️' },
  { id: 'lat_pulldown_machine', name: 'Lat Pulldown Machine', icon: '⚙️' },
  { id: 'seated_row_machine', name: 'Seated Row Machine', icon: '⚙️' },
  { id: 'leg_extension_machine', name: 'Leg Extension Machine', icon: '⚙️' },
  { id: 'leg_curl_machine', name: 'Leg Curl Machine', icon: '⚙️' },
  { id: 'calf_raise_machine', name: 'Calf Raise Machine', icon: '⚙️' },
  { id: 'incline_hammer_strength_press', name: 'Incline Hammer Strength Press', icon: '⚙️' },
  { id: 'fly_machine', name: 'Fly Machine', icon: '⚙️' },
  { id: 'pec_deck_machine', name: 'Pec Deck Machine', icon: '⚙️' },
  { id: 'reverse_fly_machine', name: 'Reverse Fly Machine', icon: '⚙️' },
  { id: 'ab_crunch_machine', name: 'Ab Crunch Machine', icon: '⚙️' },
  { id: 'back_extension_machine', name: 'Back Extension Machine', icon: '⚙️' },
  { id: 'hip_abductor_machine', name: 'Hip Abductor Machine', icon: '⚙️' },
  { id: 'hip_adductor_machine', name: 'Hip Adductor Machine', icon: '⚙️' },
  
  // Cables
  { id: 'cable_machine', name: 'Cable Machine', icon: '🔗' },
  { id: 'cable_crossover', name: 'Cable Crossover', icon: '🔗' },
  { id: 'cable_fly', name: 'Cable Fly', icon: '🔗' },
  { id: 'cable_pulldown', name: 'Cable Pulldown', icon: '🔗' },
  { id: 'cable_row', name: 'Cable Row', icon: '🔗' },
  { id: 'cable_curl', name: 'Cable Curl', icon: '🔗' },
  { id: 'cable_tricep_pushdown', name: 'Cable Tricep Pushdown', icon: '🔗' },
  { id: 'cable_shoulder_raise', name: 'Cable Shoulder Raise', icon: '🔗' },
  { id: 'cable_woodchop', name: 'Cable Woodchop', icon: '🔗' },
  { id: 'cable_rotation', name: 'Cable Rotation', icon: '🔗' },
  { id: 'cable_pull_through', name: 'Cable Pull Through', icon: '🔗' },
  { id: 'cable_face_pull', name: 'Cable Face Pull', icon: '🔗' },
  { id: 'cable_upright_row', name: 'Cable Upright Row', icon: '🔗' },
  { id: 'cable_shrug', name: 'Cable Shrug', icon: '🔗' },
  
  // Accessories
  { id: 'bench', name: 'Bench', icon: '🪑' },
  { id: 'pull_up_bar', name: 'Pull-up Bar', icon: '🏋️' },
  { id: 'medicine_ball', name: 'Medicine Ball', icon: '⚽' },
  { id: 'stability_ball', name: 'Stability Ball', icon: '⚽' },
  { id: 'foam_roller', name: 'Foam Roller', icon: '🎯' },
  { id: 'trx', name: 'TRX', icon: '🎯' },
  { id: 'battle_ropes', name: 'Battle Ropes', icon: '🔗' },
  { id: 'resistance_band', name: 'Resistance Band', icon: '🎯' },
  { id: 'ab_wheel', name: 'Ab Wheel', icon: '🎯' },
  { id: 'dip_bars', name: 'Dip Bars', icon: '🏋️' },
  { id: 'preacher_curl_bench', name: 'Preacher Curl Bench', icon: '🪑' },
  { id: 'incline_bench', name: 'Incline Bench', icon: '🪑' },
  { id: 'decline_bench', name: 'Decline Bench', icon: '🪑' },
  { id: 'flat_bench', name: 'Flat Bench', icon: '🪑' },
  
  // Cardio Equipment
  { id: 'treadmill', name: 'Treadmill', icon: '🏃' },
  { id: 'elliptical', name: 'Elliptical', icon: '🏃' },
  { id: 'stationary_bike', name: 'Stationary Bike', icon: '🚴' },
  { id: 'rowing_machine', name: 'Rowing Machine', icon: '🚣' },
  { id: 'stair_master', name: 'Stair Master', icon: '🏃' },
  { id: 'jumping_rope', name: 'Jumping Rope', icon: '🏃' },
];

// Mapping functions for filtering
export const getMuscleRegionMapping = (muscleName: string): string => {
  const upperBodyMuscles = ['chest', 'shoulders', 'biceps', 'triceps', 'forearms', 'back', 'lats', 'traps', 'deltoids'];
  const lowerBodyMuscles = ['quadriceps', 'hamstrings', 'glutes', 'calves', 'hip_flexors'];
  const coreMuscles = ['abs', 'obliques', 'lower_back'];
  
  if (upperBodyMuscles.includes(muscleName.toLowerCase())) return 'upper_body';
  if (lowerBodyMuscles.includes(muscleName.toLowerCase())) return 'lower_body';
  if (coreMuscles.includes(muscleName.toLowerCase())) return 'core';
  return 'full_body';
};

export const getEquipmentCategoryMapping = (equipmentName: string): string => {
  const bodyweightEquipment = ['bodyweight'];
  const freeWeightEquipment = ['dumbbell', 'barbell', 'kettlebell'];
  const machineEquipment = [
    'smith_machine', 'leg_press_machine', 'chest_press_machine', 'shoulder_press_machine', 
    'lat_pulldown_machine', 'seated_row_machine', 'leg_extension_machine', 'leg_curl_machine', 
    'calf_raise_machine', 'incline_hammer_strength_press', 'fly_machine', 'pec_deck_machine',
    'reverse_fly_machine', 'ab_crunch_machine', 'back_extension_machine', 'hip_abductor_machine',
    'hip_adductor_machine'
  ];
  const cableEquipment = [
    'cable_machine', 'cable_crossover', 'cable_fly', 'cable_pulldown', 'cable_row', 
    'cable_curl', 'cable_tricep_pushdown', 'cable_shoulder_raise', 'cable_woodchop',
    'cable_rotation', 'cable_pull_through', 'cable_face_pull', 'cable_upright_row', 'cable_shrug'
  ];
  const accessoryEquipment = [
    'bench', 'pull_up_bar', 'medicine_ball', 'stability_ball', 'foam_roller', 'trx', 
    'battle_ropes', 'resistance_band', 'ab_wheel', 'dip_bars', 'preacher_curl_bench',
    'incline_bench', 'decline_bench', 'flat_bench'
  ];
  const cardioEquipment = ['treadmill', 'elliptical', 'stationary_bike', 'rowing_machine', 'stair_master', 'jumping_rope'];
  
  if (bodyweightEquipment.includes(equipmentName.toLowerCase())) return 'bodyweight';
  if (freeWeightEquipment.includes(equipmentName.toLowerCase())) return 'free_weights';
  if (machineEquipment.includes(equipmentName.toLowerCase())) return 'machines';
  if (cableEquipment.includes(equipmentName.toLowerCase())) return 'cables';
  if (cardioEquipment.includes(equipmentName.toLowerCase())) return 'cardio_equipment';
  return 'accessories';
}; 