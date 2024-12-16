import { Asset } from "expo-asset";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { TrackModule, TrackAsset } from "@/src/types/meditation";

export async function loadTracks(): Promise<TrackAsset[]> {
  const audioModules: TrackModule = {
    track1: require("../../assets/tracks/Blessing.mp3"),
    track2: require("../../assets/tracks/Blossom.mp3"),
    track9: require("../../assets/tracks/Deep.mp3"),
    track3: require("../../assets/tracks/Earth.mp3"),
    track4: require("../../assets/tracks/Floating.mp3"),
    track5: require("../../assets/tracks/Motion.mp3"),
    track6: require("../../assets/tracks/Movement.mp3"),
    track7: require("../../assets/tracks/Replenish.mp3"),
    track8: require("../../assets/tracks/Sanctuary.mp3"),
  };

  const loadedAssets: any = await Asset.loadAsync(Object.values(audioModules));

  return loadedAssets.map((track: TrackAsset, idx: number) => ({
    ...track,
    id: idx,
  }));
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
