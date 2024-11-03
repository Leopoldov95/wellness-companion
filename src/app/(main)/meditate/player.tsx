import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import Slider from "@react-native-community/slider";
import PlayerButton from "@/src/components/meditate/PlayerButton";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { useMeditate } from "@/src/providers/MeditateContext";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { playTrack, pauseTrack } from "@/src/providers/audioUtils";

const { width, height } = Dimensions.get("window");

const PlayerScreen = () => {
  const {
    tracks,
    playBackObj,
    currentAudio,
    isPlaying,
    onTrackPress,
    selectedDuration,
    totalAudioCount,
    currentAudioIdx,
    setCurrentAudio,
    setPlaybackObj,
    setSoundObj,
    setIsPlaying,
    setCurrentAudioIdx,
  } = useMeditate();

  console.log(playBackObj);

  const handleNext = async () => {
    if (playBackObj) {
      const { isLoaded } = await playBackObj?.getStatusAsync();
      const isLastAudio = currentAudioIdx + 1 === totalAudioCount;
      let audio = tracks[currentAudioIdx + 1];
      let index, status;

      if (!isLoaded && !isLastAudio) {
        index = currentAudioIdx + 1;
        status = await playTrack(playBackObj, audio.uri);
      }

      if (status) {
        // set the state here
      }
    }
  };

  const onBackBtn = () => {
    if (playBackObj) {
      playBackObj.setStatusAsync({ shouldPlay: false });
    }
    router.back();
  };

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
      {/* custom back button */}
      {/* TODO ~ need to PAUSE when going back */}
      <Pressable style={styles.backBtn} onPress={onBackBtn}>
        <Feather name="arrow-left" size={48} color="#fff" />
      </Pressable>
      <View style={styles.content}>
        <Text style={styles.trackName}>{currentAudio?.name}</Text>
        {/* Timer controls */}
        <View style={styles.timerContainer}>
          <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={selectedDuration * 60}
            strokeWidth={5}
            colors={[Colors.light.quinary]}
            size={250}
            onComplete={() => {
              // Handle timer completion
              return { shouldRepeat: false, delay: 1 };
            }}
          >
            {({ remainingTime }) => (
              <Text style={styles.timerText}>
                {`${Math.floor(remainingTime / 60)
                  .toString()
                  .padStart(2, "0")}:${(remainingTime % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </Text>
            )}
          </CountdownCircleTimer>
        </View>

        {/* Player controls */}
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
              onPress={() => currentAudio && onTrackPress(currentAudio)}
              style={{ marginHorizontal: 30 }}
              iconType={isPlaying ? "PAUSE" : "PLAY"}
            />
            <PlayerButton iconType="NEXT" onPress={handleNext} />
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
  backBtn: {
    position: "absolute",
    top: 26,
    left: 20,
    zIndex: 10,
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
    backgroundColor: "rgba(255, 255, 255, 0.65)",
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
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 250,
    marginHorizontal: "auto",
    borderRadius: 125,
  },
  timerText: {
    fontSize: 40,
    fontFamily: Fonts.primary[400],
    color: "white",
  },
});

export default PlayerScreen;
