import { StyleSheet, Text, View } from "react-native";
import React from "react";

type GoalProgressBarProps = {
  progress: number;
  color: string;
};

const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  progress,
  color,
}) => {
  return (
    <View style={styles.progress}>
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
              ? { color: "white" }
              : { marginRight: -25, color: "black" }, // Fix incorrect variable name
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
    width: "90%",
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
