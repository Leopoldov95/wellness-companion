import { TrackAsset } from "@/src/types/meditation";
import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

export async function loadTracks(): Promise<TrackAsset[]> {
  return Object.entries({
    track1: require("@/assets/tracks/blessing.mp3"),
    track2: require("@/assets/tracks/blossom.mp3"),
    track3: require("@/assets/tracks/earth.mp3"),
    track4: require("@/assets/tracks/floating.mp3"),
    track5: require("@/assets/tracks/motion.mp3"),
    track6: require("@/assets/tracks/movement.mp3"),
    track7: require("@/assets/tracks/replenish.mp3"),
    track8: require("@/assets/tracks/sanctuary.mp3"),
    track9: require("@/assets/tracks/test.mp3"),
  }).map(([key, asset], index) => {
    const { name, uri } = Asset.fromModule(asset);
    return {
      name,
      uri,
      id: index,
    };
  });
}

export async function setupAudioMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
  });
}

export const playTrack = async (playback: Sound, uri: string) => {
  try {
    const status = await playback.getStatusAsync();

    if (status.isLoaded) {
      await playback.unloadAsync(); // Unload current track before loading a new one
    }

    return await playback.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.error("error inside play method", error);
  }
};

export const pauseTrack = async (playback: Sound) => {
  try {
    return await playback.setStatusAsync({ shouldPlay: false });
  } catch (error) {
    console.error("error inside pause method", error);
  }
};

export const resumeTrack = async (playback: Sound) => {
  try {
    return await await playback.playAsync();
  } catch (error) {
    console.error("error inside resume method", error);
  }
};

export const playNextTrack = async (playback: Sound, uri: string) => {
  try {
    // stop current audio
    await playback.stopAsync();
    await playback.unloadAsync();
    return await playTrack(playback, uri);
  } catch (error) {
    console.error("error inside next track method", error);
  }
};
