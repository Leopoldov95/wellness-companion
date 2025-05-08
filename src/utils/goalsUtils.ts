import { Goal, WeeklyGoal } from "@/src/types/goals";
import { formatDate } from "@/src/utils/dateUtils";

// get goals for the current week
export const isActiveWeeklyGoal = (
  goal: WeeklyGoal,
  date: Date,
  checkTaskLimit: boolean = false
): boolean => {
  const normalizeDate = (d: Date) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd.getTime();
  };

  const isWithinDateRange =
    normalizeDate(goal.endDate) >= normalizeDate(date) &&
    normalizeDate(goal.startDate) <= normalizeDate(date);

  if (!isWithinDateRange) return false;

  return checkTaskLimit ? goal.numTasks > goal.dailyTasks.length : true;
};

export const calculateGoalProgress = (
  goal: Goal,
  weeklyGoals: WeeklyGoal[]
) => {
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
