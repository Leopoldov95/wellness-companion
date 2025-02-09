import { createContext, PropsWithChildren, useContext, useState } from "react";
import {
  Category,
  Goal,
  GoalsContextType,
  WeeklyGoal,
  GoalForm,
} from "@/src/types/goals";

type GoalAction = "Delete" | "Pause" | "Archive";

const GoalsContext = createContext<GoalsContextType>({
  goals: [],
  weeklyGoals: [],
  createGoal: (formData: GoalForm) => {},
});

const DUMMY_GOALS: Goal[] = [
  {
    user_id: 0,
    id: 0,
    category: "cooking", // Must match one of the `Category` values
    title: "I Like cooking",
    progress: 34,
    dueDate: "Aug 2027",
  },
  {
    user_id: 0,
    id: 1,
    category: "hobbies", // Must match one of the `Category` values
    title: "Some Hobby With an extra ong name test more even more",
    progress: 67,
    dueDate: "Mar 2029",
  },
  {
    user_id: 0,
    id: 2,
    category: "cooking", // Must match one of the `Category` values
    title: "I Like cooking",
    progress: 34,
    dueDate: "Aug 2025",
  },
];

const DUMMY_WEEKLY: WeeklyGoal[] = [
  {
    id: 0,
    goal_id: 1,
    title: "Go to gym x times",
    category: "fitness",
    progress: 57,
    parent: "Gym",
    startDate: "01/01/2025",
    endDate: "01/08/2025",
  },
  {
    id: 1,
    goal_id: 1,
    title: "Go to gym x times",
    category: "fitness",
    progress: 57,
    parent: "Gym",
    startDate: "01/01/2025",
    endDate: "01/08/2025",
  },
  {
    id: 2,
    goal_id: 1,
    title: "Go to gym x times",
    category: "fitness",
    progress: 57,
    parent: "Gym",
    startDate: "01/01/2025",
    endDate: "01/08/2025",
  },
  {
    id: 3,
    goal_id: 1,
    title: "Go to gym x times",
    category: "fitness",
    progress: 57,
    parent: "Gym",
    startDate: "01/01/2025",
    endDate: "01/08/2025",
  },
];

//TODO ~ Flow
/**
 * 1. Goals get loaded from user DB table
 * 2. long term goals get loaded
 * 3. Then weekly goals get loaded
 * 4. User actions updates the db tables
 */

//! Remeber, only setStates here, use helper methods when exposing externally
const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weeklyGoals, setWeeklGoals] = useState<WeeklyGoal[]>([]);

  useState(() => {
    // use dummy data
    setGoals(DUMMY_GOALS);
    setWeeklGoals(DUMMY_WEEKLY);
  });

  const updateGoalStatus = (id: number, action: GoalAction) => {
    switch (action) {
      case "Delete":
        // delete goal, remove from db
        deleteGoal(id);
        break;
      case "Pause":
        // pause goal
        break;
      case "Archive":
        // archive goal
        break;
      default:
        break;
    }
  };

  const createGoal = (formData: GoalForm) => {
    const { category, color, title, dueDate } = formData;
    // create a new goal
    const goal: Goal = {
      user_id: 0,
      id: 12,
      category,
      color,
      title,
      dueDate: dueDate.toDateString(),
      progress: 0,
    };
    // add to the DUMMY stack
    DUMMY_GOALS.push(goal);
    // save to db
    // update state
    setGoals(DUMMY_GOALS);
  };

  const deleteGoal = (id: number) => {
    // delete goal
  };

  // for any updates
  //? not sure how DB edits will be?
  const updateGoalDetails = (id: number, form: Goal) => {};

  const updateWeeklyGoal = () => {};

  const value = {
    goals,
    weeklyGoals,
    createGoal,
  };

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
};

export default GoalsProvider;

export const useGoals = () => useContext(GoalsContext);
