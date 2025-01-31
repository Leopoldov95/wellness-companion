import { createContext, PropsWithChildren, useContext, useState } from "react";

const GoalsContext = createContext<any>({});

//TODO ~ Flow
/**
 * 1. Goals get loaded from user DB table
 * 2. long term goals get loaded
 * 3. Then weekly goals get loaded
 * 4. User actions updates the db tables
 */

const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const value = {};

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
};

export default GoalsProvider;

export const useGoals = () => useContext(GoalsContext);
