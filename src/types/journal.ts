export type SortOptions = "newest" | "oldest" | "favorite" | "shared";

export type DailyGraitudes = [string, string, string];

export type FilterOptions = {
  favorite: boolean;
  shared: boolean;
};

export type JournalContextType = {
  entries: GratitudeEntry[];
  todayPrompt: string | null;
  hasWrittenToday: boolean;
  addEntry: (entry: GratitudeEntry) => void;
  setTodayPrompt: (prompt: string) => void;
  shareJournal: (entry: GratitudeEntry) => void;
  toggleFavorite: (entryId: number) => void;
  toggleShare: (entryId: number) => void;
  deleteEntry: (entryId: number) => void;
  getSharedEntries: (userId: number) => GratitudeEntry[];
  updateSeenEntries: (userId: number, entries: number[]) => void;
};

export type GratitudeEntry = {
  id: number;
  userId: number;
  date: Date;
  items: DailyGraitudes;
  isShared: boolean;
  isFavorite: boolean;
};

export type SharedEntry = {
  id: number;
  entryId: number;
  userId: number;
  timestamp: Date;
  isFavorite: boolean;
};
