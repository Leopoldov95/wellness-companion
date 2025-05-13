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
          <Stack
            screenOptions={{
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen name="index" />
          </Stack>
        </JournalProvider>
      </GoalsProvider>
    </SafeAreaProvider>
  );
};

export default ChartLayout;
