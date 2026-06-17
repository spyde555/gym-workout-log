import { WorkoutProvider } from "@/context/WorkoutContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pick-exercise"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Pick an Exercise",
          }}
        />
      </Stack>
    </WorkoutProvider>
  );
}
