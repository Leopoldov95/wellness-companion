import NoGoals from "@/assets/images/goals/no_goals.svg";
import Wave from "@/assets/images/goals/wave.svg";
import {
  useActiveWeeklyGoals,
  useCompleteDailyTask,
  useGoalsList,
  useInsertGoal,
  useUpdateWeeklyGoalTitle,
} from "@/src/api/goals";
import CreateGoal from "@/src/components/goal/CreateGoal";
import GoalCard from "@/src/components/goal/GoalCard";
import WeeklyCardList from "@/src/components/goal/WeeklyCardList";
import Toaster from "@/src/components/Snackbar";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { useAuth } from "@/src/providers/AuthProvider";
import { useGoals } from "@/src/providers/GoalsProvider";
import { globalStyles } from "@/src/styles/globals";
import { GoalForm } from "@/src/types/goals";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

/**
 * There could be a qizard that helps users figure out how this system works
 * For each long term goal, there abould be a streak counter
 * ?? Should we have like an achivement for the long term goals achieved?
 * TODO ~ Might want to see a history of completed goals
 */

const GoalsScreen = () => {
  const { profile } = useAuth();
  const { mutate: insertGoal } = useInsertGoal();
  const { mutate: completeDailyTask } = useCompleteDailyTask();
  const { mutate: updateWeeklyGoal } = useUpdateWeeklyGoalTitle();
  const { data: fetchedGoals, isLoading: isGoalsLoading } = useGoalsList(
    profile.id
  );
  const {
    data: fetchedWeeklyGoals,
    isLoading: isWeeklyLoading,
    error: weeklyGoalError,
  } = useActiveWeeklyGoals(profile.id);
  // all weekly goals
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [selectedGoalColors, setSelectedGoalColors] = useState<string[]>([]);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchedGoals.forEach((goal) => {
      if (goal.status === "active") {
        setSelectedGoalColors((prev) => [...prev, goal.color]);
      }
    });
  }, [fetchedGoals]);

  const showToast = (message: string, type: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const { today } = useGoals();

  const createGoal = (formData: GoalForm) => {
    insertGoal(
      {
        userId: profile.id,
        title: formData.title,
        category: formData.category,
        numTasks: formData.numTasks,
        color: formData.color,
        dueDate: formData.dueDate,
        weeklyTask: formData.weeklyTask,
      },
      {
        onError: (error) => {
          showToast(error.message, "error");
        },
        onSuccess: () => {
          showToast("Goal Created!", "success");
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

  if (isGoalsLoading || isWeeklyLoading) {
    return <ActivityIndicator />;
  }

  // if (weeklyGoalError) {
  //   showToast("Failed to fetch weekly goals.", "error");
  // }
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Wave
          // @ts-ignore
          style={{ objectFit: "cover", transform: [{ scale: 3 }] }}
          width="100%"
          height={200}
        />
      </View>
      <View style={styles.header}>
        {/* ability to create goals */}

        <Pressable
          android_ripple={{
            borderless: true,
          }}
          onPress={() => setGoalModalVisible(true)}
        >
          <AntDesign name="plussquareo" size={36} color="white" />
        </Pressable>

        <Text style={[globalStyles.title, { color: "white" }]}>Your Goals</Text>

        {/* menu button */}
        <Link href="/(main)/goals/history" asChild>
          <Pressable disabled={fetchedGoals.length < 1}>
            <Octicons name="history" size={36} color="white" />
          </Pressable>
        </Link>
      </View>

      {/* Goal overview */}
      {/* TODO ~ caraousel for other goals, MAX number of lng term goals is 10 */}
      <View>
        {fetchedGoals.length < 1 ? (
          <View style={styles.noGoals}>
            <NoGoals width={325} height={325} />
            <Text style={globalStyles.title}>No Goals Yet!</Text>
          </View>
        ) : (
          <FlatList
            data={fetchedGoals}
            renderItem={({ item }) => <GoalCard goal={item} />}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.goalCardContainer}
          />
        )}
      </View>

      {/* weekly goals */}
      {/* TODO ~ Will be a flatlist */}

      {fetchedGoals.length > 0 && fetchedWeeklyGoals!.length > 0 && (
        <View style={{ height: `55%` }}>
          <Text style={styles.subtitle}>Weekly Goals</Text>
          <WeeklyCardList
            // goals={fetchedGoals}
            currentDate={today}
            completeWeeklyTask={completeWeeklyTask}
            updateWeeklyTask={updateWeeklyTask}
            weeklyGoals={fetchedWeeklyGoals}
          />
        </View>
      )}

      {/* Create Goal Modal */}
      {goalModalVisible && (
        <CreateGoal
          selectedGoalColors={selectedGoalColors}
          visiblity={goalModalVisible}
          setVisibility={setGoalModalVisible}
          createGoal={createGoal}
        />
      )}

      {/* Snackbar */}
      <Toaster
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.light.greyBg,
    paddingBottom: 80,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.seconday[700],
    marginVertical: 10,
    color: Colors.light.text,
    textAlign: "center",
  },
  goalCardContainer: {
    gap: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  goalText: {
    color: "white",
    fontFamily: Fonts.seconday[600],
    fontSize: 16,
    letterSpacing: 1,
  },
  noGoals: {
    height: "95%",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GoalsScreen;
