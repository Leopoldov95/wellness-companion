/** GOALS **/
//! Make sure to refer to user_id for invalidation else it won't work
import { Database } from "@/src/database.types";
import { supabase } from "@/src/lib/supabase";
import {
  Category,
  Goal,
  NumTasks,
  Tables,
  WeeklyGoal,
} from "@/src/types/goals";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type GoalUpdateInput = {
  id: number;
  updates: Partial<{
    title: string;
    color: string;
    numTasks: number;
    category: string;
    dueDate: Date;
    status: "active" | "expired" | "completed";
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
  progress: goalAPI.progress,
});

type WeeklyGoalWithRelations = Tables<"weekly_goals"> & {
  goals: Tables<"goals">;
  daily_tasks: Tables<"daily_tasks">[];
};

type InsertGoalWithWeeklyGoalReturn =
  Database["public"]["Functions"]["insert_goal_with_weekly_goal"]["Returns"];

type InsertGoalWithWeeklyGoalArgs =
  Database["public"]["Functions"]["insert_goal_with_weekly_goal"]["Args"];

const transformWeeklyGoalFormat = (
  weeklyGoalAPI: WeeklyGoalWithRelations
): WeeklyGoal => ({
  id: weeklyGoalAPI.id,
  goalId: weeklyGoalAPI.goal_id,
  title: weeklyGoalAPI.title,
  status: weeklyGoalAPI.status,
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

//* Utility method to clear all goal related queries when an update is made as all of these are interconnected

const invalidateGoalQueries = async ({
  queryClient,
  userId,
  goalId,
  clearOld,
}: {
  queryClient: QueryClient;
  userId?: string;
  goalId?: number;
  clearOld?: boolean;
}) => {
  // default queries
  await queryClient.invalidateQueries({ queryKey: ["goals"] });
  await queryClient.invalidateQueries({
    queryKey: ["weekly_goals_active"],
  });
  await queryClient.invalidateQueries({
    queryKey: ["weekly_goals_all"],
  });

  // only want to clear old query cache when necessay
  if (clearOld) {
    await queryClient.invalidateQueries({ queryKey: ["old_goals"] });
  }

  // goal related queries
  if (goalId) {
    await queryClient.invalidateQueries({
      queryKey: ["weekly_goals", goalId],
    });
  }

  // user-goal related queries
  if (userId) {
  }
};

// ✅ GET user active goals
export const useGoalsList = (userId: string) => {
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
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

// POST create a new goal (must check in DB no more than 10 entries)
//TODO this will throw an error is user has >= 10 goals, must update UI to support this
export const useInsertGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any): Promise<InsertGoalWithWeeklyGoalReturn> {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // set to local midnight
      data.dueDate.setHours(0, 0, 0, 0); // set parent goal to midnight as well
      const end = new Date(today);
      end.setDate(today.getDate() + 6); // 7-day span

      const startStr = today.toISOString();
      const endStr = end.toISOString();

      const { data: newGoal, error } = await supabase.rpc(
        "insert_goal_with_weekly_goal",
        {
          p_user_id: data.userId,
          p_title: data.title,
          p_category: data.category,
          p_num_tasks: data.numTasks,
          p_color: data.color,
          p_due_date: data.dueDate.toISOString(),
          p_weekly_task: data.weeklyTask,
          p_start_date: startStr,
          p_end_date: endStr,
        }
      );
      if (error) {
        console.log(error);

        throw new Error(
          "Failed to create goal and weekly goal: " + error.message
        );
      }

      return newGoal;
    },
    async onSuccess(_, data) {
      await invalidateGoalQueries({ queryClient });
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

// PUT update goal details (title, color, num_tasks, etc.)

export const useUpdateGoalDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ id, updates }: GoalUpdateInput) {
      const updatesToDbKeyMap: Record<string, keyof Tables<"goals">> = {
        title: "title",
        color: "color",
        numTasks: "num_tasks",
        category: "category",
        dueDate: "due_date",
        status: "status",
      };
      // Map camelCase fields to DB snake_case
      const dbUpdates: Partial<Tables<"goals">> = {};

      for (const [key, value] of Object.entries(updates) as [string, any]) {
        const dbKey = updatesToDbKeyMap[key];
        if (!dbKey || value === undefined) continue;

        dbUpdates[dbKey] =
          key === "dueDate" && value instanceof Date
            ? value.toISOString()
            : value;
      }

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
      await invalidateGoalQueries({
        queryClient: queryClient,
        goalId: id,
        clearOld: true,
      });
    },
  });
};

// DELETE goal (and DELETE all relation weekly goals)
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
      await invalidateGoalQueries({
        queryClient,
        goalId,
        userId,
      });
    },
  });
};

/** WEEKLY **/

//  GET user current active week goals
export const useActiveWeeklyGoals = (userId: string) => {
  return useQuery<WeeklyGoal[]>({
    queryKey: ["weekly_goals_active"],
    queryFn: async () => {
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from("weekly_goals")
        .select("*, daily_tasks(*), goals(*)")
        .lte("start_date", today) // start_date <= today
        .gte("end_date", today) // end_date >= today
        .eq("goals.user_id", userId)
        .not("goals", "is", null)
        .eq("goals.status", "active"); // make sure to only get active goals

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(transformWeeklyGoalFormat);
    },
    initialData: [],
  });
};

//  GET all week goals for a SPECIFIED goal (never want to just blind fetch all week goals)
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

//  POST Weekly goal daily task
export const useCompleteDailyTask = () => {
  const queryClient = useQueryClient();

  //TODO Need to check or add constraint so that number of daily tasks for a weekly goal does not exceed num_tasks for goal
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
          date: date.toISOString(),
          completed: true,
          weekly_goal_id: weeklyGoalId,
        })
        .select("*, weekly_goals(goal_id)")
        .single();

      // we need to check if parent goal is complete

      if (error) {
        throw new Error("Failed to complete task: " + error.message);
      }

      return completedTask;
    },
    async onSuccess(data) {
      // TODO ~ need to pass in goal Id here as well
      await invalidateGoalQueries({
        queryClient,
        goalId: data.weekly_goals.goal_id,
      });
    },
  });
};

// get's all user's weekly goal, mainly for analytics
export const useAllWeeklyGoals = (userId: string) => {
  return useQuery<WeeklyGoal[]>({
    queryKey: ["weekly_goals_all", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_goals")
        .select("*, daily_tasks(*), goals!inner(*)")
        .eq("goals.user_id", userId)
        .order("start_date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(transformWeeklyGoalFormat);
    },
    initialData: [],
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
      // TODO ~ need to pass in goal Id here as well
      await invalidateGoalQueries({
        queryClient,
      });
    },
  });
};

/*** UTILITIES ***/

export const ensureCurrentWeeklyGoals = async (userId: string) => {
  const today = new Date(); // current timestamp with time
  today.setHours(0, 0, 0, 0); // normalize start of day (midnight)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // 1. Get all active goals for the user
  const { data: activeGoals, error: goalsError } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");

  if (goalsError) {
    console.error("Failed to fetch active goals:", goalsError);
    return;
  }
  if (!activeGoals || activeGoals.length === 0) return;

  // 2. Update expired goals
  const expiredGoals = activeGoals
    .filter((goal) => new Date(goal.due_date).getTime() < today.getTime())
    .map((goal) => goal.id);

  if (expiredGoals.length > 0) {
    const { error } = await supabase
      .from("goals")
      .update({ status: "expired" })
      .in("id", expiredGoals);

    if (error) {
      console.error("Failed to update expired goals:", error);
    }
  }

  // 3. Ensure current weekly goals exist
  for (const goal of activeGoals) {
    const { data: latestWeeklyGoal, error: wgError } = await supabase
      .from("weekly_goals")
      .select("*")
      .eq("goal_id", goal.id)
      .order("end_date", { ascending: false })
      .limit(1)
      .single();

    if (wgError) {
      console.error("Error fetching weekly goal for goal:", goal.id, wgError);
      continue;
    }

    // If no weekly goal yet, or last one ended before yesterday, create a new one
    if (!latestWeeklyGoal || new Date(latestWeeklyGoal.end_date) < yesterday) {
      const lastEnd = latestWeeklyGoal
        ? new Date(latestWeeklyGoal.end_date) //! this is the root cuase, fundamentally this is incorrect and will have a cascading effect
        : new Date(yesterday); //* set's it to yesterday

      const newStart = new Date(lastEnd);
      newStart.setDate(newStart.getDate() + 1);

      const newEnd = new Date(newStart);
      newEnd.setDate(newStart.getDate() + 6);

      //Expire the outdated weekly goal
      await supabase
        .from("weekly_goals")
        .update({ status: "expired" })
        .eq("id", latestWeeklyGoal.id);

      await supabase.from("weekly_goals").insert({
        goal_id: goal.id,
        title: goal.title,
        start_date: newStart.toISOString(),
        end_date: newEnd.toISOString(),
        status: "active",
      });
    }
  }
};
