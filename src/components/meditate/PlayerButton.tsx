import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";

type PlayerButtonProps = {
  iconType: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  otherProps?: any;
};

const PlayerButton = (props: PlayerButtonProps) => {
  const { iconType, size = 40, color = Colors.light.quinary, onPress } = props;
  const getIconName = (type: string) => {
    switch (type) {
      case "PLAY":
        return "play-circle";
      case "PAUSE":
        return "pause-circle";
      case "NEXT":
        return "skip-forward";
      case "PREV":
        return "skip-back";
    }
  };
  return (
    <Feather
      {...props}
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={color}
    />
  );
};

export default PlayerButton;
