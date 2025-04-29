export type NumTasks = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// TODO ~ in the databse might want a JOIN table for duplicate dependat properties (colors, numTasks, etc)
export type Goal = {
  userId: string;
  id: number;
  category: Category;
  title: string;
  dueDate: Date;
  created: Date;
  progress: number; // get's calculated client side
  color: string;
  lastUpdated: Date;
  numTasks: NumTasks;
  status: "active" | "completed" | "expired";
};

import { Database } from "../database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type GoalAPI = {
  id: number;
  user_id: string;
  category: Category;
  title: string;
  due_date: Date;
  created_at: Date;
  num_tasks: NumTasks;
  status: "active" | "completed" | "expired";
  last_updated: Date;
  color: string;
};

export type GoalForm = {
  category: Category;
  title: string;
  dueDate: Date;
  color: string;
  numTasks: NumTasks;
  weeklyTask?: string;
};

export type WeeklyGoal = {
  id: number;
  goalId: number;
  title: string;
  startDate: Date;
  endDate: Date;
  numTasks: NumTasks; //! same here, get's calue from parent goal
  dailyTasks: DailyTask[]; //! Not to be in DB, gets build client side
  color: string;
  category: string;
  parentTitle: string;
};

export type WeeklyGoalAPI = {
  id: number;
  goal_id: number;
  title: string;
  start_date: Date;
  end_date: Date;
  daily_tasks: {
    id: number;
    date: string;
    completed: boolean;
    weekly_goal_id: number;
  }[];
  goals: {
    num_tasks: number;
    color: string;
    category: Category;
    title: string;
  };
};

export type DailyTask = {
  id: number;
  weeklyGoalId: number;
  date: Date;
  completed: boolean;
};

export type ValidDateType = {
  startDate: Date;
  endDate: Date;
};

export type Category =
  | "cooking"
  | "creative arts"
  | "event planning"
  | "gardening"
  | "hiking"
  | "journaling"
  | "mindfulness"
  | "self-care"
  | "outdoor"
  | "planning"
  | "hobbies"
  | "reading"
  | "social"
  | "sports"
  | "volunteer"
  | "fitness"
  | "health"
  | "learning"
  | "travel"
  | "career/work"
  | "finance"
  | "family"
  | "pets"
  | "technology";

type CategoryItem = {
  label: string;
  value: Category;
};

export const categoryData: CategoryItem[] = [
  { label: "Cooking", value: "cooking" },
  { label: "Creative Arts", value: "creative arts" },
  { label: "Event Planning", value: "event planning" },
  { label: "Gardening", value: "gardening" },
  { label: "Hiking", value: "hiking" },
  { label: "Journaling", value: "journaling" },
  { label: "Mindfulness", value: "mindfulness" },
  { label: "Self-Care", value: "self-care" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Planning", value: "planning" },
  { label: "Hobbies", value: "hobbies" },
  { label: "Reading", value: "reading" },
  { label: "Social", value: "social" },
  { label: "Sports", value: "sports" },
  { label: "Volunteer", value: "volunteer" },
  { label: "Fitness", value: "fitness" },
  { label: "Health", value: "health" },
  { label: "Learning", value: "learning" },
  { label: "Travel", value: "travel" },
  { label: "Career/Work", value: "career/work" },
  { label: "Finance", value: "finance" },
  { label: "Family", value: "family" },
  { label: "Pets", value: "pets" },
  { label: "Technology", value: "technology" },
];

export type GoalsContextType = {
  goals: Goal[];
  today: Date;
  weeklyGoals: WeeklyGoal[];
  selectedGoalColors: string[];
  createGoal: (formDate: GoalForm) => void;
  updateGoal: (id: number, formData: GoalForm) => void;
  deleteGoal: (id: number) => void;
  getWeeklyGoalsById: (id: number) => WeeklyGoal[];
  getUpcommingWeeklyGoal: () => WeeklyGoal[];
  completeWeeklyTask: (id: number, date: Date) => void;
};
