/** GOALS **/
//! Make sure to refer to user_id for invalidation else it won't work
import { supabase } from "@/src/lib/supabase";
import {
  Category,
  Goal,
  GoalAPI,
  NumTasks,
  Tables,
  WeeklyGoal,
  WeeklyGoalAPI,
} from "@/src/types/goals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type GoalUpdateInput = {
  id: number;
  updates: Partial<{
    title: string;
    color: string;
    numTasks: number;
    category: string;
    dueDate: Date;
  }>;
};

const transformGoalFormat = (goalAPI: Tables<"goals">): Goal => ({
  id: goalAPI.id,
  userId: goalAPI.user_id,
  category: goalAPI.category as Category,
  title: goalAPI.title,
  color: goalAPI.color,
  created: new Date(goalAPI.created_at),
  dueDate: new Date(goalAPI.due_date),
  lastUpdated: new Date(goalAPI.last_updated),
  status: goalAPI.status,
  numTasks: goalAPI.num_tasks as NumTasks,
  progress: 0,
});

type WeeklyGoalWithRelations = Tables<"weekly_goals"> & {
  goals: Tables<"goals">;
  daily_tasks: Tables<"daily_tasks">[];
};

const transformWeeklyGoalFormat = (
  weeklyGoalAPI: WeeklyGoalWithRelations
): WeeklyGoal => ({
  id: weeklyGoalAPI.id,
  goalId: weeklyGoalAPI.goal_id,
  title: weeklyGoalAPI.title,
  startDate: new Date(weeklyGoalAPI.start_date),
  endDate: new Date(weeklyGoalAPI.end_date),
  numTasks: weeklyGoalAPI.goals.num_tasks as NumTasks,
  color: weeklyGoalAPI.goals.color,
  parentTitle: weeklyGoalAPI.goals.title,
  category: weeklyGoalAPI.goals.category,
  dailyTasks: (weeklyGoalAPI.daily_tasks ?? []).map((task) => ({
    id: task.id,
    weeklyGoalId: task.weekly_goal_id,
    completed: task.completed,
    date: new Date(task.date),
  })),
});

// ✅ GET user active goals
export const useGoalsList = (userId: string) => {
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      //await ensureCurrentWeeklyGoals(id);

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active");

      if (error) {
        throw new Error(error.message);
      }

      //return data;
      return (data ?? []).map(transformGoalFormat);
    },
    initialData: [],
  });
};

// ✅ POST create a new goal (must check in DB no more than 10 entries)
//! this will throw an error is user has >= 10 goals, must update UI to support this
export const useInsertGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      console.log("creating goal...");
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 6); // 7-day span

      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      const { data: newGoal, error } = await supabase.rpc(
        "insert_goal_with_weekly_goal",
        {
          p_user_id: data.userId,
          p_title: data.title,
          p_category: data.category,
          p_num_tasks: data.numTasks,
          p_color: data.color,
          p_due_date: data.dueDate,
          p_weekly_task: data.weeklyTask,
          p_start_date: startStr,
          p_end_date: endStr,
        }
      );
      if (error) {
        throw new Error(
          "Failed to create goal and weekly goal: " + error.message
        );
      }

      return newGoal;
    },
    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      // await queryClient.invalidateQueries({
      //   queryKey: ["goals", data.user_id],
      // });
      await queryClient.invalidateQueries({
        queryKey: ["weekly_goals_active"],
      });
    },
  });
};

// GET inactive (expired or completed) goals (for history page)
export const usePastGoals = (userId: string) => {
  return useQuery<Goal[]>({
    queryKey: ["old_goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .neq("status", "active");

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(transformGoalFormat);
    },
    initialData: [],
  });
};

/** BOTH **/

// ✅ PUT update goal details (title, color, num_tasks, etc.)

export const useUpdateGoalDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ id, updates }: GoalUpdateInput) {
      // Map camelCase fields to DB snake_case
      const dbUpdates: Record<string, any> = {};

      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.numTasks !== undefined)
        dbUpdates.num_tasks = updates.numTasks;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

      const { data: updatedGoal, error } = await supabase
        .from("goals")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return updatedGoal;
    },

    // TODO ~ so need to update weekly goals as the num_tasks may change...
    async onSuccess(updatedGoal, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      // await queryClient.invalidateQueries({ queryKey: ["goals", id] });
      await queryClient.invalidateQueries({
        queryKey: ["weekly_goals_active"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["weekly_goals", id],
      });
    },
  });
};

// ➡️ DELETE goal (and DELETE all relation weekly goals)
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ userId, goalId }: { userId: string; goalId: number }) {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess(_, { userId, goalId }) {
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      // await queryClient.invalidateQueries({ queryKey: ["goals", goalId] });
      await queryClient.invalidateQueries({
        queryKey: ["weekly_goals_active"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["weekly_goals", goalId],
      });
    },
  });
};

// PUT goal completion (expired or completed) and then DELETE weekly goals (they'll no longer be needed)
// PUT mark goal completed or expired, then delete its weekly goals
export const useCompleteOrExpireGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      status,
    }: {
      id: number;
      status: "completed" | "expired"; // Assuming these are valid enum values
    }) {
      // 1. Update goal status
      const { data, error } = await supabase
        .from("goals")
        .update({ status })
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);

      // 2. Delete related weekly goals
      //! Let's keep these for now
      // const { error: deleteError } = await supabase
      //   .from("weekly_goals")
      //   .delete()
      //   .eq("goal_id", id); // assumes goal_id is FK in weekly_goals

      // if (deleteError) throw new Error(deleteError.message);

      return data;
    },

    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      await queryClient.invalidateQueries({ queryKey: ["old_goals"] });
      // await queryClient.invalidateQueries({ queryKey: ["goals", id] });
    },
  });
};

/** WEEKLY **/

// ✅ GET user current active week goals
export const useActiveWeeklyGoals = (userId: string) => {
  console.log(`fetching goals for user id... ${userId}`);

  return useQuery<WeeklyGoal[]>({
    queryKey: ["weekly_goals_active"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

      const { data, error } = await supabase
        .from("weekly_goals")
        .select("*, daily_tasks(*), goals(*)")
        .lte("start_date", today) // start_date <= today
        .gte("end_date", today) // end_date >= today
        .eq("goals.user_id", userId)
        .not("goals", "is", null)
        .eq("goals.status", "active"); // make sure to only get active goals

      // should return an array of ojects represnting the weekly goals.
      // Need to have a way where if end_date is at least 1 day before current date (or if it has past current date) then a new one gets created
      //? If new one gets created becuase user was inactive for some time, how to manage this?

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(transformWeeklyGoalFormat);
    },
    initialData: [],
  });
};

// ✅ GET all week goals for a SPECIFIED goal (never want to just blind fetch all week goals)
// This is for the main goal view page, here we don't care about getting only active goals
export const useGoalWeeklyTasks = (goalId: number) => {
  return useQuery<WeeklyGoal[]>({
    queryKey: ["weekly_goals", goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_goals")
        .select("*, daily_tasks(*), goals(*)")
        .eq("goal_id", goalId)
        .order("start_date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(transformWeeklyGoalFormat);
    },
    initialData: [],
  });
};

// ✅ POST Weekly goal daily task
export const useCompleteDailyTask = () => {
  const queryClient = useQueryClient();

  //! Need to check or add constraint so that number of daily tasks for a weekly goal does not exceed num_tasks for goal
  return useMutation({
    async mutationFn({
      weeklyGoalId,
      date,
    }: {
      weeklyGoalId: number;
      date: Date;
    }) {
      const { data: completedTask, error } = await supabase
        .from("daily_tasks")
        .insert({
          date: date.toString(),
          completed: true,
          weekly_goal_id: weeklyGoalId,
        })
        .select()
        .single();

      if (error) {
        throw new Error("Failed to complete task: " + error.message);
      }

      return completedTask;
    },
    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      await queryClient.invalidateQueries({
        queryKey: ["weekly_goals_active"],
      });
      // await queryClient.invalidateQueries({
      //   queryKey: ["weekly_goals", goalId],
      // });
    },
  });
};

// ✅ PUT update current weekly goal (really it'll just be to mark a daily task as completed as well as title change)
export const useUpdateWeeklyGoalTitle = () => {
  const queryClient = useQueryClient();

  //! Need to check or add constraint so that number of daily tasks for a weekly goal does not exceed num_tasks for goal
  return useMutation({
    async mutationFn({
      weeklyGoalId,
      newTitle,
    }: {
      weeklyGoalId: number;
      newTitle: string;
    }) {
      const { data: updatedWeeklyTask, error } = await supabase
        .from("weekly_goals")
        .update({
          title: newTitle,
        })
        .eq("id", weeklyGoalId)
        .select()
        .single();

      if (error) {
        throw new Error("Failed to complete task: " + error.message);
      }

      return updatedWeeklyTask;
    },
    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      await queryClient.invalidateQueries({
        queryKey: ["weekly_goals_active"],
      });
      // await queryClient.invalidateQueries({
      //   queryKey: ["weekly_goals", goalId],
      // });
    },
  });
};

//? POST create new weekly goal (should always be autoamtic), by default will always use values from previous one

//? PUT updtae weekly goal staus?

/*** UTILITIES ***/

// ensure weekly goals get apprpriately created
export const ensureCurrentWeeklyGoals = async (userId: string) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // 1. Get all active goals for the user
  const { data: activeGoals, error: goalsError } = await supabase
    .from("goals")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active");

  if (goalsError || !activeGoals) return;

  for (const goal of activeGoals) {
    // 2. For each goal, get the latest weekly_goal
    const { data: latestWeeklyGoal, error: wgError } = await supabase
      .from("weekly_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("goal_id", goal.id)
      .order("end_date", { ascending: false })
      .limit(1)
      .single();

    if (wgError || !latestWeeklyGoal) {
      continue;
    }

    // 3. If the last weekly goal ended before yesterday, create a new one
    if (latestWeeklyGoal.end_date < yesterdayStr) {
      const lastEnd = new Date(latestWeeklyGoal.end_date);
      const newStart = new Date(lastEnd);
      newStart.setDate(newStart.getDate() + 1);

      const newEnd = new Date(newStart);
      newEnd.setDate(newStart.getDate() + 6);

      await supabase.from("weekly_goals").insert({
        goal_id: goal.id,
        title: latestWeeklyGoal.title,
        start_date: newStart.toISOString().split("T")[0],
        end_date: newEnd.toISOString().split("T")[0],
      });
    }
  }
};
