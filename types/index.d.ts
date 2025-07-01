// Add the completed flag to ExerciseLog
export interface ExerciseLog {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes: string;
  completed?: boolean; // Add this line
}

// Rest of the types file remains the same