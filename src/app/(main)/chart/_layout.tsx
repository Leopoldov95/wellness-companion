import GoalsProvider from "@/src/providers/GoalsProvider";
import JournalProvider from "@/src/providers/JournalProvider";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ChartLayout = () => {
  return (
    <SafeAreaProvider>
      <GoalsProvider>
        <JournalProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </JournalProvider>
      </GoalsProvider>
    </SafeAreaProvider>
  );
};

export default ChartLayout;
