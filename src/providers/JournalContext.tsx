import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { JournalContextType, GratitudeEntry } from "@/src/types/journal";
import journalPrompts from "@/src/data/journal.json";
//* These are the states and functions I want exposed OUTSIDE the provider
const JournalContext = createContext<JournalContextType>({
  entries: [],
  todayPrompt: null,
  hasWrittenToday: false,
  addEntry: () => {},
  setTodayPrompt: (prompt: string) => {},
  shareJournal: (entry: GratitudeEntry) => {},
});

const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [todayPrompt, setTodayPrompt] = useState<string | null>(null);
  const [hasWrittenToday, setHasWrittenToday] = useState(false);

  React.useEffect(() => {
    // show a random prompt on user page load
    const randPrompt =
      journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setTodayPrompt(randPrompt);
  }, []);

  const addEntry = (entry: GratitudeEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setHasWrittenToday(true);
  };

  // share the journal entry anonymously
  const shareJournal = (entry: GratitudeEntry) => {
    console.log("you want to share the gratidue");
    // * Might be easiest to just set this as a flag in the DB
  };

  const value = {
    entries,
    todayPrompt,
    hasWrittenToday,
    addEntry,
    setTodayPrompt,
    shareJournal,
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

export default JournalProvider;

export const useJournal = () => useContext(JournalContext);
