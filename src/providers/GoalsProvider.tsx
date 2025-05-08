import { GoalsContextType } from "@/src/types/goals";
import { createContext, PropsWithChildren, useContext } from "react";

const GoalsContext = createContext<GoalsContextType>({
  today: new Date(),
});

//! Remeber, only setStates here, use helper methods when exposing externally
const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const today = new Date();

  //* Note to self, getting parent goal using db query seems excessive

  const value = {
    today,
  };

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
};

export default GoalsProvider;

export const useGoals = () => useContext(GoalsContext);
