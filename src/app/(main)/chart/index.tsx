import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";

/**
 * What do we want to show here?
 * Mood metrics
 * Goal Metrics
 * Journaling metrics
 */

const ChartScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Stats</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: Colors.light.greyBg,
  },
});

export default ChartScreen;
