import {
  loadTracks,
  pauseTrack,
  playNextTrack,
  playTrack,
  resumeTrack,
  setupAudioMode,
} from "@/src/services/audioService";
import {
  DurationType,
  MeditateContextType,
  TrackAsset,
} from "@/src/types/meditation";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

//* These are the states and functions I want exposed OUTSIDE the provider
const MeditateContext = createContext<MeditateContextType>({
  tracks: [],
  currentAudio: null,
  onTrackPress: async (track: TrackAsset) => {},
  isPlaying: false,
  selectedDuration: 5,
  setSelectedDuration: () => {},
  playBackObj: null,
  totalAudioCount: 0,
  currentAudioIdx: 0,
  setCurrentAudio: () => {},
  setPlaybackObj: () => {},
  setSoundObj: () => {},
  setIsPlaying: () => {},
  setCurrentAudioIdx: () => {},
  onMeditationEnd: () => {},
});

const MeditateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [tracks, setTracks] = useState<TrackAsset[]>([]);
  const [playBackObj, setPlaybackObj] = useState<Sound | null>(null);
  const [soundObj, setSoundObj] = useState<AVPlaybackStatus | null>(null);
  const [currentAudio, setCurrentAudio] = useState<TrackAsset | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<DurationType>(5);
  const [totalAudioCount, setTotalAudioCount] = useState<number>(0);
  const [currentAudioIdx, setCurrentAudioIdx] = useState<number>(0);

  useEffect(() => {
    async function initializeTracks() {
      const loadedTracks = await loadTracks();
      setTracks(loadedTracks);
      setTotalAudioCount(loadedTracks.length);
    }

    initializeTracks();
  }, []);

  const onTrackPress = async (track: TrackAsset) => {
    await setupAudioMode();

    if (soundObj === null) {
      const playBackObj = new Audio.Sound();
      const status = await playTrack(playBackObj, track.uri);
      if (status) {
        setCurrentAudio(track);
        setPlaybackObj(playBackObj);
        setSoundObj(status);
        setIsPlaying(true);
        setCurrentAudioIdx(track.id);

        // Listen for track completion and repeat if necessary
        playBackObj.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            await playTrack(playBackObj, track.uri); // Restart track
          }
        });
      }
      return;
    }

    // ... rest of the onTrackPress logic
    // playing audio for the first time
    if (soundObj === null) {
      const playBackObj = new Audio.Sound();

      const status = await playTrack(playBackObj, track.uri);
      if (status) {
        setCurrentAudio(track);
        setPlaybackObj(playBackObj);
        setSoundObj(status);
        setIsPlaying(true);
        setCurrentAudioIdx(track.id);
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
        setIsPlaying(false);
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
        setIsPlaying(true);
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
        setIsPlaying(true);
      }
    }
  };

  const onMeditationEnd = async () => {
    let status;
    if (playBackObj) {
      status = await pauseTrack(playBackObj);
    }

    if (status) {
      setIsPlaying(false);
      setSoundObj(null);
      setCurrentAudio(null);
    }
  };

  const value = {
    tracks,
    currentAudio,
    onTrackPress,
    isPlaying,
    selectedDuration,
    setSelectedDuration,
    playBackObj,
    totalAudioCount,
    currentAudioIdx,
    setCurrentAudio,
    setPlaybackObj,
    setSoundObj,
    setIsPlaying,
    setCurrentAudioIdx,
    onMeditationEnd,
  };

  return (
    <MeditateContext.Provider value={value}>
      {children}
    </MeditateContext.Provider>
  );
};

export default MeditateProvider;

export const useMeditate = () => useContext(MeditateContext);
