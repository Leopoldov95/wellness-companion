import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "@/src/components/useColorScheme";
import TabBar from "@/src/components/TabBar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MoodProvider from "@/src/providers/MoodProvider";
import GoalsProvider from "@/src/providers/GoalsProvider";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <MoodProvider>
      {/* Goal Provider to show the upcomming weekly goals on the home page */}
      <GoalsProvider>
        <SafeAreaProvider style={{ flex: 1, paddingTop: insets.top }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarHideOnKeyboard: true,
            }}
            tabBar={(props) => <TabBar {...props} />}
          ></Tabs>
        </SafeAreaProvider>
      </GoalsProvider>
    </MoodProvider>
  );
}
