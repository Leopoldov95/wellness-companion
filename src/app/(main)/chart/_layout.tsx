import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MoodProvider from "@/src/providers/MoodProvider";
import GoalsProvider from "@/src/providers/GoalsProvider";
import JournalProvider from "@/src/providers/JournalProvider";

const ChartLayout = () => {
  return (
    <SafeAreaProvider>
      <GoalsProvider>
        <JournalProvider>
          <MoodProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </MoodProvider>
        </JournalProvider>
      </GoalsProvider>
    </SafeAreaProvider>
  );
};

export default ChartLayout;
