import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGoals } from "@/src/providers/GoalsProvider";
import { globalStyles } from "@/src/styles/globals";
import { Goal } from "@/src/types/goals";

const GoalEditScreen = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const { goals } = useGoals();
  const { id } = useLocalSearchParams();

  const router = useRouter();

  useEffect(() => {
    const currentGoal = goals.find((g) => g.id.toString() === id);

    if (currentGoal) {
      setGoal(currentGoal);
    } else {
      console.warn("goal not found");
    }
  });

  console.log("Selected goal\n");
  console.log(goal);

  /**
   * What do we want here?
   * Title [E]
   * Show current progress
   * End Date [E]
   * Color [E]
   * Category [E]
   * Delete, Pause, Archive
   * Created Date
   * ? do we want staisics here?
   */
  if (goal) {
    const { title, category, dueDate, progress, color } = goal;
    return (
      <View style={styles.container}>
        {/* Display info, much like the goal creation form */}
        <Text style={globalStyles.title}>{title}</Text>

        {/* Show the weekly goals, with the ability to manage those */}
        {/*!! Regarding above point, managing weekly goals can be done by clicking on individual weekly goals as well */}
        {/* By default, weekly goals wil repeat */}
      </View>
    );
  }
};

export default GoalEditScreen;

const styles = StyleSheet.create({});
