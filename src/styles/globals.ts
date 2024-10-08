import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
//import Fonts from "@/src/constants/Fonts";

export const globalStyles = StyleSheet.create({
  title: {
    fontSize: 36,
    textAlign: "center",
    color: Colors.light.primary,
    fontFamily: Fonts.seconday[700],
  },
});
