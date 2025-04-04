import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { globalStyles } from "@/src/styles/globals";
// import Button from "@/src/components/Button";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import Colors from "@/src/constants/Colors";
import WelcomeGraphic from "@/assets/images/auth/welcome-graphic.svg";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import Fonts from "@/src/constants/Fonts";

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={globalStyles.title}>
          Welcome To Your Next Mental Health App
        </Text>
        <Text style={styles.subheader}>
          Your wellness companion for no matter where you are
        </Text>
      </View>
      <WelcomeGraphic width={325} height={325} />
      <View>
        <Button
          buttonColor={Colors.light.primary}
          mode="contained"
          style={globalStyles.button}
          contentStyle={globalStyles.buttonContect}
          onPress={() => router.push("/(auth)/sign-up")}
        >
          Get Started
        </Button>
        <Link href="/(auth)/sign-in" style={styles.link}>
          <Text style={globalStyles.linkText}>Already have an account?</Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 30,
    backgroundColor: Colors.light.greyBg,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  subheader: {
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    height: 60,
    aspectRatio: 1,
  },
  link: {},
});

export default WelcomeScreen;
