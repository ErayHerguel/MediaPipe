import { writable } from 'svelte/store';

export const exerciseStore = writable([
  {
    title: 'Beinstrecker',
    gif: '',
    instructions: '',
    sets: [
      { reps: 12, repsData: [] }, // Satz 1
      { reps: 12, repsData: [] }, // Satz 2
      { reps: 12, repsData: [] }  // Satz 3
    ]
  },
  // Weitere Übungen können hier hinzugefügt werden
]);

// Funktion zum Hinzufügen der Winkelmessung zu einem Satz
/**
 * @param {number} exerciseIndex
 * @param {number} setIndex
 * @param {number} repData
 */
export function addRepDataToSet(exerciseIndex, setIndex, repData) {
  exerciseStore.update(exercises => {
    exercises[exerciseIndex].sets[setIndex].repsData.push(repData);
    return exercises;
  });
}
