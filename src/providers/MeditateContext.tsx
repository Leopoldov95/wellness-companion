import { Asset } from "expo-asset";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type TrackModule = {
  [key: string]: number;
};

type TrackAsset = {
  name: string;
  uri: string;
};

//* These are the states and functions I want exposed OUTSIDE the provider
type MeditateContextType = {
  tracks: TrackAsset[];
  currentAudio: TrackAsset | null;
  onTrackPress: (track: TrackAsset) => Promise<void>;
};

const MeditateContext = createContext<MeditateContextType>({
  tracks: [],
  currentAudio: null,
  onTrackPress: async (track: TrackAsset) => {},
});

const MeditateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [tracks, setTracks] = useState<TrackAsset[]>([]);
  const [playBackObj, setPlaybackObj] = useState<Sound | null>(null);
  const [soundObj, setSoundObj] = useState<AVPlaybackStatus | null>(null);
  const [currentAudio, setCurrentAudio] = useState<TrackAsset | null>(null);

  useEffect(() => {
    console.log("hello from meditate provider");
    async function loadTracks() {
      //! This will be stored in a DB, local test only
      const audioModules: TrackModule = {
        track1: require("../../assets/tracks/Blessing.mp3"),
        track2: require("../../assets/tracks/Blossom.mp3"),
        track3: require("../../assets/tracks/Earth.mp3"),
        track4: require("../../assets/tracks/Floating.mp3"),
        track5: require("../../assets/tracks/Motion.mp3"),
        track6: require("../../assets/tracks/Movement.mp3"),
        track7: require("../../assets/tracks/Replenish.mp3"),
        // Add more tracks as needed
      };

      const loadedAssets: any = await Asset.loadAsync(
        Object.values(audioModules)
      );

      setTracks(loadedAssets);
    }

    loadTracks();
  }, []);

  const playTrack = async (playback: Sound, uri: string) => {
    try {
      return await playback.loadAsync({ uri }, { shouldPlay: true });
    } catch (error) {
      console.error("error inside play method", error);
    }
  };

  const pauseTrack = async (playback: Sound) => {
    try {
      return await playback.setStatusAsync({ shouldPlay: false });
    } catch (error) {
      console.error("error inside pause method", error);
    }
  };

  const resumeTrack = async (playback: Sound) => {
    try {
      return await await playback.playAsync();
    } catch (error) {
      console.error("error inside resume method", error);
    }
  };

  const playNextTrack = async (playback: Sound, uri: string) => {
    try {
      // stop current audio
      await playback.stopAsync();
      await playback.unloadAsync();
      return await playTrack(playback, uri);
    } catch (error) {
      console.error("error inside next track method", error);
    }
  };

  const onTrackPress = async (track: TrackAsset) => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    // playing audio for the first time
    if (soundObj === null) {
      console.log("playing audio...");

      const playBackObj = new Audio.Sound();

      const status = await playTrack(playBackObj, track.uri);
      if (status) {
        setCurrentAudio(track);
        setPlaybackObj(playBackObj);
        setSoundObj(status);
      }

      return;
    }

    // pause audio if playing
    if (
      playBackObj &&
      soundObj?.isLoaded &&
      soundObj.isPlaying &&
      currentAudio?.name === track.name
    ) {
      const status = await pauseTrack(playBackObj);
      if (status) {
        setSoundObj(status);
      }
      return;
    }

    // resume audio if paused
    if (
      playBackObj &&
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio?.name === track.name
    ) {
      const status = await resumeTrack(playBackObj);
      if (status) {
        setSoundObj(status);
      }
      return;
    }

    // select another audio
    //TODO - replace name with id when getting from DB
    if (playBackObj && soundObj.isLoaded && currentAudio?.name !== track.name) {
      const status = await playNextTrack(playBackObj, track.uri);
      if (status) {
        setCurrentAudio(track);
        setSoundObj(status);
      }
    }
    //! ref for ios playback, will need for later
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

  const value = {
    tracks,
    currentAudio,
    onTrackPress,
  };

  return (
    <MeditateContext.Provider value={value}>
      {children}
    </MeditateContext.Provider>
  );
};

export default MeditateProvider;

export const useMeditate = () => useContext(MeditateContext);
