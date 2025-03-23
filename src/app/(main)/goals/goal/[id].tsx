import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGoals } from "@/src/providers/GoalsProvider";
import { Goal, GoalForm, WeeklyGoal } from "@/src/types/goals";
import Colors from "@/src/constants/Colors";
import EditGoalForm from "@/src/components/goal/EditGoalForm";
import GoalProgressBar from "@/src/components/goal/GoalProgressBar";
import WeeklyCardList from "@/src/components/goal/WeeklyCardList";
import { globalStyles } from "@/src/styles/globals";
import { dateToReadible } from "@/src/utils/dateUtils";
import BackButton from "@/src/components/BackButton";
import { Feather } from "@expo/vector-icons";

const GoalEditScreen = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weekly, setWeekly] = useState<WeeklyGoal[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const { goals, updateGoal, deleteGoal, getWeeklyGoalsById } = useGoals();
  //const { id } = useLocalSearchParams();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const router = useRouter();

  useEffect(() => {
    const currentGoal = goals.find((g) => g.id === id);

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
    const { title, category, dueDate, progress, color, numTasks } = goal;
    return (
      <ScrollView nestedScrollEnabled={true} style={styles.container}>
        {/* Display info, much like the goal creation form */}
        {/* <Text style={globalStyles.title}>Your Goal</Text> */}
        {/* TODO ~
        Add just view for goal
        Add pencil icon for edit
        use existing goalForm component for edit
        weekly cards with disabled should have opacity
        */}

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
          style={[globalStyles.subheader, { marginBottom: 25, marginTop: 10 }]}
        >
          Manage Goal
        </Text>

        {isEdit ? (
          <EditGoalForm
            initialData={goal}
            onSubmit={handleUpdate}
            onCancel={() => setIsEdit(false)}
            onDelete={onDelete}
            weeklyGoals={weekly}
          />
        ) : (
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
              <Text style={globalStyles.bodySm}>{dateToReadible(dueDate)}</Text>
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
        )}

        <View style={styles.progress}>
          <Text style={[globalStyles.subheader, { marginBottom: 10 }]}>
            Goal Progress:
          </Text>
          <GoalProgressBar progress={progress} color={color} />
        </View>

        <Text style={[globalStyles.subheader, { marginBottom: 10 }]}>
          Weekly Goals
        </Text>
        <View>
          <WeeklyCardList weeklyGoals={weekly} />
        </View>

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
  backBtn: {
    position: "absolute",
    top: 6,
    left: 0,
    zIndex: 10,
  },
  editBtn: {
    position: "absolute",
    top: 6,
    right: 0,
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
