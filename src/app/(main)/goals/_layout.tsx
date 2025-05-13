import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GoalsProvider from "@/src/providers/GoalsProvider";
import { Text } from "react-native";

const GoalsLayout = () => {
  return (
    <SafeAreaProvider>
      <GoalsProvider>
        <Stack screenOptions={{ headerTitleAlign: "center" }}>
          <Stack.Screen
            name="index"
            options={{
              headerRight: () => <Text>Past Goals</Text>,
            }}
          />
          <Stack.Screen name="history" />
          <Stack.Screen name="[id]" />
        </Stack>
      </GoalsProvider>
    </SafeAreaProvider>
  );
};

export default GoalsLayout;
