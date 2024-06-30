import { writable } from 'svelte/store';

export const exerciseStore = writable([
  {
    title: 'Beinstrecker',
    gif: '',
    instructions: '',
    sets: 1,
    reps: 12,
    repsData: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75] // Beispiel-Daten für die Wiederholungen
  },
  // Weitere Übungen können hier hinzugefügt werden
]);
