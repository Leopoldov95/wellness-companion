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
  subheader: {
    fontFamily: Fonts.seconday[500],
    fontSize: 18,
    color: Colors.light.tertiary,
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.primary[400],
  },
  bodySm: {
    fontSize: 14,
    fontFamily: Fonts.primary[400],
  },
  linkText: {
    fontFamily: Fonts.primary[300],
    color: Colors.light.tint,
  },
  labelText: {
    fontFamily: Fonts.primary[500],
    color: Colors.light.textDark,
  },
  button: {
    borderRadius: 100,
    marginVertical: 10,
  },
  buttonContect: {
    paddingVertical: 10,
  },
});
