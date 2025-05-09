export type SortOptions = "newest" | "oldest" | "favorite" | "shared";

export type DailyGraitudes = [string, string, string];

export type FilterOptions = {
  favorite: boolean;
  shared: boolean;
};

export type JournalContextType = {
  todayPrompt: string | null;
  hasWrittenToday: boolean;
  setTodayPrompt: (prompt: string) => void;
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
