export type ExerciseCategory =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Other";

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
};

export type WorkoutSet = {
  reps: number;
  weight: number;
};

export type ExerciseEntry = {
  exercise: Exercise;
  sets: WorkoutSet[];
};

export type WorkoutSession = {
  id: string;
  date: string; // ISO date string, e.g. "2026-06-15"
  exercises: ExerciseEntry[];
};