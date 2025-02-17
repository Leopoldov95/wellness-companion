import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGoals } from "@/src/providers/GoalsProvider";
import { globalStyles } from "@/src/styles/globals";
import { Goal, GoalForm, WeeklyGoal } from "@/src/types/goals";
import Colors from "@/src/constants/Colors";
import GoalFormInput from "@/src/components/goal/GoalForm";
import { Button } from "react-native-paper";
import EditGoalForm from "@/src/components/goal/EditGoalForm";

const GoalEditScreen = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weekly, setWeekly] = useState<WeeklyGoal[]>([]);
  const { goals, updateGoal, archiveGoal, pauseGoal, getWeeklyGoalsById } =
    useGoals();
  const { id } = useLocalSearchParams();

  const router = useRouter();

  useEffect(() => {
    const currentGoal = goals.find((g) => g.id.toString() === id);

    if (currentGoal) {
      setGoal(currentGoal);
      setWeekly(getWeeklyGoalsById(currentGoal.id));
    } else {
      console.warn("goal not found");
    }
  }, []);

  const handleUpdate = (updatedForm: GoalForm) => {
    if (goal) {
      updateGoal(goal.id, updatedForm);
      router.back(); // Navigate back after update
    }
  };

  const handlePause = () => {
    if (goal) {
      pauseGoal(goal.id);
      router.back();
    }
  };

  const handleArchive = () => {
    if (goal) {
      archiveGoal(goal.id);
      router.back();
    }
  };

  /**
   * What do we want here?
   * Title [E]
   * Show current progress
   * End Date [E]
   * Color [E]
   * Category [E]
   * Delete, Pause, Archive
   * Created Date
   * ? do we want staisics here??
   */
  if (goal) {
    const { title, category, dueDate, progress, color } = goal;
    return (
      <ScrollView nestedScrollEnabled={true} style={styles.container}>
        {/* Display info, much like the goal creation form */}
        {/* <Text style={globalStyles.title}>Your Goal</Text> */}

        <EditGoalForm
          initialData={goal}
          onSubmit={handleUpdate}
          onCancel={() => router.back()}
          onPause={handlePause}
          onArchive={handleArchive}
          weeklyGoals={weekly}
        />

        {/* Show the weekly goals, with the ability to manage those */}
        {/*!! Regarding above point, managing weekly goals can be done by clicking on individual weekly goals as well */}
        {/* By default, weekly goals wil repeat */}
      </ScrollView>
    );
  }
};

export default GoalEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.greyBg,
  },
});
