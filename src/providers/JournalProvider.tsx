import journalPrompts from "@/src/data/journal.json";
import { GratitudeEntry, JournalContextType } from "@/src/types/journal";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

//TODO ~ Will need two separate fetch requests, one for ALL shared entries and one for all user entries.

//* These are the states and functions I want exposed OUTSIDE the provider
const JournalContext = createContext<JournalContextType>({
  todayPrompt: null,
  hasWrittenToday: false,
  setTodayPrompt: (prompt: string) => {},
});

const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [todayPrompt, setTodayPrompt] = useState<string | null>(null);
  const [hasWrittenToday, setHasWrittenToday] = useState(false);

  useEffect(() => {
    // show a random prompt on user page load
    const randPrompt =
      journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setTodayPrompt(randPrompt);
  }, []);

  const value = {
    todayPrompt,
    hasWrittenToday,
    setTodayPrompt,
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

export default JournalProvider;

export const useJournal = () => useContext(JournalContext);
