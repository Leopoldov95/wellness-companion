export type moodType = 1 | 2 | 3 | 4 | 5;

export type MoodContextType = {
  mood: moodType;
  moods: MoodEntry[];
  onMoodPress: (mood: moodType) => Promise<void>;
  isMoodTracked: boolean;
};

export type MoodEntry = {
  id: number;
  userId: string;
  mood: moodType;
  created_at: Date;
};
