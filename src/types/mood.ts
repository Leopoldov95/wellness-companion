export type moodType = 1 | 2 | 3 | 4 | 5;

export type MoodContextType = {
  mood: moodType;
  onMoodPress: (mood: moodType) => Promise<void>;
  isMoodTracked: boolean;
};
