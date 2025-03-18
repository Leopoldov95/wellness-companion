import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MeditateProvider from "@/src/providers/MeditateProvider";

const MeditateLayout = () => {
  return (
    <SafeAreaProvider>
      <MeditateProvider>
        <Stack
          initialRouteName="meditate"
          screenOptions={{
            headerShown: false,
          }}
        />
      </MeditateProvider>
    </SafeAreaProvider>
  );
};

export default MeditateLayout;
