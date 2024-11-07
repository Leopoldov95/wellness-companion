import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import Feather from "@expo/vector-icons/Feather";
import TabBar from "@/src/components/TabBar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MoodProvider from "@/src/providers/MoodContext";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  return (
    <MoodProvider>
      <SafeAreaProvider style={{ flex: 1, paddingTop: insets.top }}>
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          tabBar={(props) => <TabBar {...props} />}
        ></Tabs>
      </SafeAreaProvider>
    </MoodProvider>
  );
}
