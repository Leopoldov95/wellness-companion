import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Pressable,
} from "react-native";

import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import Feather from "@expo/vector-icons/Feather";
import { useMeditate } from "@/src/providers/MeditateContext";
import { globalStyles } from "@/src/styles/globals";
import Button from "@/src/components/Button";
import { useState } from "react";
import DurationButton from "@/src/components/meditate/DurationButton";
import { router } from "expo-router";
import { TrackAsset } from "@/src/types/meditation";
import { Picker } from "@react-native-picker/picker";
type DurationType = 5 | 10 | 15 | 20 | 25 | 30;

const MeditateScreen = () => {
  const {
    tracks,
    onTrackPress,
    currentAudio,
    setSelectedDuration,
    selectedDuration,
  } = useMeditate();

  const handleDurationSelect = (duration: DurationType) => {
    setSelectedDuration(duration);
    // You can add additional logic here, such as updating the context or performing other actions
  };

  const onTrackSelect = (track: TrackAsset) => {
    onTrackPress(track);
    router.push("/(main)/meditate/player");
  };

  const renderItem: ListRenderItem<TrackAsset> = ({ item }) => {
    return (
      <View style={styles.track}>
        <Text style={styles.trackName}>{item.name}</Text>
        {/* !! This should redirect to another media player page */}
        {/* ! changing func to test player screen */}
        {/* <Pressable onPress={() => router.push("/(main)/meditate/player")}> */}
        <Pressable onPress={() => onTrackSelect(item)}>
          {/* change icon on play (separate screen) */}
          <Feather name="play-circle" size={32} color={Colors.light.primary} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Meditation</Text>

      {/* set the duration */}
      <View style={styles.duration}>
        <Text style={globalStyles.subheader}>Set Duration:</Text>
        <Picker
          selectedValue={selectedDuration}
          onValueChange={(itemValue) => setSelectedDuration(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="5 minutes" value={5} />
          <Picker.Item label="10 minutes" value={10} />
          <Picker.Item label="15 minutes" value={15} />
          <Picker.Item label="20 minutes" value={20} />
          <Picker.Item label="25 minutes" value={25} />
          <Picker.Item label="30 minutes" value={30} />
        </Picker>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 10, padding: 5, paddingBottom: 80 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.greyBg,
    marginBottom: 100,
  },
  track: {
    padding: 20,
    borderRadius: 25,
    backgroundColor: Colors.light.offWhite,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  trackName: {
    fontSize: 20,
    fontFamily: Fonts.seconday[600],
  },
  duration: {
    marginTop: 16,
    marginBottom: 24,
    display: "flex",
    gap: 8,
  },
  durationAction: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  picker: {
    width: 200,
    height: 40,
    marginTop: 8,
  },
});

export default MeditateScreen;
