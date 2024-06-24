import { writable } from 'svelte/store';

export const exerciseStore = writable({
  title: '',
  gif: '',
  instructions: '',
  sets: 0,
  reps: 0
});
