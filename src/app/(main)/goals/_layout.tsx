import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GoalsProvider from "@/src/providers/GoalsProvider";

const GoalsLayout = () => {
  return (
    <SafeAreaProvider>
      <GoalsProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="history" options={{ headerShown: false }} />
          <Stack.Screen name="[id]/index" options={{ headerShown: false }} />
        </Stack>
      </GoalsProvider>
    </SafeAreaProvider>
  );
};

export default GoalsLayout;
