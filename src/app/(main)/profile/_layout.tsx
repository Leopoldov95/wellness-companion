import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ProfileLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
};

export default ProfileLayout;
