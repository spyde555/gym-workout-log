import { formatDate, sessionTotalVolume } from "./workout";
import { WorkoutSession } from "@/constants/types";

describe("formatDate", () => {
  it("formats an ISO date string into a readable date", () => {
    const result = formatDate("2026-06-17T10:00:00.000Z");
    expect(result).toContain("2026");
    expect(result).toContain("Jun");
  });

  it("includes the day of the month", () => {
    const result = formatDate("2026-01-05T12:00:00.000Z");
    expect(result).toContain("5");
  });

  it("returns a non-empty string for a valid date", () => {
    const result = formatDate("2026-12-25T00:00:00.000Z");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("sessionTotalVolume", () => {
  const makeSession = (
    exercises: WorkoutSession["exercises"]
  ): WorkoutSession => ({
    id: "test-session",
    date: "2026-06-17T10:00:00.000Z",
    exercises,
  });

  it("returns 0 for a session with no exercises", () => {
    const session = makeSession([]);
    expect(sessionTotalVolume(session)).toBe(0);
  });

  it("calculates volume for a single set (reps * weight)", () => {
    const session = makeSession([
      {
        exercise: { id: "bench", name: "Bench Press", category: "Chest" },
        sets: [{ reps: 10, weight: 60 }],
      },
    ]);
    expect(sessionTotalVolume(session)).toBe(600);
  });

  it("sums volume across multiple sets", () => {
    const session = makeSession([
      {
        exercise: { id: "squat", name: "Squat", category: "Legs" },
        sets: [
          { reps: 5, weight: 100 },
          { reps: 5, weight: 100 },
        ],
      },
    ]);
    expect(sessionTotalVolume(session)).toBe(1000);
  });

  it("sums volume across multiple exercises", () => {
    const session = makeSession([
      {
        exercise: { id: "bench", name: "Bench Press", category: "Chest" },
        sets: [{ reps: 10, weight: 50 }],
      },
      {
        exercise: { id: "curl", name: "Bicep Curl", category: "Arms" },
        sets: [{ reps: 12, weight: 15 }],
      },
    ]);
    expect(sessionTotalVolume(session)).toBe(500 + 180);
  });

  it("returns 0 when sets have zero reps", () => {
    const session = makeSession([
      {
        exercise: { id: "plank", name: "Plank", category: "Core" },
        sets: [{ reps: 0, weight: 0 }],
      },
    ]);
    expect(sessionTotalVolume(session)).toBe(0);
  });

  it("handles an exercise with an empty sets array", () => {
    const session = makeSession([
      {
        exercise: { id: "deadlift", name: "Deadlift", category: "Back" },
        sets: [],
      },
    ]);
    expect(sessionTotalVolume(session)).toBe(0);
  });

  it("handles bodyweight exercises (weight 0) as zero volume", () => {
    const session = makeSession([
      {
        exercise: { id: "pullup", name: "Pull-Up", category: "Back" },
        sets: [{ reps: 8, weight: 0 }],
      },
    ]);
    expect(sessionTotalVolume(session)).toBe(0);
  });
});