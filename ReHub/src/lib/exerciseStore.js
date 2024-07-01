import { writable } from "svelte/store";

export const exerciseStore = writable([
  {
    title: "Beinstrecker",
    gif: "",
    instructions: "",
    sets: [
      { reps: 12, repsData: [] },
      { reps: 12, repsData: [] },
      { reps: 12, repsData: [] },
    ],
  },
]);

export function addRepDataToSet(exerciseIndex, setIndex, repData) {
  exerciseStore.update((exercises) => {
    exercises[exerciseIndex].sets[setIndex].repsData.push(repData);
    return exercises;
  });
}
