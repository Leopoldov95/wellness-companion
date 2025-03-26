import EditGoalForm from "@/src/components/goal/EditGoalForm";
import GoalProgressBar from "@/src/components/goal/GoalProgressBar";
import WeeklyCardList from "@/src/components/goal/WeeklyCardList";
import Colors from "@/src/constants/Colors";
import { useGoals } from "@/src/providers/GoalsProvider";
import { globalStyles } from "@/src/styles/globals";
import { Goal, GoalForm, WeeklyGoal, ValidDateType } from "@/src/types/goals";
import { dateToReadible } from "@/src/utils/dateUtils";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const GoalEditScreen = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weekly, setWeekly] = useState<WeeklyGoal[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [validDates, setValidDates] = useState<ValidDateType>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const {
    goals,
    updateGoal,
    deleteGoal,
    getWeeklyGoalsById,
    today,
    selectedGoalColors,
    completeWeeklyTask,
  } = useGoals();
  //const { id } = useLocalSearchParams();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const router = useRouter();

  useEffect(() => {
    const currentGoal = goals.find((g) => g.id === id);

    if (currentGoal) {
      setGoal(currentGoal);
      const weeklyGoals = getWeeklyGoalsById(currentGoal.id);
      setWeekly(weeklyGoals);
      //TODO, set start and end date limitations for goal, can also use weekly
      // 1. find the current weekly goal
      const curentWeekly = weeklyGoals.filter(
        (wkGoal) =>
          wkGoal.endDate.getTime() >= today.getTime() &&
          wkGoal.startDate.getTime() <= today.getTime()
      )[0];
      // 2. use that to set valid start date for goal edit (must be at last day OF current weekly)
      const validStartDate = curentWeekly.endDate;

      // 3. end date MUST be within 6 months of original creation date
      let createdDate = new Date(currentGoal.created);

      // Clone the date and add 6 months
      let validEndDate = new Date(createdDate);

      validEndDate.setMonth(validEndDate.getMonth() + 6);

      setValidDates({
        startDate: validStartDate,
        endDate: validEndDate,
      });

      // 4. update it
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

  const onDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this goal?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteGoal(id);
          router.back(); // Navigate back after update
        },
      },
    ]);
  };

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
                goals={[goal]}
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
