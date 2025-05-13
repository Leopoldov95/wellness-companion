import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";

type BackButtonProps = {
  onPress: () => void;
  inverted?: boolean;
};

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  inverted = false,
}) => {
  const color = inverted ? "#fff" : Colors.light.textDark;
  return (
    <Pressable onPress={onPress}>
      <Feather name="chevron-left" size={24} color={color} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  // backBtn: {
  //   position: "absolute",
  //   top: 32,
  //   left: 20,
  //   zIndex: 10,
  // },
});
