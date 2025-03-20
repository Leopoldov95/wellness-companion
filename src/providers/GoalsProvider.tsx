import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Category,
  Goal,
  GoalsContextType,
  WeeklyGoal,
  GoalForm,
} from "@/src/types/goals";
import { isActiveWeeklyGoal } from "../services/goalsService";
import { formatDate } from "../utils/dateUtils";

type GoalAction = "Delete" | "Pause" | "Archive";

const GoalsContext = createContext<GoalsContextType>({
  goals: [],
  today: new Date(),
  weeklyGoals: [],
  createGoal: (formData: GoalForm) => {},
  updateGoal: (id: number, formData: GoalForm) => {},
  pauseGoal: (id: number) => {},
  archiveGoal: (id: number) => {},
  getWeeklyGoalsById: (id: number): WeeklyGoal[] => [],
  getUpcommingWeeklyGoal: (date: Date): WeeklyGoal | null => null,
  completeWeeklyTask: (id: number, date: Date) => {},
});

const DUMMY_GOALS: Goal[] = [
  {
    userId: 0,
    id: 0,
    category: "cooking", // Must match one of the `Category` values
    title: "I Like Cooking",
    progress: 34,
    dueDate: new Date("2024-04-30"), // Due in the future
    created: new Date("2024-01-01"), // Created at the start of the year
    lastUpdated: new Date("2024-02-15"), // Last updated mid-February
    color: "red",
    isArchived: false,
    isPaused: false,
    completedTasks: 5, // Example: 5 tasks done
    numTasks: 3, // Weekly goal is to complete 7 tasks
  },
  {
    userId: 0,
    id: 1,
    category: "hobbies", // Must match one of the `Category` values
    title: "Learn Guitar",
    progress: 67,
    dueDate: new Date("2024-06-15"), // Long-term goal (mid-year)
    created: new Date("2024-01-10"), // Created in early January
    lastUpdated: new Date("2024-03-01"), // Updated recently
    color: "blue",
    isArchived: false,
    isPaused: false,
    completedTasks: 20, // Example: 20 tasks completed
    numTasks: 3, // Goal requires 30 tasks over time
  },
  {
    userId: 0,
    id: 2,
    category: "fitness", // Changed category for variety
    title: "Run 100 Miles",
    progress: 50,
    dueDate: new Date("2025-05-01"), // Due soon
    created: new Date("2024-12-01"), // Created last year
    lastUpdated: new Date("2025-02-28"), // Last update at end of February
    color: "green",
    isArchived: false,
    isPaused: false,
    completedTasks: 20, // Halfway done
    numTasks: 4, // Total goal is 100 tasks (e.g., miles run)
  },
];

const DUMMY_WEEKLY: WeeklyGoal[] = [
  // Parent Goal 0 (Cooking)
  {
    id: 100,
    goalId: 0,
    title: "Learn basic knife skills",
    category: "cooking",
    parent: "Master Cooking", // Placeholder from parent goal DB
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-07"),
    color: "#FF5733", // Placeholder from parent goal DB
    numTasks: 3,
    dailyTasks: [],
  },
  {
    id: 101,
    goalId: 0,
    title: "Master 5 foundational recipes",
    category: "cooking",
    parent: "Master Cooking",
    startDate: new Date("2024-01-08"),
    endDate: new Date("2024-01-14"),
    color: "#FF5733",
    numTasks: 3,
    dailyTasks: [
      {
        id: 1,
        weeklyGoalId: 101,
        date: new Date("2024-01-09"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-01-11"),
        completed: true,
      },
    ],
  },
  {
    id: 102,
    goalId: 0,
    title: "Host a dinner party",
    category: "cooking",
    parent: "Master Cooking",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-21"),
    color: "#FF5733",
    numTasks: 3,
    dailyTasks: [],
  },

  // Parent Goal 1 (Hobbies)
  {
    id: 103,
    goalId: 1,
    title: "Photography basics course",
    category: "hobbies",
    parent: "Explore New Hobbies",
    startDate: new Date("2024-01-05"),
    endDate: new Date("2024-01-12"),
    color: "#4A90E2",
    numTasks: 5,
    dailyTasks: [],
  },
  {
    id: 104,
    goalId: 1,
    title: "Weekend hiking trip",
    category: "hobbies",
    parent: "Explore New Hobbies",
    startDate: new Date("2024-02-08"),
    endDate: new Date("2024-02-14"),
    color: "#4A90E2",
    numTasks: 5,
    dailyTasks: [],
  },
  {
    id: 105,
    goalId: 1,
    title: "Watercolor painting workshop",
    category: "hobbies",
    parent: "Explore New Hobbies",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-02-21"),
    color: "#4A90E2",
    numTasks: 5,
    dailyTasks: [
      {
        id: 3,
        weeklyGoalId: 105,
        date: new Date("2024-02-15"),
        completed: true,
      },
      {
        id: 4,
        weeklyGoalId: 105,
        date: new Date("2024-02-16"),
        completed: true,
      },
      {
        id: 5,
        weeklyGoalId: 105,
        date: new Date("2024-02-18"),
        completed: true,
      },
      {
        id: 6,
        weeklyGoalId: 105,
        date: new Date("2024-02-20"),
        completed: true,
      },
    ],
  },

  // Parent Goal 2 (Cooking)
  {
    id: 106,
    goalId: 2,
    title: "Meal prep mastery",
    category: "cooking",
    parent: "Advanced Cooking",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-07"),
    color: "#FF5733",
    numTasks: 4,
    dailyTasks: [
      {
        id: 7,
        weeklyGoalId: 106,
        date: new Date("2024-03-01"),
        completed: true,
      },
      {
        id: 8,
        weeklyGoalId: 106,
        date: new Date("2024-03-03"),
        completed: true,
      },
      {
        id: 9,
        weeklyGoalId: 106,
        date: new Date("2024-03-05"),
        completed: true,
      },
      {
        id: 10,
        weeklyGoalId: 106,
        date: new Date("2024-03-06"),
        completed: true,
      },
    ],
  },
  {
    id: 107,
    goalId: 2,
    title: "Advanced baking techniques",
    category: "cooking",
    parent: "Advanced Cooking",
    startDate: new Date("2024-03-08"),
    endDate: new Date("2024-03-14"),
    color: "#FF5733",
    numTasks: 4,
    dailyTasks: [],
  },
  {
    id: 108,
    goalId: 2,
    title: "International cuisine week",
    category: "cooking",
    parent: "Advanced Cooking",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-21"),
    color: "#FF5733",
    numTasks: 4,
    dailyTasks: [],
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
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const today = new Date("2024-01-10");

  useEffect(() => {
    // use dummy data
    setGoals(DUMMY_GOALS);

    // TODO ~ not ideal, but manually update WEEKLY DATA to add colors and parent title
    DUMMY_WEEKLY.forEach((goal) => {
      const parent = DUMMY_GOALS.find((parent) => parent.id === goal.goalId);
    });

    setWeeklyGoals(getActiveWeeklyGoals(new Date(today)));
  }, []);

  useEffect(() => {
    // TODO ~ not ideal, but manually update WEEKLY DATA to add colors and parent title
    DUMMY_WEEKLY.forEach((goal) => {
      const parent = goals.find((parent) => parent.id === goal.goalId);
      if (parent) {
        goal.parent = parent?.title;
        goal.color = parent?.color;
        goal.category = parent.category;
      }
    });
    setWeeklyGoals(getActiveWeeklyGoals(new Date(today)));
  }, [goals]);

  // get first upcomming weekly goal based on date and not yet having completed tasks
  const getActiveWeeklyGoals = (date: Date) => {
    return DUMMY_WEEKLY.filter((goal) => isActiveWeeklyGoal(goal, date));
  };

  const getWeeklyGoalsById = (id: number): WeeklyGoal[] => {
    return DUMMY_WEEKLY.filter((goal) => goal.goalId === id);
  };

  const createGoal = (formData: GoalForm) => {
    const { category, color, title, dueDate } = formData;
    // create a new goal
    const goal: Goal = {
      userId: 0,
      id: 12,
      category,
      color,
      title,
      dueDate,
      created: new Date(),
      lastUpdated: new Date(),
      progress: 0,
      numTasks: 1,
      completedTasks: 0,
      isArchived: false,
      isPaused: false,
    };
    // add to the DUMMY stack
    DUMMY_GOALS.push(goal);
    // save to db
    // update state
    setGoals(DUMMY_GOALS);
  };

  const updateGoal = (id: number, formData: GoalForm) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, ...formData } // Update only the necessary fields
          : goal
      )
    );
  };

  const deleteGoal = (id: number) => {
    // delete goal
  };

  const pauseGoal = (id: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, isPaused: !goal.isPaused } // Update only the necessary fields
          : goal
      )
    );
  };

  const archiveGoal = (id: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, isArchived: !goal.isArchived } // Update only the necessary fields
          : goal
      )
    );
  };

  //TODO ~ if past goals marked as "complete" then just count it as numTasks
  const calculateGoalProgress = (goal: Goal) => {
    // first need to get the count of weekly goals
    const start = new Date(goal.created);
    const end = new Date(goal.dueDate);

    const numWeeks = Math.floor(
      (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    // get percentage
    const percent =
      goal.completedTasks /
      parseInt(((goal.completedTasks / numWeeks) * 100).toFixed(2));

    return percent;
  };

  // for any updates
  //? not sure how DB edits will be?
  const updateGoalDetails = (id: number, form: Goal) => {};

  /***********************/
  /**** WEEKLY GOALS *****/
  /***********************/

  // method to update weekly goal status's, mainly or when users have been inactive for a long time
  //? Is this really needed?
  const updateUserWeekly = () => {};

  const updateWeeklyGoal = () => {};

  const completeWeeklyTask = (weeklyGoalId: number, date: Date) => {
    setWeeklyGoals((prevWeeklyGoals) =>
      prevWeeklyGoals.map((goal) =>
        goal.id === weeklyGoalId
          ? {
              ...goal,
              dailyTasks: [
                ...goal.dailyTasks,
                {
                  id: goal.dailyTasks.length + 1, // Temporary unique ID (replace with DB-generated ID if needed)
                  weeklyGoalId,
                  date,
                  completed: true,
                },
              ],
            }
          : goal
      )
    );

    // TODO
    /** TODO - much to do
     * update lastUpdate and completedTasks in Goal
     * SINCE daily task is completed for that day, cycle to NEXT upcomming task
     * ! only for the home page though, otherwise do nothing, but on the Goal page button should be disabled
     */
  };

  // Get the first upcomming weekly goal
  // TODO ~ will need to display a message when no more weekly tasks are active for a given week
  const getUpcommingWeeklyGoal = (date: Date) => {
    console.log("updated!");

    console.log(`Date provided: ${formatDate(date)}`);

    const weeklyGoal = weeklyGoals
      .filter((goal) => {
        return (
          isActiveWeeklyGoal(goal, date, true) &&
          (goal.dailyTasks.length === 0 ||
            goal.dailyTasks.some(
              (task) => formatDate(task.date) !== formatDate(new Date(date))
            ))
        );
      }) // Ignore completed goals
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ) // Sort by earliest startDate
      .at(0);

    console.log("goal details");
    console.log(weeklyGoal);

    return weeklyGoal ? weeklyGoal : null;
  };

  const value = {
    goals,
    today,
    weeklyGoals,
    createGoal,
    updateGoal,
    pauseGoal,
    archiveGoal,
    getWeeklyGoalsById,
    getUpcommingWeeklyGoal,
    completeWeeklyTask,
  };

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
};

export default GoalsProvider;

export const useGoals = () => useContext(GoalsContext);
