import { WeeklyGoal } from "@/src/types/goals";
import { formatDate } from "@/src/utils/dateUtils";

export const isActiveWeeklyGoal = (
  goal: WeeklyGoal,
  date: Date,
  checkTaskLimit: boolean = false
): boolean => {
  const isWithinDateRange =
    goal.endDate.getTime() >= date.getTime() &&
    goal.startDate.getTime() <= date.getTime();

  if (!isWithinDateRange) return false;

  return checkTaskLimit ? goal.numTasks > goal.dailyTasks.length : true;
};
