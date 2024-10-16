import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "@/src/styles/globals";
import Fonts from "@/src/constants/Fonts";
import Button from "@/src/components/Button";
import { router } from "expo-router";

const DEFAULT_IMAGE = "@/assets/images/placeholder/profile.png";

//TODO~ onboarding screen, ask for profile picture and questions and goals
const OnboardingScreen = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onProfileAdd = () => {
    // UPDATE the user profile to have the picture
    // SET the local session to contain the updated user information
    // UPDATE the user context
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Add Profile Picture</Text>

      <Image
        source={image ? { uri: image } : require(DEFAULT_IMAGE)}
        style={styles.image}
      />
      <Text onPress={pickImage} style={globalStyles.linkText}>
        Select Image
      </Text>

      <View style={styles.action}></View>

      <Button onPress={onProfileAdd} text="Continue"></Button>
      <Button
        onPress={() => router.push("/(main)")}
        text="Skip For Now"
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 20,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 125,
  },
  textButton: {
    textAlign: "center",
    fontFamily: Fonts.primary[500],
  },
  action: {},
});

export default OnboardingScreen;
