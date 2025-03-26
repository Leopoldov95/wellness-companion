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
import { isActiveWeeklyGoal } from "@/src/utils/goalsUtils";
import { formatDate } from "@/src/utils/dateUtils";

type GoalAction = "Delete" | "Pause" | "Archive";

const GoalsContext = createContext<GoalsContextType>({
  goals: [],
  today: new Date(),
  weeklyGoals: [],
  selectedGoalColors: [],
  createGoal: (formData: GoalForm) => {},
  updateGoal: (id: number, formData: GoalForm) => {},
  getWeeklyGoalsById: (id: number): WeeklyGoal[] => [],
  getUpcommingWeeklyGoal: (date: Date): WeeklyGoal | null => null,
  completeWeeklyTask: (id: number, date: Date) => {},
  deleteGoal: (id: number) => {},
});

const DUMMY_GOALS: Goal[] = [
  {
    userId: 0,
    id: 0,
    category: "cooking", // Must match one of the `Category` values
    title: "I Like Cooking",
    progress: 0,
    dueDate: new Date("2024-03-15"), // Due in the future
    created: new Date("2024-01-01"), // Created at the start of the year
    lastUpdated: new Date("2024-02-15"), // Last updated mid-February
    color: "#f6d5a7",
    numTasks: 3, // Weekly goal is to complete 7 tasks
  },
  {
    userId: 0,
    id: 1,
    category: "hobbies", // Must match one of the `Category` values
    title: "Learn Guitar",
    progress: 0,
    dueDate: new Date("2024-04-15"), // Long-term goal (mid-year)
    created: new Date("2024-01-10"), // Created in early January
    lastUpdated: new Date("2024-03-01"), // Updated recently
    color: "#80cbc4",
    numTasks: 3, // Goal requires 30 tasks over time
  },
  {
    userId: 0,
    id: 2,
    category: "fitness", // Changed category for variety
    title: "Run 100 Miles",
    progress: 0,
    dueDate: new Date("2024-03-01"), // Due soon
    created: new Date("2024-01-01"), // Created last year
    lastUpdated: new Date("2024-02-28"), // Last update at end of February
    color: "#A59D84",
    numTasks: 4, // Total goal is 100 tasks (e.g., miles run)
  },
];

const DUMMY_WEEKLY: WeeklyGoal[] = [
  // Parent Goal 0 (Cooking)
  {
    id: 100,
    goalId: 0,
    title: "Learn basic knife skills",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-07"),
    numTasks: 3,
    dailyTasks: [
      {
        id: 21,
        weeklyGoalId: 101,
        date: new Date("2024-01-02"),
        completed: true,
      },
      {
        id: 22,
        weeklyGoalId: 101,
        date: new Date("2024-01-4"),
        completed: true,
      },
      {
        id: 23,
        weeklyGoalId: 101,
        date: new Date("2024-01-06"),
        completed: true,
      },
    ],
  },
  {
    id: 101,
    goalId: 0,
    title: "Master 5 foundational recipes",
    startDate: new Date("2024-01-08"),
    endDate: new Date("2024-01-14"),
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
        date: new Date("2024-01-10"),
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
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-21"),
    numTasks: 3,
    dailyTasks: [
      {
        id: 1,
        weeklyGoalId: 101,
        date: new Date("2024-01-16"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-01-18"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-01-20"),
        completed: true,
      },
    ],
  },
  {
    id: 102,
    goalId: 0,
    title: "Host a dinner party",
    startDate: new Date("2024-01-22"),
    endDate: new Date("2024-01-28"),
    numTasks: 3,
    dailyTasks: [
      {
        id: 1,
        weeklyGoalId: 101,
        date: new Date("2024-01-24"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-01-25"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-01-26"),
        completed: true,
      },
    ],
  },
  {
    id: 102,
    goalId: 0,
    title: "Host a dinner party",
    startDate: new Date("2024-01-29"),
    endDate: new Date("2024-02-04"),
    numTasks: 3,
    dailyTasks: [
      {
        id: 1,
        weeklyGoalId: 101,
        date: new Date("2024-01-29"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-02-02"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-02-03"),
        completed: true,
      },
    ],
  },
  {
    id: 102,
    goalId: 0,
    title: "Host a dinner party",
    startDate: new Date("2024-02-05"),
    endDate: new Date("2024-02-11"),
    numTasks: 3,
    dailyTasks: [
      {
        id: 1,
        weeklyGoalId: 101,
        date: new Date("2024-02-07"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-02-09"),
        completed: true,
      },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date("2024-02-10"),
        completed: true,
      },
    ],
  },
  {
    id: 202,
    goalId: 0,
    title: "Host a dinner party",
    startDate: new Date("2024-02-12"),
    endDate: new Date("2024-02-18"),
    numTasks: 3,
    dailyTasks: [
      {
        id: 1,
        weeklyGoalId: 101,
        date: new Date("2024-02-13"),
        completed: true,
      },
    ],
  },

  // Parent Goal 1 (Hobbies)
  {
    id: 103,
    goalId: 1,
    title: "Photography basics course",
    startDate: new Date("2024-01-05"),
    endDate: new Date("2024-01-12"),
    numTasks: 5,
    dailyTasks: [],
  },
  {
    id: 104,
    goalId: 1,
    title: "Weekend hiking trip",
    startDate: new Date("2024-02-08"),
    endDate: new Date("2024-02-14"),
    numTasks: 5,
    dailyTasks: [],
  },
  {
    id: 105,
    goalId: 1,
    title: "Watercolor painting workshop",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-02-21"),
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
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-07"),
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
    startDate: new Date("2024-03-08"),
    endDate: new Date("2024-03-14"),
    numTasks: 4,
    dailyTasks: [],
  },
  {
    id: 108,
    goalId: 2,
    title: "International cuisine week",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-21"),
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
  const [selectedGoalColors, setSelectedGoalColors] = useState<string[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const today = new Date("2024-02-15");

  useEffect(() => {
    // use dummy data
    setGoals(DUMMY_GOALS);

    // TODO ~ not ideal, but manually update WEEKLY DATA to add colors and parent title
    // DUMMY_WEEKLY.forEach((goal) => {
    //   const parent = DUMMY_GOALS.find((parent) => parent.id === goal.goalId);
    // });

    setWeeklyGoals(getActiveWeeklyGoals(new Date(today)));
  }, []);

  // TODO might need to move this elsewhere

  useEffect(() => {
    // TODO ~ not ideal, but manually update WEEKLY DATA to add colors and parent title
    // DUMMY_WEEKLY.forEach((goal) => {
    //   const parent = goals.find((parent) => parent.id === goal.goalId);
    //   if (parent) {
    //     goal.parent = parent?.title;
    //     goal.color = parent?.color;
    //     goal.category = parent.category;
    //   }
    // });

    goals.forEach((goal) => {
      goal.progress = calculateGoalProgress(
        goal,
        DUMMY_WEEKLY.filter((wkGoal) => wkGoal.goalId === goal.id)
      );

      // set the already selected goal colors to prevent users freom having duplicate colors
      setSelectedGoalColors((prev) => [...prev, goal.color]);
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
    };
    // add to the DUMMY stack
    DUMMY_GOALS.push(goal);
    // save to db
    // update state
    setGoals(DUMMY_GOALS);
  };

  const updateGoal = (id: number, formData: GoalForm) => {
    // TODO ~ will need to update the DB as well, this might be redundant soon
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
    console.log("deleting goal...");
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));

    //TODO ~ will need to delete weekly goals as well.
  };

  //TODO ~ if past goals marked as "complete" then just count it as numTasks
  const calculateGoalProgress = (goal: Goal, weeklyGoals: WeeklyGoal[]) => {
    // first need to get the count of weekly goals
    const start = new Date(goal.created);
    const end = new Date(goal.dueDate);

    const numWeeks = Math.floor(
      (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    // get the current number of completed goals
    let completedTasks = 0,
      expectedTasks = 0;
    for (let i = 0; i < numWeeks; i++) {
      if (weeklyGoals[i]) {
        expectedTasks += weeklyGoals[i].numTasks;
        completedTasks += weeklyGoals[i].dailyTasks.length;
      } else {
        expectedTasks += goal.numTasks;
      }
    }

    // get percentage
    const percent = Number(((completedTasks / expectedTasks) * 100).toFixed(0));
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

    return weeklyGoal ? weeklyGoal : null;
  };

  //* Note to self, getting parent goal using db query seems excessive

  const value = {
    goals,
    today,
    weeklyGoals,
    selectedGoalColors,
    createGoal,
    updateGoal,
    deleteGoal,
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
