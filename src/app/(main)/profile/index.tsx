import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Profile screen!</Text>
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

export default ProfileScreen;
