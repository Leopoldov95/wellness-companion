import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import PlayerButton from "@/src/components/meditate/PlayerButton";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";

const { width, height } = Dimensions.get("window");

const PlayerScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.audioBg}
          source={require("@/assets/images/meditation/earth.jpg")}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>
      <View style={styles.content}>
        {/* TODO ~ We'll want the track name here */}
        <Text style={styles.trackName}>Earth</Text>
        <View style={styles.bottomControls}>
          <Slider
            style={styles.slider}
            maximumValue={1}
            minimumValue={0}
            minimumTrackTintColor={Colors.light.quaternary}
            maximumTrackTintColor="#000000"
            thumbTintColor={Colors.light.primary}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" />
            <PlayerButton
              onPress={() => console.log("playing")}
              style={{ marginHorizontal: 30 }}
              iconType="PLAY"
            />
            <PlayerButton iconType="NEXT" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  audioBg: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Adjust the last value (0.5) for opacity
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  trackName: {
    color: "white",
    zIndex: 1,
    fontFamily: Fonts.seconday[600],
    textTransform: "uppercase",
    fontSize: 32,
    letterSpacing: 2,
    textAlign: "center",
  },
  bottomControls: {
    marginBottom: 100, // Adjust this value to move controls higher or lower
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 24,
    padding: 8,
  },
  slider: {
    width: width - 50, // Subtract padding from width
    height: 40,
    marginBottom: 10,
  },
  audioControllers: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default PlayerScreen;
