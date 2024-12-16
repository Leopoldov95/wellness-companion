export interface JournalContextType {
  entries: GratitudeEntry[];
  todayPrompt: Prompt | null;
  hasWrittenToday: boolean;
  addEntry: (entry: GratitudeEntry) => void;
  setTodayPrompt: (prompt: Prompt) => void;
}

export type GratitudeEntry = {
  id: string;
  userId: string;
  date: string;
  items: Array<{
    text: string;
    timestamp: string;
  }>;
  isShared: boolean;
  isAnonymous: boolean;
};
