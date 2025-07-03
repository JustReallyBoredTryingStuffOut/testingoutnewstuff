import { Schedule, ScheduledWorkout, ScheduledMeal } from './index';

export interface ScheduleItem {
  id: string;
  type: 'workout' | 'meal' | 'reminder';
  title: string;
  description?: string;
  time: string;
  dayOfWeek: number;
  completed: boolean;
  scheduleId: string;
}

export interface ScheduleFormData {
  name: string;
  description?: string;
  workouts: ScheduledWorkout[];
  meals: ScheduledMeal[];
}

export interface ScheduleFilters {
  dayOfWeek?: number;
  type?: 'workout' | 'meal' | 'all';
  completed?: boolean;
}

export { Schedule, ScheduledWorkout, ScheduledMeal }; 