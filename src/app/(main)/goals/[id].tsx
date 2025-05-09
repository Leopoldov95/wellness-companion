import {
  useCompleteDailyTask,
  useDeleteGoal,
  useGoalsList,
  useGoalWeeklyTasks,
  useUpdateGoalDetails,
  useUpdateWeeklyGoalTitle,
} from "@/src/api/goals";
import EditGoalForm from "@/src/components/goal/EditGoalForm";
import GoalProgressBar from "@/src/components/goal/GoalProgressBar";
import WeeklyCardList from "@/src/components/goal/WeeklyCardList";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { useGoals } from "@/src/providers/GoalsProvider";
import { globalStyles } from "@/src/styles/globals";
import { Goal, GoalForm, WeeklyGoal, ValidDateType } from "@/src/types/goals";
import { dateToReadible } from "@/src/utils/dateUtils";
import { calculateGoalProgress } from "@/src/utils/goalsUtils";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const GoalEditScreen = () => {
  const { profile } = useAuth();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);
  const queryClient = useQueryClient();

  const { today } = useGoals();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weekly, setWeekly] = useState<WeeklyGoal[]>([]);
  const [selectedGoalColors, setSelectedGoalColors] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [validDates, setValidDates] = useState<ValidDateType>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const {
    data: fetchedGoals,
    isLoading: isGoalsLoading,
    error: goalsError,
  } = useGoalsList(profile.id);

  const {
    data: fetchedWeeklyGoals,
    error: weeklyTaskError,
    isLoading: isWeeklyLoading,
  } = useGoalWeeklyTasks(id);
  const { mutate: updateGoal } = useUpdateGoalDetails();
  const { mutate: deleteGoal } = useDeleteGoal();
  const { mutate: updateWeeklyGoal } = useUpdateWeeklyGoalTitle();
  const { mutate: completeDailyTask } = useCompleteDailyTask();

  const router = useRouter();

  if (isWeeklyLoading || isGoalsLoading) {
    return <ActivityIndicator />;
  }

  if (weeklyTaskError || goalsError || !fetchedGoals) {
    return <Text>Error...</Text>;
  }

  useEffect(() => {
    console.log("UPDATE MADE!!!!");

    if (
      !fetchedGoals.length ||
      !fetchedWeeklyGoals ||
      isGoalsLoading ||
      isWeeklyLoading
    )
      return;

    const currentGoal = fetchedGoals.find((g) => g.id === id);

    if (!currentGoal) {
      console.log("goal not found");
      return;
    }

    setGoal(currentGoal);
    setWeekly(fetchedWeeklyGoals);
    // 1. find the current weekly goal
    const curentWeekly = fetchedWeeklyGoals[0];

    //! For now, if no current weekly goal then kick user back to goal page
    if (!curentWeekly) {
      console.log("there is no current weekly...");

      return;
    }

    // 2. use that to set valid start date for goal edit (must be at last day OF current weekly)
    const validStartDate = new Date(curentWeekly.endDate);

    // 3. end date MUST be within 6 months of original creation date
    let createdDate = new Date(currentGoal.created);

    // Clone the date and add 6 months
    let validEndDate = new Date(createdDate);
    validEndDate.setMonth(validEndDate.getMonth() + 6);

    setValidDates({
      startDate: validStartDate,
      endDate: validEndDate,
    });

    fetchedGoals.forEach((goal) => {
      if (goal.status === "active") {
        setSelectedGoalColors((prev) => [...prev, goal.color]);
      }
    });
  }, [fetchedGoals, fetchedWeeklyGoals, isGoalsLoading, isWeeklyLoading, id]);

  //TODO ~ add API here
  const handleUpdate = (updatedForm: GoalForm) => {
    if (goal) {
      updateGoal(
        {
          id: goal.id,
          updates: updatedForm,
        },
        {
          onSuccess: () => {
            router.back(); // Navigate back after update
          },
          onError: (error) => {
            console.log("something wrong");
            console.log(error);
          },
        }
      );
    }
  };

  //TODO ~ add delete here
  const onDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this goal?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          deleteGoal(
            {
              userId: profile.id,
              goalId: id,
            },
            {
              onSuccess: async () => {
                await queryClient.invalidateQueries({
                  queryKey: ["weekly_goals_active"],
                }); // force refetch!
                router.back();
              },
              onError: (error) => {
                console.log("something wrong");
                console.log(error);
              },
            }
          );
        },
      },
    ]);
  };

  const updateWeeklyTask = (weeklyGoalId: number, newTitle: string) => {
    updateWeeklyGoal(
      {
        weeklyGoalId,
        newTitle,
      },
      {
        onError: (error) => {
          console.log("ERROR");
          console.log(error);
        },
      }
    );
  };

  const completeWeeklyTask = (weeklyGoalId: number, date: Date) => {
    completeDailyTask(
      {
        weeklyGoalId,
        date,
      },
      {
        onError: (error) => {
          console.log("ERROR");
          console.log(error);
        },
      }
    );
  };

  if (goal) {
    console.log("calculating goal...");
    console.log(goal);

    console.log(calculateGoalProgress(goal, fetchedWeeklyGoals));
  }

  if (goal) {
    const { title, category, dueDate, progress, color, numTasks } = goal;

    return (
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather
            name="chevron-left"
            size={32}
            color={Colors.light.textDark}
          />
        </Pressable>

        {!isEdit && (
          <Pressable style={styles.editBtn} onPress={() => setIsEdit(true)}>
            <Feather name="edit" size={30} color={Colors.light.textDark} />
          </Pressable>
        )}

        <Text
          style={[globalStyles.subheader, { marginBottom: 5, marginTop: 10 }]}
        >
          Manage Goal
        </Text>

        {isEdit ? (
          <EditGoalForm
            selectedGoalColors={selectedGoalColors}
            initialData={goal}
            onSubmit={handleUpdate}
            onCancel={() => setIsEdit(false)}
            onDelete={onDelete}
            weeklyGoals={weekly}
            validDates={validDates}
          />
        ) : (
          <Fragment>
            <View style={styles.goalDetails}>
              <View style={styles.detailRow}>
                <Text style={globalStyles.labelText}>Goal Name:</Text>
                <Text style={globalStyles.bodySm}>{title}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={globalStyles.labelText}>Goal Category:</Text>
                <Text style={globalStyles.bodySm}>{category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={globalStyles.labelText}>End Date:</Text>
                <Text style={globalStyles.bodySm}>
                  {dateToReadible(dueDate)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={globalStyles.labelText}>Daily Tasks:</Text>
                <Text style={globalStyles.bodySm}>{numTasks}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={globalStyles.labelText}>Color:</Text>
                <View
                  style={[styles.colorButton, { backgroundColor: color }]}
                ></View>
              </View>
            </View>
            <View style={styles.progress}>
              <Text style={[globalStyles.subheader, { marginBottom: 10 }]}>
                Goal Progress:
              </Text>
              <GoalProgressBar progress={progress} color={color} />
            </View>

            <Text style={[globalStyles.subheader, { marginBottom: 10 }]}>
              Weekly Goals
            </Text>
            <View style={isEdit ? { maxHeight: "30%" } : { maxHeight: "40%" }}>
              <WeeklyCardList
                // goals={[goal]}
                updateWeeklyTask={updateWeeklyTask}
                currentDate={today}
                completeWeeklyTask={completeWeeklyTask}
                weeklyGoals={weekly} // we want to show the newest one first
              />
            </View>
          </Fragment>
        )}

        {/* Show the weekly goals, with the ability to manage those */}
        {/*!! Regarding above point, managing weekly goals can be done by clicking on individual weekly goals as well */}
        {/* By default, weekly goals wil repeat */}
      </View>
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
  backBtn: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
  },
  editBtn: {
    position: "absolute",
    top: 20,
    right: 16,
    zIndex: 10,
  },
  detailRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  goalDetails: {
    marginTop: 10,
  },
  colorButton: {
    width: 24,
    height: 24,
    backgroundColor: "red",
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 6,
    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius
    // Android Shadow
    elevation: 3,
  },
  progress: {
    marginTop: 20,
    marginBottom: 16,
  },
});
