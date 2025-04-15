import {
  FilterOptions,
  GratitudeEntry,
  SortOptions,
} from "@/src/types/journal";

export const sortEntries = (
  entries: GratitudeEntry[],
  type: SortOptions
): GratitudeEntry[] => {
  switch (type) {
    case "newest":
      return [...entries].sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );
    case "oldest":
      return [...entries].sort(
        (a, b) => a.created_at.getTime() - b.created_at.getTime()
      );
    case "favorite":
      return [...entries].sort(
        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
      );
    case "shared":
      return [...entries].sort(
        (a, b) => Number(b.isShared) - Number(a.isShared)
      );
    default:
      return entries; // Return the original array if no valid sort option is provided
  }
};

export const filterEntries = (
  entries: GratitudeEntry[],
  filter: FilterOptions
): GratitudeEntry[] => {
  return entries.filter((entry) => {
    // Check for favorite and shared inclusively
    if (filter.favorite && filter.shared) {
      return entry.isFavorite || entry.isShared;
    }

    // Filter by favorite only
    if (filter.favorite) {
      return entry.isFavorite;
    }

    // Filter by shared only
    if (filter.shared) {
      return entry.isShared;
    }

    // If no filters are applied, return all entries
    return true;
  });
};
