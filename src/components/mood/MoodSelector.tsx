import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeOut, FadeIn } from "react-native-reanimated";
import React from "react";
import Happy from "@/assets/images/emotions/happy.svg";
import Sad from "@/assets/images/emotions/sad.svg";
import Neutral from "@/assets/images/emotions/neutral.svg";
import VeryHappy from "@/assets/images/emotions/very-happy.svg";
import VerySad from "@/assets/images/emotions/very-sad.svg";
import { globalStyles } from "@/src/styles/globals";
import { moodType } from "@/src/types/mood";
import Colors from "@/src/constants/Colors";

interface MoodTrackerProps {
  onMoodPress: (mood: moodType) => void;
}

const MoodSelector: React.FC<MoodTrackerProps> = ({ onMoodPress }) => {
  return (
    <Animated.View exiting={FadeOut.duration(800)} style={styles.moodContainer}>
      <Text style={[globalStyles.subheader, styles.subheader]}>
        How Was Your Mood Today?
      </Text>
      <View style={styles.moods}>
        <Pressable onPress={() => onMoodPress(1)}>
          <VerySad width={60} height={60} />
        </Pressable>
        <Pressable onPress={() => onMoodPress(2)}>
          <Sad width={60} height={60} />
        </Pressable>
        <Pressable onPress={() => onMoodPress(3)}>
          <Neutral width={60} height={60} />
        </Pressable>
        <Pressable onPress={() => onMoodPress(4)}>
          <Happy width={60} height={60} />
        </Pressable>
        <Pressable onPress={() => onMoodPress(5)}>
          <VeryHappy width={60} height={60} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default MoodSelector;

const styles = StyleSheet.create({
  moodContainer: {},
  subheader: {
    textAlign: "center",
    marginBottom: 10,
  },
  moods: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.quaternary,
    borderRadius: 25,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
});
