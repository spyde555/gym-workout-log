import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { WorkoutSession } from "@/constants/types";

const STORAGE_KEY = "workout_sessions"; // chave onde os treinos são guardados

// o que o contexto disponibiliza à app toda
type WorkoutContextType = {
  sessions: WorkoutSession[];
  isLoading: boolean;
  addSession: (session: WorkoutSession) => Promise<void>;
};

// undefined por defeito para detetar uso fora do provider
const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined
);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]); // lista de treinos
  const [isLoading, setIsLoading] = useState(true); // true até carregar do armazenamento

  // carrega os treinos guardados uma vez, ao iniciar a app
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setSessions(JSON.parse(stored)); // null na 1ª vez -> fica vazio
      } catch (error) {
        console.error("Failed to load workout sessions:", error);
      } finally {
        setIsLoading(false); // corre sempre, com ou sem erro
      }
    };
    loadSessions(); // o useEffect não pode ser async, por isso chamamos aqui
  }, []);

  // adiciona um treino: atualiza o estado e guarda no armazenamento
  const addSession = async (session: WorkoutSession) => {
    try {
      const updated = [session, ...sessions]; // mais recente primeiro
      setSessions(updated); // atualiza o ecrã
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // guarda no disco
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

// hook personalizado para os ecrãs usarem useWorkouts()
export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkouts must be used within a WorkoutProvider");
  }
  return context;
}