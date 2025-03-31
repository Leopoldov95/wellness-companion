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
  NumTasks,
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
  getUpcommingWeeklyGoal: (): WeeklyGoal[] => [], //? Might want this to be a state
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
    dueDate: new Date(2024, 1, 18), // February 18, 2024
    created: new Date(2024, 0, 1), // January 1, 2024
    lastUpdated: new Date(2024, 1, 13), // February 13, 2024
    color: "#f6d5a7",
    numTasks: 3, // Weekly goal is to complete 7 tasks
    status: "active",
  },
  {
    userId: 0,
    id: 1,
    category: "hobbies", // Must match one of the `Category` values
    title: "Learn Guitar",
    progress: 0,
    dueDate: new Date(2024, 3, 15), // April 15, 2024
    created: new Date(2024, 0, 10), // January 10, 2024
    lastUpdated: new Date(2024, 2, 1), // March 1, 2024
    color: "#80cbc4",
    numTasks: 3, // Goal requires 30 tasks over time
    status: "active",
  },
  {
    userId: 0,
    id: 2,
    category: "fitness", // Changed category for variety
    title: "Run 100 Miles",
    progress: 0,
    dueDate: new Date(2024, 2, 1), // March 1, 2024
    created: new Date(2024, 0, 1), // January 1, 2024
    lastUpdated: new Date(2024, 1, 28), // February 28, 2024
    color: "#A59D84",
    numTasks: 4, // Total goal is 100 tasks (e.g., miles run)
    status: "active",
  },
  {
    userId: 0,
    id: 3,
    category: "hiking", // Changed category for variety
    title: "Hike 2 national parks",
    progress: 0,
    dueDate: new Date(2024, 0, 30), // March 1, 2024
    created: new Date(2024, 0, 1), // January 1, 2024
    lastUpdated: new Date(2024, 0, 29), // February 28, 2024
    color: "#f3c1c6",
    numTasks: 2, // Total goal is 100 tasks (e.g., miles run)
    status: "active",
  },
];

const DUMMY_WEEKLY: WeeklyGoal[] = [
  // Parent Goal 0 (Cooking)
  {
    id: 100,
    goalId: 0,
    title: "Learn basic knife skills",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 7),
    numTasks: 3,
    dailyTasks: [
      {
        id: 21,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 2),
        completed: true,
      },
      {
        id: 22,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 4),
        completed: true,
      },
      {
        id: 23,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 6),
        completed: true,
      },
    ],
  },
  {
    id: 101,
    goalId: 0,
    title: "Master 5 foundational recipes",
    startDate: new Date(2024, 0, 8),
    endDate: new Date(2024, 0, 14),
    numTasks: 3,
    dailyTasks: [
      { id: 1, weeklyGoalId: 101, date: new Date(2024, 0, 9), completed: true },
      {
        id: 2,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 10),
        completed: true,
      },
      {
        id: 3,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 11),
        completed: true,
      },
    ],
  },
  {
    id: 102,
    goalId: 0,
    title: "Host a dinner party",
    startDate: new Date(2024, 0, 15),
    endDate: new Date(2024, 0, 21),
    numTasks: 3,
    dailyTasks: [
      {
        id: 4,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 16),
        completed: true,
      },
      {
        id: 5,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 18),
        completed: true,
      },
      {
        id: 6,
        weeklyGoalId: 101,
        date: new Date(2024, 0, 20),
        completed: true,
      },
    ],
  },
  {
    id: 202,
    goalId: 0,
    title: "Host a dinner party",
    startDate: new Date(2024, 1, 12),
    endDate: new Date(2024, 1, 18),
    numTasks: 3,
    dailyTasks: [
      {
        id: 1,
        weeklyGoalId: 101,
        date: new Date(2024, 1, 13),
        completed: true,
      },
    ],
  },

  // Parent Goal 1 (Hobbies)
  {
    id: 103,
    goalId: 1,
    title: "Photography basics course",
    startDate: new Date(2024, 0, 5),
    endDate: new Date(2024, 0, 12),
    numTasks: 5,
    dailyTasks: [
      {
        id: 24,
        weeklyGoalId: 103,
        date: new Date(2024, 0, 8),
        completed: true,
      },
      {
        id: 25,
        weeklyGoalId: 103,
        date: new Date(2024, 0, 9),
        completed: true,
      },
      {
        id: 26,
        weeklyGoalId: 103,
        date: new Date(2024, 0, 10),
        completed: true,
      },
    ],
  },
  {
    id: 104,
    goalId: 1,
    title: "Weekend hiking trip",
    startDate: new Date(2024, 1, 8),
    endDate: new Date(2024, 1, 14),
    numTasks: 5,
    dailyTasks: [
      {
        id: 14,
        weeklyGoalId: 104,
        date: new Date(2024, 1, 8),
        completed: true,
      },
      {
        id: 15,
        weeklyGoalId: 104,
        date: new Date(2024, 1, 10),
        completed: true,
      },
      {
        id: 16,
        weeklyGoalId: 104,
        date: new Date(2024, 1, 12),
        completed: true,
      },
      {
        id: 17,
        weeklyGoalId: 104,
        date: new Date(2024, 1, 14),
        completed: true,
      },
    ],
  },
  {
    id: 105,
    goalId: 1,
    title: "Watercolor painting workshop",
    startDate: new Date(2024, 1, 15),
    endDate: new Date(2024, 1, 21),
    numTasks: 5,
    dailyTasks: [
      {
        id: 4,
        weeklyGoalId: 105,
        date: new Date(2024, 1, 16),
        completed: true,
      },
      {
        id: 5,
        weeklyGoalId: 105,
        date: new Date(2024, 1, 18),
        completed: true,
      },
      {
        id: 6,
        weeklyGoalId: 105,
        date: new Date(2024, 1, 20),
        completed: true,
      },
    ],
  },

  // Parent Goal 2 (Cooking)
  {
    id: 106,
    goalId: 2,
    title: "Meal prep mastery",
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 2, 7),
    numTasks: 4,
    dailyTasks: [
      { id: 7, weeklyGoalId: 106, date: new Date(2024, 2, 1), completed: true },
      { id: 8, weeklyGoalId: 106, date: new Date(2024, 2, 3), completed: true },
      { id: 9, weeklyGoalId: 106, date: new Date(2024, 2, 5), completed: true },
      {
        id: 10,
        weeklyGoalId: 106,
        date: new Date(2024, 2, 6),
        completed: true,
      },
    ],
  },
  {
    id: 107,
    goalId: 2,
    title: "Advanced baking techniques",
    startDate: new Date(2024, 2, 8),
    endDate: new Date(2024, 2, 14),
    numTasks: 4,
    dailyTasks: [],
  },
  {
    id: 108,
    goalId: 2,
    title: "International cuisine week",
    startDate: new Date(2024, 2, 15),
    endDate: new Date(2024, 2, 21),
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
  const [finishedGoals, setFinisheGoals] = useState<Goal[]>([]);
  const today = new Date(2024, 1, 15);

  useEffect(() => {
    // use dummy data

    // check for valid goals, once we read from DB we'll want to handle this before setting states
    DUMMY_GOALS.forEach((goal) => {
      if (goal.dueDate.getTime() <= today.getTime()) {
        goal.status = "expired";
        setFinisheGoals((prev) => [...prev, goal]);
      }
    });

    // set goals using only active ones
    setGoals(DUMMY_GOALS.filter((goals) => goals.status === "active"));

    // TODO ~ not ideal, but manually update WEEKLY DATA to add colors and parent title
    // DUMMY_WEEKLY.forEach((goal) => {
    //   const parent = DUMMY_GOALS.find((parent) => parent.id === goal.goalId);
    // });

    // setWeeklyGoals(getActiveWeeklyGoals(new Date(today)));
  }, []);

  // TODO ~ Daily goal check
  const checkGoals = () => {};

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

    if (goals.length > 0) {
      goals.forEach((goal) => {
        goal.progress = calculateGoalProgress(
          goal,
          DUMMY_WEEKLY.filter((wkGoal) => wkGoal.goalId === goal.id)
        );

        // set the already selected goal colors to prevent users freom having duplicate colors
        if (goal.status === "active") {
          setSelectedGoalColors((prev) => [...prev, goal.color]);
        }
      });

      setWeeklyGoals(getActiveWeeklyGoals(today));
    }
  }, [goals]);

  // get first upcomming weekly goal based on date and not yet having completed tasks
  const getActiveWeeklyGoals = (date: Date) => {
    // we need to filter out weekly goals who's parent is NOT active
    return DUMMY_WEEKLY.filter((wkGoal) => {
      const parentGoal = goals.find((goal) => goal.id === wkGoal.goalId);
      return parentGoal?.status === "active";
    }).filter((goal) => isActiveWeeklyGoal(goal, date));
  };

  const getWeeklyGoalsById = (id: number): WeeklyGoal[] => {
    return DUMMY_WEEKLY.filter((goal) => goal.goalId === id);
  };

  const createGoal = (formData: GoalForm) => {
    const { category, color, title, dueDate, numTasks, weeklyTask } = formData;
    // create a new goal
    const goal: Goal = {
      userId: 0,
      id: 12, //TODO will need to get value from DB
      category,
      color,
      title,
      dueDate,
      created: today,
      lastUpdated: today,
      progress: 0,
      numTasks: numTasks,
      status: "active",
    };
    // add to the DUMMY stack
    DUMMY_GOALS.push(goal);
    // save to db
    // update state
    setGoals(DUMMY_GOALS);

    //* create new record in weeklyDB
    createWeeklyGoal(goal.id, numTasks, weeklyTask);
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

    //* Using Math ceil to account for partial weeks
    const numWeeks = Math.ceil(
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
  const createWeeklyGoal = (
    parentId: number,
    numTasks?: number | null,
    taskName?: string | null
  ) => {
    try {
      const newWeeklyTask: WeeklyGoal = {
        id: DUMMY_WEEKLY.length + 1,
        goalId: parentId,
        startDate: today,
        endDate: new Date(new Date(today).setDate(today.getDate() + 6)),
        dailyTasks: [],
        title: "",
        numTasks: 1,
      };
      // Add record to DB
      if (taskName && numTasks) {
        newWeeklyTask.title = taskName;
        newWeeklyTask.numTasks = numTasks as NumTasks;
      } else {
        // existing weekly task, just adding new row
        const prevWeeklyTask = DUMMY_WEEKLY.filter(
          (wkGoal) => wkGoal.goalId === parentId
        ).at(-1);
        newWeeklyTask.title = prevWeeklyTask!.title;
        newWeeklyTask.numTasks = prevWeeklyTask!.numTasks;
      }

      DUMMY_WEEKLY.push(newWeeklyTask);

      // update state

      setWeeklyGoals(getActiveWeeklyGoals(today));
    } catch (error) {}
  };

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
     * update lastUpdate
     * SINCE daily task is completed for that day, cycle to NEXT upcomming task
     * ! only for the home page though, otherwise do nothing, but on the Goal page button should be disabled
     */

    const wkGoal = weeklyGoals.filter((goal) => goal.id === weeklyGoalId)[0];

    const goal = goals.filter((goal) => goal.id === wkGoal.goalId)[0];

    if (
      wkGoal.dailyTasks.length === goal.numTasks &&
      wkGoal.endDate.getTime() >= goal.dueDate.getTime()
    ) {
      // TODO ~ goal is completed, we'll need to update it's DB
      setGoals((prevGoals) =>
        prevGoals.map((g) =>
          g.id === goal.id ? { ...g, status: "completed" } : g
        )
      );
    }
  };

  // Get the upcomming weekly goal
  const getUpcommingWeeklyGoal = (): WeeklyGoal[] => {
    const weeklyGoal = weeklyGoals
      .filter((goal) => {
        return (
          isActiveWeeklyGoal(goal, today, true) &&
          (goal.dailyTasks.length === 0 ||
            goal.dailyTasks.every(
              (task) => formatDate(task.date) !== formatDate(today)
            ))
        );
      }) // Ignore completed goals
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    // Sort by earliest startDate

    // console.log(weeklyGoal.length);

    return weeklyGoal ? weeklyGoal : [];
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
