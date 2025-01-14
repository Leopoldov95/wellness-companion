export interface JournalContextType {
  entries: GratitudeEntry[];
  todayPrompt: string | null;
  hasWrittenToday: boolean;
  addEntry: (entry: GratitudeEntry) => void;
  setTodayPrompt: (prompt: string) => void;
  shareJournal: (entry: GratitudeEntry) => void;
  toggleFavorite: (entryId: number) => void;
  toggleShare: (entryId: number) => void;
  deleteEntry: (entryId: number) => void;
}

export type GratitudeEntry = {
  id: number;
  userId: number;
  date: string;
  items: [string, string, string]; // must have a length of 3
  isShared: boolean;
  isFavorite: boolean;
};
