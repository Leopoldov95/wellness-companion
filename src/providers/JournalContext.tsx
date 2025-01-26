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
} from "@/src/types/journal";
import journalPrompts from "@/src/data/journal.json";
import { filterEntries, sortEntries } from "@/src/services/journalService";

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
    date: "12/23/32",
    isFavorite: false,
    isShared: false,
  },
  {
    id: 11,
    userId: 123,
    items: ["grateful1", "blessed1", "happy1"],
    date: "01/01/25",
    isFavorite: false,
    isShared: true,
  },
  {
    id: 12,
    userId: 123,
    items: ["grateful2", "blessed2", "happy2"],
    date: "01/02/25",
    isFavorite: true,
    isShared: false,
  },
  {
    id: 13,
    userId: 123,
    items: ["grateful3", "blessed3", "happy3"],
    date: "01/03/25",
    isFavorite: false,
    isShared: false,
  },
  {
    id: 14,
    userId: 123,
    items: ["grateful4", "blessed4", "happy4"],
    date: "01/03/25",
    isFavorite: true,
    isShared: true,
  },
  {
    id: 15,
    userId: 123,
    items: ["grateful5", "blessed5", "happy5"],
    date: "01/04/25",
    isFavorite: false,
    isShared: true,
  },
  {
    id: 16,
    userId: 123,
    items: ["grateful6", "blessed6", "happy6"],
    date: "01/05/25",
    isFavorite: false,
    isShared: true,
  },
  {
    id: 17,
    userId: 123,
    items: ["grateful7", "blessed7", "happy7"],
    date: "01/06/25",
    isFavorite: true,
    isShared: false,
  },
  {
    id: 18,
    userId: 123,
    items: ["grateful8", "blessed8", "happy8"],
    date: "01/07/25",
    isFavorite: true,
    isShared: true,
  },
  {
    id: 19,
    userId: 123,
    items: ["grateful9", "blessed9", "happy9"],
    date: "01/09/25",
    isFavorite: false,
    isShared: false,
  },
  {
    id: 20,
    userId: 123,
    items: ["grateful10", "blessed10", "happy10"],
    date: "01/11/25",
    isFavorite: false,
    isShared: true,
  },
];
/*** DUMMY DATA END ***/

//TODO ~ Will need two separate fetch requests, one for ALL shared entries and one for all user entries.

//* These are the states and functions I want exposed OUTSIDE the provider
const JournalContext = createContext<JournalContextType>({
  entries: [],
  todayPrompt: null,
  hasWrittenToday: false,
  addEntry: () => {},
  setTodayPrompt: (prompt: string) => {},
  shareJournal: (entry: GratitudeEntry) => {},
  toggleFavorite: (entryId: number) => {},
  toggleShare: (entryId: number) => {},
  deleteEntry: (entryId: number) => {},
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
      date: new Date().toLocaleDateString("en-US"),
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
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

export default JournalProvider;

export const useJournal = () => useContext(JournalContext);
