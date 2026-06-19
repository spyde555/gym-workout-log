import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkouts } from "@/context/WorkoutContext";
import { formatDate, sessionTotalVolume } from "@/utils/workout";

export default function HistoryScreen() {
  const { sessions, isLoading } = useWorkouts(); // lê o estado global (não tem estado próprio)

  // enquanto carrega do armazenamento, mostra um spinner
  if (isLoading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>History</Text>

      {/* lista dos treinos guardados */}
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id} // chave estável
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No workouts logged yet. Go to Home to log your first one.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              {/* volume total = soma de reps x peso */}
              <Text style={styles.volume}>
                {sessionTotalVolume(item)} kg total
              </Text>
            </View>
            {/* uma linha por exercício, com nº de sets */}
            {item.exercises.map((entry, i) => (
              <Text key={i} style={styles.exerciseLine}>
                {entry.exercise.name} — {entry.sets.length}{" "}
                {entry.sets.length === 1 ? "set" : "sets"}
              </Text>
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
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
    marginBottom: 8,
  },
  date: { fontSize: 16, fontWeight: "600" },
  volume: { fontSize: 13, color: "#2563eb", fontWeight: "600" },
  exerciseLine: { fontSize: 14, color: "#444", marginBottom: 2 },
});