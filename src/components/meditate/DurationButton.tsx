import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";

type DurationType = 5 | 10 | 15;
type DurationButton = {
  duration: DurationType;
  selectedDuration: number;
  handleDurationSelect: any;
};

const DurationButton = ({
  duration,
  selectedDuration,
  handleDurationSelect,
}: DurationButton) => (
  <Pressable
    style={[
      styles.durationBtn,
      selectedDuration === duration && styles.durationBtnActive,
    ]}
    onPress={() => handleDurationSelect(duration)}
  >
    <Text
      style={[
        styles.durationText,
        selectedDuration === duration && styles.durationTextActive,
      ]}
    >
      {duration}m
    </Text>
  </Pressable>
);

export default DurationButton;

const styles = StyleSheet.create({
  durationBtn: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  durationText: {
    textAlign: "center",
    fontFamily: Fonts.primary[600],
    fontSize: 16,
  },
  durationTextActive: {
    color: "#fff",
  },
  durationBtnActive: {
    backgroundColor: Colors.light.primary,
  },
});
