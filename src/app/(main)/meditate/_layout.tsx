import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MeditateProvider from "@/src/providers/MeditateProvider";

const MeditateLayout = () => {
  return (
    <MeditateProvider>
      <SafeAreaProvider>
        <Stack
          initialRouteName="meditate"
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaProvider>
    </MeditateProvider>
  );
};

export default MeditateLayout;
