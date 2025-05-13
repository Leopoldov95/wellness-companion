import React from "react";
import { router, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MeditateProvider from "@/src/providers/MeditateProvider";
import { Text } from "react-native";
import BackButton from "@/src/components/BackButton";

const MeditateLayout = () => {
  return (
    <SafeAreaProvider>
      <MeditateProvider>
        <Stack
          initialRouteName="meditate"
          screenOptions={{
            headerTitleAlign: "center",
            headerLeft: () => <BackButton onPress={() => router.back()} />,
          }}
        />
      </MeditateProvider>
    </SafeAreaProvider>
  );
};

export default MeditateLayout;
