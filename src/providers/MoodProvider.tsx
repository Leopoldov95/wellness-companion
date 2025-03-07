import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { MoodContextType, MoodEntry, moodType } from "@/src/types/mood";
//* These are the states and functions I want exposed OUTSIDE the provider
const MoodContext = createContext<MoodContextType>({
  mood: 3,
  moods: [],
  onMoodPress: async () => {},
  isMoodTracked: false,
});

//TODO ~ Flow
/**
 * 1. User clicks on mood
 * 2. Mood get's stored and actions is saved in DB
 *    i) get's stored as an id, numeric value, and time/date
 * 3. Mood widget dissapears from home page
 * 4. Mood chart can then be seen under the CHARTS page
 * 5. User can edit the mood by clicking on the mood chart widget
 */

const MOOD_DATA: MoodEntry[] = [
  { id: 1, userId: 1, mood: 3, timestamp: new Date("2024-12-01") },
  { id: 2, userId: 1, mood: 5, timestamp: new Date("2024-12-02") },
  { id: 3, userId: 1, mood: 2, timestamp: new Date("2024-12-03") },
  { id: 4, userId: 1, mood: 4, timestamp: new Date("2024-12-04") },
  { id: 5, userId: 1, mood: 1, timestamp: new Date("2024-12-05") },
  { id: 6, userId: 1, mood: 3, timestamp: new Date("2024-12-06") },
  { id: 7, userId: 1, mood: 5, timestamp: new Date("2024-12-07") },
  { id: 8, userId: 1, mood: 2, timestamp: new Date("2024-12-08") },
  { id: 9, userId: 1, mood: 4, timestamp: new Date("2024-12-09") },
  { id: 10, userId: 1, mood: 1, timestamp: new Date("2024-12-10") },
  { id: 11, userId: 1, mood: 3, timestamp: new Date("2024-12-11") },
  { id: 12, userId: 1, mood: 5, timestamp: new Date("2024-12-12") },
  { id: 13, userId: 1, mood: 2, timestamp: new Date("2024-12-13") },
  { id: 14, userId: 1, mood: 4, timestamp: new Date("2024-12-14") },
  { id: 15, userId: 1, mood: 1, timestamp: new Date("2024-12-15") },
  { id: 16, userId: 1, mood: 3, timestamp: new Date("2024-12-16") },
  { id: 17, userId: 1, mood: 5, timestamp: new Date("2024-12-17") },
  { id: 18, userId: 1, mood: 2, timestamp: new Date("2024-12-18") },
  { id: 19, userId: 1, mood: 4, timestamp: new Date("2024-12-19") },
  { id: 20, userId: 1, mood: 1, timestamp: new Date("2024-12-20") },
  { id: 21, userId: 1, mood: 3, timestamp: new Date("2024-12-21") },
  { id: 22, userId: 1, mood: 5, timestamp: new Date("2024-12-22") },
  { id: 23, userId: 1, mood: 2, timestamp: new Date("2024-12-23") },
  { id: 24, userId: 1, mood: 4, timestamp: new Date("2024-12-24") },
  { id: 25, userId: 1, mood: 1, timestamp: new Date("2024-12-25") },
  { id: 26, userId: 1, mood: 3, timestamp: new Date("2024-12-26") },
  { id: 27, userId: 1, mood: 5, timestamp: new Date("2024-12-27") },
  { id: 28, userId: 1, mood: 2, timestamp: new Date("2024-12-28") },
  { id: 29, userId: 1, mood: 4, timestamp: new Date("2024-12-29") },
  { id: 30, userId: 1, mood: 1, timestamp: new Date("2024-12-30") },
  { id: 31, userId: 1, mood: 3, timestamp: new Date("2024-12-31") },

  { id: 1, userId: 1, mood: 4, timestamp: new Date("2025-01-01") },
  { id: 2, userId: 1, mood: 2, timestamp: new Date("2025-01-03") },
  { id: 3, userId: 1, mood: 5, timestamp: new Date("2025-01-06") },
  { id: 4, userId: 1, mood: 3, timestamp: new Date("2025-01-08") },
  { id: 5, userId: 1, mood: 1, timestamp: new Date("2025-01-12") },
  { id: 6, userId: 1, mood: 4, timestamp: new Date("2025-01-15") },
  { id: 7, userId: 1, mood: 3, timestamp: new Date("2025-01-20") },
  { id: 8, userId: 1, mood: 5, timestamp: new Date("2025-01-25") },
  { id: 9, userId: 1, mood: 2, timestamp: new Date("2025-01-27") },

  { id: 10, userId: 1, mood: 3, timestamp: new Date("2025-02-02") },
  { id: 11, userId: 1, mood: 1, timestamp: new Date("2025-02-05") },
  { id: 12, userId: 1, mood: 5, timestamp: new Date("2025-02-08") },
  { id: 13, userId: 1, mood: 4, timestamp: new Date("2025-02-12") },
  { id: 14, userId: 1, mood: 2, timestamp: new Date("2025-02-14") },
  { id: 15, userId: 1, mood: 3, timestamp: new Date("2025-02-18") },
  { id: 16, userId: 1, mood: 1, timestamp: new Date("2025-02-21") },
  { id: 17, userId: 1, mood: 5, timestamp: new Date("2025-02-24") },
  { id: 18, userId: 1, mood: 4, timestamp: new Date("2025-02-28") },
];

const MoodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [mood, setMood] = useState<moodType>(3);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [isMoodTracked, setIsMoodTracked] = useState(false);

  useEffect(() => {
    setMoods(MOOD_DATA);
  }, []);

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
