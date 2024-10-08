import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ChartLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChartLayout;
