import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  Pressable,
} from "react-native";
import React, {
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES,
  useEffect,
  useState,
} from "react";
import Colors from "@/src/constants/Colors";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import Fonts from "@/src/constants/Fonts";
import Feather from "@expo/vector-icons/Feather";
import { Sound } from "expo-av/build/Audio";

type TrackModule = {
  [key: string]: number;
};

type TrackAsset = {
  name: string;
  uri: string;
};

type RootStackParamList = {
  TrackList: undefined;
  Player: { track: TrackAsset };
};

type TrackListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "TrackList">;
};

const MeditateScreen = () => {
  const [tracks, setTracks] = useState<TrackAsset[]>([]);
  const [playBackObj, setPlaybackObj] = useState<Sound | null>(null);
  const [soundObj, setSoundObj] = useState<AVPlaybackStatus | null>(null);
  const [currentAudio, setCurrentAudio] = useState<TrackAsset | null>(null);

  useEffect(() => {
    async function loadTracks() {
      // This will be stored in a DB, local test only
      const audioModules: TrackModule = {
        track1: require("../../../../assets/tracks/Blessing.mp3"),
        track2: require("../../../../assets/tracks/Blossom.mp3"),
        track3: require("../../../../assets/tracks/Earth.mp3"),
        track4: require("../../../../assets/tracks/Floating.mp3"),
        track5: require("../../../../assets/tracks/Motion.mp3"),
        track6: require("../../../../assets/tracks/Movement.mp3"),
        track7: require("../../../../assets/tracks/Replenish.mp3"),
        // Add more tracks as needed
      };

      const loadedAssets: any = await Asset.loadAsync(
        Object.values(audioModules)
      );

      setTracks(loadedAssets);
    }

    loadTracks();
  }, []);

  // refactor
  const play = async (playback: Sound, uri: string) => {
    try {
      return await playback.loadAsync({ uri }, { shouldPlay: true });
    } catch (error) {
      console.error("error inside play method", error);
    }
  };

  const pause = async (playback: Sound) => {
    try {
      return await playback?.setStatusAsync({ shouldPlay: false });
    } catch (error) {
      console.error("error inside pause method", error);
    }
  };

  // refactor end

  const playTrack = async (track: TrackAsset) => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    // playing audio for the first time
    if (soundObj === null) {
      console.log("playing audio...");

      const playBackObj = new Audio.Sound();

      const status = await play(playBackObj, track.uri);
      if (status) {
        setCurrentAudio(track);
        setPlaybackObj(playBackObj);
        setSoundObj(status);
      }

      return;
    }

    // pause audio if playing
    if (playBackObj && soundObj?.isLoaded && soundObj.isPlaying) {
      const status = await pause(playBackObj);
      if (status) {
        setSoundObj(status);
      }
      return;
    }

    // resume audio if paused
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio?.name === track.name
    ) {
      const status = await playBackObj?.playAsync();
      if (status) {
        setSoundObj(status);
      }
      return;
    }

    // try {
    //   await Audio.setAudioModeAsync({
    //     allowsRecordingIOS: false,
    //     staysActiveInBackground: true,
    //     playsInSilentModeIOS: true,
    //   });

    //   const { sound } = await Audio.Sound.createAsync(
    //     { uri: track.uri },
    //     { shouldPlay: true }
    //   );
    //   await sound.playAsync();
    // } catch (error) {
    //   console.log("Error playing track:", error);
    // }
  };

  const renderItem: ListRenderItem<TrackAsset> = ({ item }) => (
    <View style={styles.track}>
      <Text style={styles.trackName}>{item.name}</Text>
      {/* !! This should redirect to another media player page */}
      <Pressable onPress={() => playTrack(item)}>
        {/* change icon on play (separate screen) */}
        <Feather name="play-circle" size={32} color={Colors.light.primary} />
      </Pressable>
    </View>
  );

  const getTracks = () => {};

  return (
    <View style={styles.container}>
      <Text>Welcome to the Meditate screen!</Text>

      {/* set the duration */}

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
});

export default MeditateScreen;
