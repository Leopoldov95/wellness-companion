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

type GoalAction = "Delete" | "Pause" | "Archive";

const GoalsContext = createContext<GoalsContextType>({
  goals: [],
  weeklyGoals: [],
  createGoal: (formData: GoalForm) => {},
  updateGoal: (id: number, formData: GoalForm) => {},
  pauseGoal: (id: number) => {},
  archiveGoal: (id: number) => {},
  getWeeklyGoalsById: (id: number): WeeklyGoal[] => [],
  getUpcommingWeeklyGoal: (): WeeklyGoal | null => null,
  completeWeeklyTask: (id: number, date: string) => {},
});

const DUMMY_GOALS: Goal[] = [
  {
    user_id: 0,
    id: 0,
    category: "cooking", // Must match one of the `Category` values
    title: "I Like cooking",
    progress: 34,
    dueDate: new Date(),
    color: "red",
    is_archived: false,
    is_paused: false,
  },
  {
    user_id: 0,
    id: 1,
    category: "hobbies", // Must match one of the `Category` values
    title: "Some Hobby With an extra ong name test more even more",
    progress: 67,
    dueDate: new Date(),
    color: "blue",
    is_archived: false,
    is_paused: false,
  },
  {
    user_id: 0,
    id: 2,
    category: "cooking", // Must match one of the `Category` values
    title: "I Like cooking",
    progress: 34,
    dueDate: new Date(),
    color: "green",
    is_archived: false,
    is_paused: false,
  },
];

const DUMMY_WEEKLY: WeeklyGoal[] = [
  // Parent Goal 0 (Cooking)
  {
    id: 100,
    goal_id: 0,
    num_tasks: 3,
    title: "Learn basic knife skills",
    category: "cooking",
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    status: "completed",
    dailyTasks: [],
  },
  {
    id: 101,
    goal_id: 0,
    num_tasks: 3,
    title: "Master 5 foundational recipes",
    category: "cooking",
    startDate: "2024-01-08",
    endDate: "2024-01-14",
    status: "active",
    dailyTasks: [
      {
        date: "2024-01-09",
        completed: true,
      },
      {
        date: "2024-01-11",
        completed: true,
      },
    ],
  },
  {
    id: 102,
    goal_id: 0,
    num_tasks: 3,
    title: "Host a dinner party",
    category: "cooking",
    startDate: "2024-01-15",
    endDate: "2024-01-21",
    status: "upcoming",
    dailyTasks: [],
  },

  // Parent Goal 1 (Hobbies)
  {
    id: 103,
    goal_id: 1,
    num_tasks: 5,
    title: "Photography basics course",
    category: "hobbies",
    startDate: "2024-02-01",
    endDate: "2024-02-07",
    status: "completed",
    dailyTasks: [],
  },
  {
    id: 104,
    goal_id: 1,
    num_tasks: 5,
    title: "Weekend hiking trip",
    category: "hobbies",
    startDate: "2024-02-08",
    endDate: "2024-02-14",
    status: "completed",
    dailyTasks: [],
  },
  {
    id: 105,
    goal_id: 1,
    num_tasks: 5,
    title: "Watercolor painting workshop",
    category: "hobbies",
    startDate: "2024-02-15",
    endDate: "2024-02-21",
    status: "active",
    dailyTasks: [
      {
        date: "2024-02-15",
        completed: true,
      },
      {
        date: "2024-02-16",
        completed: true,
      },
      {
        date: "2024-02-18",
        completed: true,
      },
      {
        date: "2024-02-20",
        completed: true,
      },
    ],
  },

  // Parent Goal 2 (Cooking)
  {
    id: 106,
    goal_id: 2,
    num_tasks: 4,
    title: "Meal prep mastery",
    category: "cooking",
    startDate: "2024-03-01",
    endDate: "2024-03-07",
    status: "active",
    dailyTasks: [
      {
        date: "2024-03-01",
        completed: true,
      },
      {
        date: "2024-03-03",
        completed: true,
      },
      {
        date: "2024-03-05",
        completed: true,
      },
      {
        date: "2024-03-06",
        completed: true,
      },
    ],
  },
  {
    id: 107,
    goal_id: 2,
    num_tasks: 4,
    title: "Advanced baking techniques",
    category: "cooking",
    startDate: "2024-03-08",
    endDate: "2024-03-14",
    status: "upcoming",
    dailyTasks: [],
  },
  {
    id: 108,
    goal_id: 2,
    num_tasks: 4,
    title: "International cuisine week",
    category: "cooking",
    startDate: "2024-03-15",
    endDate: "2024-03-21",
    status: "upcoming",
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

  useEffect(() => {
    // use dummy data
    setGoals(DUMMY_GOALS);

    // TODO ~ not ideal, but manually update WEEKLY DATA to add colors and parent title
    DUMMY_WEEKLY.forEach((goal) => {
      const parent = DUMMY_GOALS.find((parent) => parent.id === goal.goal_id);
    });

    setWeeklyGoals(getActiveWeeklyGoals);
  }, []);

  useEffect(() => {
    // TODO ~ not ideal, but manually update WEEKLY DATA to add colors and parent title
    DUMMY_WEEKLY.forEach((goal) => {
      const parent = goals.find((parent) => parent.id === goal.goal_id);
      if (parent) {
        goal.parent = parent?.title;
        goal.color = parent?.color;
        goal.category = parent.category;
      }
    });
    setWeeklyGoals(getActiveWeeklyGoals);
  }, [goals]);

  const getActiveWeeklyGoals = () => {
    return DUMMY_WEEKLY.filter((goal) => goal.status === "active");
  };

  const getWeeklyGoalsById = (id: number): WeeklyGoal[] => {
    return DUMMY_WEEKLY.filter((goal) => goal.goal_id === id);
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
      dueDate,
      progress: 0,
      is_archived: false,
      is_paused: false,
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
          ? { ...goal, is_paused: !goal.is_paused } // Update only the necessary fields
          : goal
      )
    );
  };

  const archiveGoal = (id: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, is_archived: !goal.is_archived } // Update only the necessary fields
          : goal
      )
    );
  };

  // for any updates
  //? not sure how DB edits will be?
  const updateGoalDetails = (id: number, form: Goal) => {};

  const updateWeeklyGoal = () => {};

  const completeWeeklyTask = (id: number, date: string) => {
    console.log("task completed");
    console.log(id);

    console.log(date);

    setWeeklyGoals((prevWeeklyGoals) =>
      prevWeeklyGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              dailyTasks: [...goal.dailyTasks, { date: date, completed: true }], // Push the new task to dailyTasks
            }
          : goal
      )
    );
  };

  // Get the first upcomming weekly goal
  const getUpcommingWeeklyGoal = () => {
    const weeklyGoal = weeklyGoals
      .filter((goal) => goal.status === "active" || goal.status === "upcoming") // Ignore completed goals
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ) // Sort by earliest startDate
      .at(0);

    return weeklyGoal ? weeklyGoal : null;
  };

  const value = {
    goals,
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
