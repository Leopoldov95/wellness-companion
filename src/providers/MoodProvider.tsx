import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { MoodContextType, MoodEntry, moodType } from "@/src/types/mood";
import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text } from "react-native";
//* These are the states and functions I want exposed OUTSIDE the provider
const MoodContext = createContext<MoodContextType>({
  mood: 3,
  moods: [],
  onMoodPress: async () => {},
  isMoodTracked: false,
});

const MoodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [mood, setMood] = useState<moodType>(3);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [isMoodTracked, setIsMoodTracked] = useState(false);

  const onMoodPress = async (userMood: moodType) => {
    console.log(`your mood is ${userMood}`);

    setMood(userMood);
    setIsMoodTracked(true);
  };

  const value = {
    mood,
    onMoodPress,
    isMoodTracked,
    moods,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export default MoodProvider;

export const useMood = () => useContext(MoodContext);
