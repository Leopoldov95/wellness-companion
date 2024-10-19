import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import React, { ForwardedRef, forwardRef } from "react";
import Fonts from "@/src/constants/Fonts";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  text: string;
  variant?: ButtonVariant;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, variant = "primary", ...pressableProps }, ref) => {
    const buttonStyle =
      variant === "primary" ? styles.primaryButton : styles.secondaryButton;
    const textStyle =
      variant === "primary" ? styles.primaryText : styles.secondaryText;
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={[styles.container, buttonStyle]}
      >
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.seconday[600],
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: Colors.light.primary,
  },
});

export default Button;
