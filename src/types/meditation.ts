import { AVPlaybackStatus } from "expo-av";
import { Sound } from "expo-av/build/Audio";

// types.ts
export type TrackModule = {
  [key: string]: number;
};

export type TrackAsset = {
  name: string;
  uri: string;
  id: number;
};

export type DurationType = 5 | 10 | 15 | 20 | 25 | 30;

export type MeditateContextType = {
  tracks: TrackAsset[];
  currentAudio: TrackAsset | null;
  onTrackPress: (track: TrackAsset) => Promise<void>;
  isPlaying: boolean;
  selectedDuration: DurationType;
  setSelectedDuration: (duration: DurationType) => void;
  playBackObj: Sound | null;
  totalAudioCount: number;
  currentAudioIdx: number;
  setCurrentAudio: (audio: TrackAsset | null) => void;
  setPlaybackObj: (obj: Sound | null) => void;
  setSoundObj: (obj: AVPlaybackStatus | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentAudioIdx: (idx: number) => void;
  onMeditationEnd: () => void;
};
