export type Goal = {
  user_id: number;
  id: number;
  category: Category;
  title: string;
  dueDate: string;
  progress: number;
  color: string;
};

export type GoalForm = {
  category: Category;
  title: string;
  dueDate: Date;
  color: string;
};

export type WeeklyGoal = {
  id: number;
  goal_id: number;
  title: string;
  category: Category;
  parent: string; //? Might need to be an ID pointing to parent?
  progress: number;
  startDate: string;
  endDate: string;
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
};
