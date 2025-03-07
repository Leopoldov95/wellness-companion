// TODO ~ in the databse might want a JOIN table for duplicate dependat properties (colors, numTasks, etc)
export type Goal = {
  userId: number;
  id: number;
  category: Category;
  title: string;
  dueDate: Date;
  created: Date;
  progress: number;
  color: string;
  isPaused: boolean;
  isArchived: boolean;
  lastUpdated: Date;
  completedTasks: number;
  numTasks: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  children?: WeeklyGoal[]; // useful for managing frontend
};

export type GoalForm = {
  category: Category;
  title: string;
  dueDate: Date;
  color: string;
};

export type WeeklyGoal = {
  id: number;
  goalId: number;
  title: string;
  category: Category;
  parent?: string; // TODO ~ must come from parent DB
  startDate: Date;
  endDate: Date;
  color?: string; // TODO ~ must come from parent DB
  numTasks: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  dailyTasks: WeeklyGoalTask[];
};

export type WeeklyGoalTask = {
  id: number;
  weeklyGoalId: number;
  date: Date;
  completed: boolean;
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
  weeklyGoals: WeeklyGoal[];
  createGoal: (formDate: GoalForm) => void;
  updateGoal: (id: number, formData: GoalForm) => void;
  pauseGoal: (id: number) => void;
  archiveGoal: (id: number) => void;
  getWeeklyGoalsById: (id: number) => WeeklyGoal[];
  getUpcommingWeeklyGoal: (date: Date) => WeeklyGoal | null;
  completeWeeklyTask: (id: number, date: Date) => void;
};
