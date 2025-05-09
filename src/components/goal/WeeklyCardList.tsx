import { FlatList } from "react-native";
import React from "react";
import WeeklyCard from "./WeeklyCard";
import { Goal, WeeklyGoal } from "@/src/types/goals";

type WeeklyCardListProps = {
  weeklyGoals: WeeklyGoal[];
  completeWeeklyTask: (id: number, date: Date) => void;
  updateWeeklyTask: (id: number, title: string) => void;
  currentDate: Date;
};

const WeeklyCardList: React.FC<WeeklyCardListProps> = ({
  weeklyGoals,
  // goals,
  completeWeeklyTask,
  updateWeeklyTask,
  currentDate,
}) => {
  return (
    <FlatList
      data={weeklyGoals}
      renderItem={({ item }) => (
        <WeeklyCard
          weeklyGoal={item}
          // parentGoal={goals.filter((goal) => goal.id === item.goalId)[0]}
          currentDate={currentDate}
          completeWeeklyTask={completeWeeklyTask}
          updateWeeklyTask={updateWeeklyTask}
        />
      )}
      showsVerticalScrollIndicator={true}
      keyExtractor={(item) => item.id.toString()}
      nestedScrollEnabled={true}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 8,
      }}
    />
  );
};

export default WeeklyCardList;
