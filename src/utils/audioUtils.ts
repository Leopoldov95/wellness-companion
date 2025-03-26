import { Sound } from "expo-av/build/Audio";

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
