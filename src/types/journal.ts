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
  userId: string;
  created_at: Date;
  items: DailyGraitudes;
  isShared: boolean;
  isFavorite: boolean;
};

export type SharedEntry = {
  id: number;
  entryId: number;
  userId: number;
  created_at: Date;
  isFavorite: boolean;
};

export type JournalAPIEntry = {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  item_1: string;
  item_2: string;
  item_3: string;
  is_shared: boolean;
  is_favorite: boolean;
};
