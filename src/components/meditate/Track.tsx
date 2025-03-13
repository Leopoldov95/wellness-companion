import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { TrackAsset } from "@/src/types/meditation";
import Fonts from "@/src/constants/Fonts";

type TrackProps = {
  track: TrackAsset;
  onPress: (track: TrackAsset) => void;
};

const Track: React.FC<TrackProps> = ({ track, onPress }) => {
  return (
    <View style={styles.track}>
      <Image
        style={styles.trackImage}
        source={require("@/assets/images/meditation/Earth.jpg")}
        resizeMode="cover"
      />
      <View style={styles.trackDetails}>
        <Text style={styles.trackName}>{track.name}</Text>
        {/* ! changing func to test player screen */}
        {/* <Pressable onPress={() => router.push("/(main)/meditate/player")}> */}
        <Pressable onPress={() => onPress(track)}>
          {/* change icon on play (separate screen) */}
          <Feather name="play-circle" size={32} color={Colors.light.primary} />
        </Pressable>
      </View>
    </View>
  );
};

export default Track;

const styles = StyleSheet.create({
  track: {
    borderRadius: 12,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Box shadow for Android
    elevation: 2,
  },

  trackImage: {
    width: 100,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  trackDetails: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackName: {
    fontSize: 20,
    fontFamily: Fonts.seconday[600],
  },
});
