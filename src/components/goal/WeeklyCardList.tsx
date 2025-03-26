import { FlatList } from "react-native";
import React from "react";
import WeeklyCard from "./WeeklyCard";
import { Goal, WeeklyGoal } from "@/src/types/goals";

type WeeklyCardListProps = {
  weeklyGoals: WeeklyGoal[];
  goals: Goal[]; // needed to get parent details
  completeWeeklyTask: (id: number, date: Date) => void;
  currentDate: Date;
};

const WeeklyCardList: React.FC<WeeklyCardListProps> = ({
  weeklyGoals,
  goals,
  completeWeeklyTask,
  currentDate,
}) => {
  return (
    <FlatList
      data={weeklyGoals}
      renderItem={({ item }) => (
        <WeeklyCard
          weeklyGoal={item}
          parentGoal={goals.filter((goal) => goal.id === item.goalId)[0]}
          currentDate={currentDate}
          completeWeeklyTask={completeWeeklyTask}
        />
      )}
      showsVerticalScrollIndicator={true}
      keyExtractor={(item, index) => index.toString()}
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
