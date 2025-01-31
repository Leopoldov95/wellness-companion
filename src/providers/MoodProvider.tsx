import { createContext, PropsWithChildren, useContext, useState } from "react";
import { MoodContextType, moodType } from "../types/mood";
//* These are the states and functions I want exposed OUTSIDE the provider
const MoodContext = createContext<MoodContextType>({
  mood: 3,
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

const MoodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [mood, setMood] = useState<moodType>(3);
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
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export default MoodProvider;

export const useMood = () => useContext(MoodContext);
