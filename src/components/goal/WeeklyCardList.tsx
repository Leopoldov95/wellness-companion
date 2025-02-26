import { FlatList } from "react-native";
import React from "react";
import WeeklyCard from "./WeeklyCard";
import { WeeklyGoal } from "@/src/types/goals";

const WeeklyCardList: React.FC<{ weeklyGoals: WeeklyGoal[] }> = ({
  weeklyGoals,
}) => {
  return (
    <FlatList
      data={weeklyGoals}
      renderItem={({ item }) => <WeeklyCard weeklyGoal={item} />}
      showsVerticalScrollIndicator={true}
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
