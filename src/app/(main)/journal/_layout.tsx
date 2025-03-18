import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import JournalProvider from "@/src/providers/JournalProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

const JournalLayout = () => {
  return (
    <SafeAreaProvider>
      <JournalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="entries"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="shared"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
      </JournalProvider>
    </SafeAreaProvider>
  );
};

export default JournalLayout;
