import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { WorkoutSession } from "@/constants/types";

const STORAGE_KEY = "workout_sessions";

type WorkoutContextType = {
  sessions: WorkoutSession[];
  isLoading: boolean;
  addSession: (session: WorkoutSession) => Promise<void>;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined
);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved sessions when the app starts
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSessions(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load workout sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const addSession = async (session: WorkoutSession) => {
    try {
      const updated = [session, ...sessions];
      setSessions(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save workout session:", error);
    }
  };

  return (
    <WorkoutContext.Provider value={{ sessions, isLoading, addSession }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkouts must be used within a WorkoutProvider");
  }
  return context;
}