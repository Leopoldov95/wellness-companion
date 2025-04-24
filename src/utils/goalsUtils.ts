import { WeeklyGoal } from "@/src/types/goals";
import { formatDate } from "@/src/utils/dateUtils";

// get goals for the current week
export const isActiveWeeklyGoal = (
  goal: WeeklyGoal,
  date: Date,
  checkTaskLimit: boolean = false
): boolean => {
  const isWithinDateRange =
    new Date(goal.endDate).getTime() >= new Date(date).getTime() &&
    new Date(goal.startDate).getTime() <= new Date(date).getTime();

  if (!isWithinDateRange) return false;

  return checkTaskLimit ? goal.numTasks > goal.dailyTasks.length : true;
};
