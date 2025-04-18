import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";

type GoalProgressBarProps = {
  progress: number;
  color: string;
  compact?: boolean;
};

const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  progress,
  color,
  compact,
}) => {
  return (
    <View
      style={[
        styles.progress,
        compact && { backgroundColor: Colors.light.greyBg },
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            width: `${progress}%`,
            backgroundColor: `${color}`,
          },
        ]}
      >
        <Text
          style={[
            styles.progressText,
            progress > 20
              ? { color: "white", marginRight: 8 }
              : { marginRight: -30, color: Colors.light.textDark }, // Fix incorrect variable name
            compact && { fontSize: 12, paddingTop: 2 },
          ]}
        >
          {progress ?? 0}%
        </Text>
      </View>
    </View>
  );
};

export default GoalProgressBar;

const styles = StyleSheet.create({
  progress: {
    width: "100%",
    height: 20,
    backgroundColor: "white",
    borderRadius: 12,
    margin: "auto",
    position: "relative",
    overflow: "hidden",
  },
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 20,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  progressText: {
    marginLeft: "auto",
  },
});
