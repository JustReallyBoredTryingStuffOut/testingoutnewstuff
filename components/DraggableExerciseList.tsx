import React, { useRef, useState } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import DraggableExerciseCard from './DraggableExerciseCard';
import { Exercise } from '../types';

interface DraggableExerciseListProps {
  exercises: Exercise[];
  onReorder: (exercises: Exercise[]) => void;
  onComplete: (exerciseId: string) => void;
  onRest: (exerciseId: string) => void;
}

const DraggableExerciseList: React.FC<DraggableExerciseListProps> = ({ 
  exercises, 
  onReorder, 
  onComplete, 
  onRest 
}) => {
  const draggedIndexRef = useRef<number | null>(null);
  const dropZoneIndexRef = useRef<number | null>(null);
  const dropZonesRef = useRef<Record<number, number>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropZoneIndex, setDropZoneIndex] = useState<number | null>(null);

  const handleDragEnd = (event: GestureResponderEvent) => {
    if (dropZoneIndexRef.current !== null && draggedIndexRef.current !== null) {
      const newExercises = [...exercises];
      const [draggedExercise] = newExercises.splice(draggedIndexRef.current, 1);
      newExercises.splice(dropZoneIndexRef.current, 0, draggedExercise);
      onReorder(newExercises);
    }
    
    draggedIndexRef.current = null;
    dropZoneIndexRef.current = null;
    setDraggedIndex(null);
    setDropZoneIndex(null);
  };

  const handleDragStart = (index: number) => {
    draggedIndexRef.current = index;
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndexRef.current !== null && draggedIndexRef.current !== index) {
      dropZoneIndexRef.current = index;
      setDropZoneIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      {exercises.map((exercise, index) => (
        <View
          key={exercise.id}
          style={[
            styles.exerciseContainer,
            draggedIndex === index && styles.dragging,
            dropZoneIndex === index && styles.dropZone,
          ]}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            dropZonesRef.current[index] = y;
          }}
        >
          <DraggableExerciseCard
            exercise={exercise}
            onComplete={onComplete}
            onRest={onRest}
            onDragStart={() => handleDragStart(index)}
            onDragEnd={handleDragEnd}
            onDragEnter={() => handleDragEnter(index)}
            isDragging={draggedIndex === index}
            isDropZone={dropZoneIndex === index}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exerciseContainer: {
    marginVertical: 8,
  },
  dragging: {
    opacity: 0.5,
    transform: [{ scale: 0.98 }],
  },
  dropZone: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
    marginTop: 8,
  },
});

export default DraggableExerciseList; 