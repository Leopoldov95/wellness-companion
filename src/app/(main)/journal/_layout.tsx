import BackButton from "@/src/components/BackButton";
import JournalProvider from "@/src/providers/JournalProvider";
import { router, Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const JournalLayout = () => {
  return (
    <SafeAreaProvider>
      <JournalProvider>
        <Stack
          initialRouteName="journal"
          screenOptions={{
            headerTitleAlign: "center",
            headerLeft: () => <BackButton onPress={() => router.back()} />,
          }}
        />
      </JournalProvider>
    </SafeAreaProvider>
  );
};

export default JournalLayout;
