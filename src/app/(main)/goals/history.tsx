import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text>history</Text>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.light.greyBg,
  },
});
