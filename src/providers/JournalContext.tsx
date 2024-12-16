import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { JournalContextType, GratitudeEntry } from "@/src/types/journal";
import journalPrompts from "@/src/data/journal.json";
//* These are the states and functions I want exposed OUTSIDE the provider
const JournalContext = createContext<JournalContextType | undefined>(undefined);

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

  const value = {
    entries,
    todayPrompt,
    hasWrittenToday,
    addEntry,
    setTodayPrompt,
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

export default JournalProvider;

export const useJournal = () => useContext(JournalContext);
