import { WorkoutSession } from "@/constants/types";

// Format an ISO date string into a readable date, e.g. "Jun 17, 2026"
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Total volume = sum of (reps * weight) across all sets in a session
export function sessionTotalVolume(session: WorkoutSession): number {
  let total = 0;
  for (const entry of session.exercises) {
    for (const set of entry.sets) {
      total += set.reps * set.weight;
    }
  }
  return total;
}