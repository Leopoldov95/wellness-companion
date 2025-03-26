import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  JournalContextType,
  GratitudeEntry,
  SortOptions,
  FilterOptions,
  DailyGraitudes,
  SharedEntry,
} from "@/src/types/journal";
import journalPrompts from "@/src/data/journal.json";
import { filterEntries, sortEntries } from "@/src/utils/journalUtils";

/*** DUMMY DATA START ***/
const DUMMYDATA: GratitudeEntry[] = [
  {
    id: 1,
    userId: 123,
    items: [
      "abc ajs lksaj dlksadlsajdlsa jdlsalskjdsad",
      "sdsd laksdlksajdlsak dlksaj dlsajdlsak jdlksadlsak jdlsakjd",
      "sdsd ajs askjsa hdkjakashdksajkajd haskjdh",
    ],
    date: new Date("2032-12-23"), // YYYY-MM-DD
    isFavorite: false,
    isShared: false,
  },
  {
    id: 11,
    userId: 123,
    items: ["grateful1", "blessed1", "happy1"],
    date: new Date("2025-01-01"),
    isFavorite: false,
    isShared: true,
  },
  {
    id: 12,
    userId: 123,
    items: ["grateful2", "blessed2", "happy2"],
    date: new Date("2025-01-02"),
    isFavorite: true,
    isShared: false,
  },
  {
    id: 13,
    userId: 123,
    items: ["grateful3", "blessed3", "happy3"],
    date: new Date("2025-01-03"),
    isFavorite: false,
    isShared: false,
  },
  {
    id: 14,
    userId: 123,
    items: ["grateful4", "blessed4", "happy4"],
    date: new Date("2025-01-03"),
    isFavorite: true,
    isShared: true,
  },
  {
    id: 15,
    userId: 123,
    items: ["grateful5", "blessed5", "happy5"],
    date: new Date("2025-01-04"),
    isFavorite: false,
    isShared: true,
  },
  {
    id: 16,
    userId: 123,
    items: ["grateful6", "blessed6", "happy6"],
    date: new Date("2025-01-05"),
    isFavorite: false,
    isShared: true,
  },
  {
    id: 17,
    userId: 123,
    items: ["grateful7", "blessed7", "happy7"],
    date: new Date("2025-01-06"),
    isFavorite: true,
    isShared: false,
  },
  {
    id: 18,
    userId: 123,
    items: ["grateful8", "blessed8", "happy8"],
    date: new Date("2025-01-07"),
    isFavorite: true,
    isShared: true,
  },
  {
    id: 19,
    userId: 123,
    items: ["grateful9", "blessed9", "happy9"],
    date: new Date("2025-01-09"),
    isFavorite: false,
    isShared: false,
  },
  {
    id: 20,
    userId: 123,
    items: ["grateful10", "blessed10", "happy10"],
    date: new Date("2025-01-11"),
    isFavorite: false,
    isShared: true,
  },

  // User 456
  {
    id: 21,
    userId: 456,
    items: ["thankful for health", "grateful for family", "happy for sunshine"],
    date: new Date("2025-02-15"),
    isFavorite: true,
    isShared: false,
  },
  {
    id: 22,
    userId: 456,
    items: [
      "loving my job",
      "grateful for supportive friends",
      "peaceful life",
    ],
    date: new Date("2025-02-20"),
    isFavorite: false,
    isShared: false,
  },
  {
    id: 23,
    userId: 456,
    items: [
      "good food ajs lajslksa jl jsadla sdlkjsadlsakjdlakjsdlsaal",
      "great sleep kjsalkjasl dalksjdsalk lksadlksa",
      "positive mindset alksjsakjd alkd ja jda jalk dlkasjd",
    ],
    date: new Date("2025-02-25"),
    isFavorite: true,
    isShared: true,
  },

  // User 789
  {
    id: 31,
    userId: 789,
    items: ["new opportunities", "great workout", "relaxing evening"],
    date: new Date("2025-03-10"),
    isFavorite: false,
    isShared: true,
  },
  {
    id: 32,
    userId: 789,
    items: ["learning new skills", "amazing book", "coffee with friends"],
    date: new Date("2025-03-12"),
    isFavorite: true,
    isShared: false,
  },
  {
    id: 33,
    userId: 789,
    items: ["family dinner", "kind stranger", "beautiful sunset"],
    date: new Date("2025-03-14"),
    isFavorite: false,
    isShared: false,
  },

  // User 999
  {
    id: 41,
    userId: 999,
    items: ["peaceful morning", "meditation", "delicious breakfast"],
    date: new Date("2025-04-05"),
    isFavorite: true,
    isShared: true,
  },
  {
    id: 42,
    userId: 999,
    items: ["successful project", "helpful mentor", "fun weekend"],
    date: new Date("2025-04-08"),
    isFavorite: false,
    isShared: true,
  },
];

const DUMMY_SHARED: SharedEntry[] = [];
/*** DUMMY DATA END ***/

//TODO ~ Will need two separate fetch requests, one for ALL shared entries and one for all user entries.

//* These are the states and functions I want exposed OUTSIDE the provider
const JournalContext = createContext<JournalContextType>({
  entries: [],
  todayPrompt: null,
  hasWrittenToday: false,
  addEntry: () => {},
  setTodayPrompt: (prompt: string) => {},
  shareJournal: (entry: GratitudeEntry) => {}, //? what was this for
  toggleFavorite: (entryId: number) => {},
  toggleShare: (entryId: number) => {},
  deleteEntry: (entryId: number) => {},
  getSharedEntries: (userId: number) => [],
  updateSeenEntries: (userId: number, entries: number[]) => {},
});

const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  /**
   * Lets keep the main entries here and only update using methods
   * Lets not use setEntries explicitly to avoid unexpected issues
   */
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [todayPrompt, setTodayPrompt] = useState<string | null>(null);
  const [hasWrittenToday, setHasWrittenToday] = useState(false);

  useEffect(() => {
    // show a random prompt on user page load
    const randPrompt =
      journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setTodayPrompt(randPrompt);

    //* entries will be the 'constant' state for the API fetch data
    setEntries(DUMMYDATA);
  }, []);

  const addEntry = (entry: GratitudeEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setHasWrittenToday(true);
  };

  const saveEntry = (dailyEntries: DailyGraitudes, shared: boolean = false) => {
    // id: number;
    // userId: number;
    // date: string;
    // items: [string, string, string]; // must have a length of 3
    // isShared: boolean;
    // isFavorite: boolean;
    const newEntry: GratitudeEntry = {
      id: 99,
      userId: 0,
      date: new Date(),
      items: [...dailyEntries],
      isShared: shared,
      isFavorite: false,
    };

    //TODO ~ this will need to be saved to DB
  };

  const toggleFavorite = (entryId: number) => {
    const updatedEntries = entries.map((entry) =>
      entry.id !== entryId ? entry : { ...entry, isFavorite: !entry.isFavorite }
    );

    setEntries(updatedEntries);
  };

  const toggleShare = (entryId: number) => {
    const updatedEntries = entries.map((entry) =>
      entry.id !== entryId ? entry : { ...entry, isShared: !entry.isShared }
    );

    setEntries(updatedEntries);
  };

  const deleteEntry = (entryId: number) => {
    const updatedEntries = entries.filter((entry) => entry.id !== entryId);
    setEntries(updatedEntries);
  };

  /** Shared Entries **/
  // TODO will need to pass in arguments
  // TODO use a JOIN on querying both tables, but for now just use manual filtering
  const getSharedEntries = (userId: number) => {
    let data = entries.filter(
      (entry) => entry.isShared && entry.userId !== userId
    );
    // get viewed posts based on user Id so that users won't see them again
    const viewHistory = DUMMY_SHARED.filter(
      (viewed) => viewed.userId === userId
    ).map((viewed) => viewed.entryId);

    // filter out those posts from the total entries
    if (!viewHistory || viewHistory.length === 0) {
      return data; // No viewed history? Return all shared entries
    }

    // Filter out entries the user has already seen
    return data.filter((entry) => !viewHistory.includes(entry.id));
  };

  // similar to above method, however here we only need to query the shared_entries table and then retrieve the post from the entries table
  const getFavoriteSharedEntries = (userId: number) => {};

  const updateSeenEntries = (userId: number, entries: number[]) => {
    const newShared: SharedEntry[] = [];
    entries.forEach((entryId) => {
      newShared.push({
        id: DUMMY_SHARED.length,
        entryId,
        userId,
        timestamp: new Date(),
        isFavorite: false,
      });
    });
    // save to db
    DUMMY_SHARED.concat(newShared);
  };

  const value = {
    entries,
    setEntries,
    todayPrompt,
    hasWrittenToday,
    addEntry,
    setTodayPrompt,
    toggleFavorite,
    toggleShare,
    deleteEntry,
    getSharedEntries,
    updateSeenEntries,
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

export default JournalProvider;

export const useJournal = () => useContext(JournalContext);
