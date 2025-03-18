import { Alert, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/src/styles/globals";
import BackButton from "@/src/components/BackButton";
import { router } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useJournal } from "@/src/providers/JournalProvider";
import { GratitudeEntry } from "@/src/types/journal";
import Notepad from "@/assets/images/journal/notepad.svg";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
  Directions,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Fonts from "@/src/constants/Fonts";
import { useNavigation } from "@react-navigation/native";

const BG_IMG = [
  require("@/assets/images/journal/entries/entry-bg-1.png"),
  require("@/assets/images/journal/entries/entry-bg-2.png"),
  require("@/assets/images/journal/entries/entry-bg-3.png"),
  require("@/assets/images/journal/entries/entry-bg-4.png"),
  require("@/assets/images/journal/entries/entry-bg-5.png"),
  require("@/assets/images/journal/entries/entry-bg-6.png"),
  require("@/assets/images/journal/entries/entry-bg-7.png"),
  require("@/assets/images/journal/entries/entry-bg-8.png"),
  require("@/assets/images/journal/entries/entry-bg-9.png"),
  require("@/assets/images/journal/entries/entry-bg-10.png"),
  require("@/assets/images/journal/entries/entry-bg-11.png"),
  require("@/assets/images/journal/entries/entry-bg-12.png"),
  require("@/assets/images/journal/entries/entry-bg-13.png"),
];

type RandBgType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const getRandomNumber = (): RandBgType =>
  Math.floor(Math.random() * 13) as RandBgType;

const SharedScreen = () => {
  const { getSharedEntries, updateSeenEntries } = useJournal();
  const entries = getSharedEntries(123);
  const navigation = useNavigation();
  const [viewed, setViewed] = useState<number[]>([]);
  const [entryIdx, setEntryIdx] = useState<number>(0);
  const [currentEntry, setCurrentEntry] = useState<GratitudeEntry | null>(null);
  const [randBgImg, setRandBgImg] = useState<RandBgType>(getRandomNumber());

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // save seen entries to db
      console.log("****");
      console.log("Saving to db");
      updateSeenEntries(123, viewed);
    });

    return () => unsubscribe();
  }, [navigation, viewed]);

  useEffect(() => {
    setRandBgImg(getRandomNumber());
    const entry = entries[entryIdx];
    setCurrentEntry(entry);
    setViewed((prevViewed) => [...prevViewed, entry.id]);
  }, [entryIdx]);

  // Shared values for animations
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Helper function to update entry after animation completes
  const updateEntry = () => {
    runOnJS(setEntryIdx)(Math.min(entryIdx + 1, entries.length - 1));
    translateX.value = 0;
    translateY.value = 0;
    opacity.value = 1; // Reset opacity
  };

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      opacity.value = withTiming(0, { duration: 150 }); // Fade out
      translateX.value = withTiming(-300, { duration: 200 }, () =>
        runOnJS(updateEntry)()
      );
    })
    .runOnJS(true);

  const swipeUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      opacity.value = withTiming(0, { duration: 150 }); // Fade out
      translateY.value = withTiming(-300, { duration: 200 }, () =>
        runOnJS(updateEntry)()
      );
    })
    .runOnJS(true);

  // Animated style for smooth transitions
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />
        <Text style={globalStyles.title}>Community</Text>
        <Text style={[globalStyles.subheader, { marginTop: 20 }]}>
          Shared Entries
        </Text>
        {entryIdx < entries.length && (
          <GestureDetector gesture={Gesture.Simultaneous(swipeLeft, swipeUp)}>
            <View style={styles.gestureContainer}>
              <Animated.View style={[styles.card, animatedStyle]}>
                <View style={styles.bgContainer}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={BG_IMG[randBgImg]}
                  />
                </View>
                <View style={styles.content}>
                  {currentEntry?.items.map((item, idx) => (
                    <Text style={styles.text} key={idx}>
                      {idx + 1}. {item}
                    </Text>
                  ))}
                </View>
              </Animated.View>
            </View>
          </GestureDetector>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default SharedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.greyBg,
  },
  gestureContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    paddingTop: 80,
  },
  card: {
    position: "relative",
    width: "100%",
    height: 350,
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "white",
    // Box shadow for Android
    elevation: 2,
    borderRadius: 20,
  },
  bgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    opacity: 0.4,
  },
  text: {
    fontFamily: Fonts.primary[500],
    fontSize: 18,
    marginBottom: 4,
  },
  content: {
    paddingTop: 40,
    paddingLeft: 30,
    paddingRight: 30,
  },
});
