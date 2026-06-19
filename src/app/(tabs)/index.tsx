import { Exercise, ExerciseEntry, WorkoutSession } from "@/constants/types";
import { useWorkouts } from "@/context/WorkoutContext";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // recebe o exercício vindo do modal
  const { addSession } = useWorkouts(); // função para guardar do contexto

  const [entries, setEntries] = useState<ExerciseEntry[]>([]); // treino em construção

  // quando volta do modal com um exercício, adiciona-o ao treino
  useEffect(() => {
    if (params.selectedExercise) {
      try {
        const exercise: Exercise = JSON.parse(
          params.selectedExercise as string,
        );
        setEntries((prev) => [
          ...prev,
          { exercise, sets: [{ reps: 0, weight: 0 }] }, // adiciona com 1 set vazio
        ]);
      } catch (e) {
        console.error("Failed to parse selected exercise", e);
      }
      router.setParams({ selectedExercise: undefined }); // limpa para não repetir
    }
  }, [params.selectedExercise]);

  // atualiza reps ou peso de um set (de forma imutável)
  const updateSet = (
    exIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string,
  ) => {
    const num = parseInt(value, 10);
    setEntries((prev) => {
      const copy = [...prev]; // nova cópia (nova referência)
      const sets = [...copy[exIndex].sets];
      sets[setIndex] = {
        ...sets[setIndex],
        [field]: isNaN(num) ? 0 : num, // input inválido -> 0
      };
      copy[exIndex] = { ...copy[exIndex], sets };
      return copy;
    });
  };

  // adiciona mais um set a um exercício
  const addSet = (exIndex: number) => {
    setEntries((prev) => {
      const copy = [...prev];
      copy[exIndex] = {
        ...copy[exIndex],
        sets: [...copy[exIndex].sets, { reps: 0, weight: 0 }],
      };
      return copy;
    });
  };

  // remove um exercício da lista
  const removeExercise = (exIndex: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== exIndex));
  };

  // guarda o treino: valida, cria o objeto, persiste, vibra e limpa
  const saveWorkout = async () => {
    if (entries.length === 0) {
      Alert.alert("Nothing to save", "Add at least one exercise first.");
      return; // não guarda treino vazio
    }
    const session: WorkoutSession = {
      id: `session-${Date.now()}`, // id único
      date: new Date().toISOString(), // data como string ISO
      exercises: entries,
    };
    await addSession(session); // guarda (contexto + armazenamento)
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // vibração
    setEntries([]); // limpa para o próximo treino
    Alert.alert("Saved!", "Your workout has been logged.");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Today&apos;s Workout</Text>

      {/* lista dos exercícios do treino atual */}
      <FlatList
        data={entries}
        keyExtractor={(item, index) => `${item.exercise.id}-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No exercises yet. Tap “Add Exercise” to start.
          </Text>
        }
        renderItem={({ item, index: exIndex }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.exerciseName}>{item.exercise.name}</Text>
              <Pressable onPress={() => removeExercise(exIndex)}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>

            {/* cada set: reps + peso */}
            {item.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="reps"
                  value={set.reps ? String(set.reps) : ""}
                  onChangeText={(v) => updateSet(exIndex, setIndex, "reps", v)}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="kg"
                  value={set.weight ? String(set.weight) : ""}
                  onChangeText={(v) =>
                    updateSet(exIndex, setIndex, "weight", v)
                  }
                />
              </View>
            ))}

            <Pressable onPress={() => addSet(exIndex)}>
              <Text style={styles.addSet}>+ Add set</Text>
            </Pressable>
          </View>
        )}
      />

      {/* botões: adicionar exercício (abre o modal) e guardar */}
      <View style={styles.footer}>
        <Pressable
          style={styles.addExerciseBtn}
          onPress={() => router.push("/pick-exercise")}
        >
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </Pressable>
        <Pressable style={styles.saveBtn} onPress={saveWorkout}>
          <Text style={styles.saveText}>Save Workout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseName: { fontSize: 17, fontWeight: "600" },
  remove: { color: "#dc2626", fontSize: 13 },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  setLabel: { width: 50, fontSize: 14, color: "#555" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: "center",
  },
  addSet: { color: "#2563eb", marginTop: 4, fontSize: 14 },
  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addExerciseBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  addExerciseText: { color: "#2563eb", fontWeight: "600", fontSize: 15 },
  saveBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
