import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { DEFAULT_EXERCISES } from "@/constants/exercises";
import { Exercise } from "@/constants/types";

export default function PickExerciseScreen() {
  const router = useRouter(); // navegação
  const [search, setSearch] = useState(""); // texto pesquisado

  // filtra a lista conforme o que escreves
  const filtered = DEFAULT_EXERCISES.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  // volta ao Home e envia o exercício escolhido (em JSON, porque params são strings)
  const selectExercise = (exercise: Exercise) => {
    router.navigate({
      pathname: "/(tabs)",
      params: { selectedExercise: JSON.stringify(exercise) },
    });
  };

  // cria um exercício personalizado a partir do texto escrito
  const addCustom = () => {
    const trimmed = search.trim();
    if (trimmed.length === 0) return; // ignora se estiver vazio
    const custom: Exercise = {
      id: `custom-${Date.now()}`, // id único
      name: trimmed,
      category: "Other",
    };
    selectExercise(custom);
  };

  return (
    <View style={styles.container}>
      {/* barra de pesquisa */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search or type a custom exercise..."
        value={search}
        onChangeText={setSearch}
      />

      {/* lista de exercícios (só renderiza os visíveis) */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id} // chave estável
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed, // feedback ao tocar
            ]}
            onPress={() => selectExercise(item)} // escolher exercício
          >
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No matching exercises.</Text> // sem resultados
        }
      />

      {/* botão de exercício personalizado (só aparece se houver texto) */}
      {search.trim().length > 0 && (
        <Pressable style={styles.customButton} onPress={addCustom}>
          <Text style={styles.customButtonText}>
            + Add &quot;{search.trim()}&quot; as custom
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowPressed: {
    backgroundColor: "#f2f2f2",
  },
  exerciseName: {
    fontSize: 16,
  },
  category: {
    fontSize: 13,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 24,
  },
  customButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  customButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});