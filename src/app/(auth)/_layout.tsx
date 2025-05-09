import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AuthLayout = () => {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
};

export default AuthLayout;
