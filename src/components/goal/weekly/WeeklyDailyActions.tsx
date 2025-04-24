import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { globalStyles } from "@/src/styles/globals";
import { WeeklyGoal } from "@/src/types/goals";
import { formatDate, formatDateShort } from "@/src/utils/dateUtils";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import GoalProgressBar from "../GoalProgressBar";

type WeeklyDailyActionsProps = {
  goal: WeeklyGoal;
  isModalVisible: boolean;
  currentDate: Date;
  completeWeeklyTask: (id: number, date: Date) => void;
  updateWeeklyTask: (id: number, title: string) => void;
  closeModal: () => void;
};

const WeeklyDailyActions: React.FC<WeeklyDailyActionsProps> = ({
  goal,
  isModalVisible,
  closeModal,
  completeWeeklyTask,
  updateWeeklyTask,
  currentDate,
}) => {
  const { id, title, numTasks, dailyTasks, color, startDate, endDate } = goal;
  const [isEdit, setisEdit] = useState(false);
  const [goalTitle, setGoalTitle] = useState(title);

  const isTaskCompleted = dailyTasks.some(
    (task) => formatDate(task.date) === formatDate(new Date(currentDate))
  );

  const backgroundColor = useRef(
    new Animated.Value(isTaskCompleted ? 1 : 0)
  ).current;

  const handlePress = () => {
    // Animate background change
    Animated.timing(backgroundColor, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false, // Background color animation requires false
    }).start();

    // need to add result to entry list
    const date = new Date();
    // TODO ~ remember to Date transform this

    completeWeeklyTask(id, currentDate);
  };

  // Interpolating colors for animation
  const backgroundInterpolate = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.light.tertiary, "green"], // Purple to Green
  });

  const getWeekDays = (start: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(start.getTime()));
      start = new Date(start.getTime());
      start.setDate(start.getDate() + 1); // Mutating start affects future iterations
    }
    return days;
  };

  const onUpdate = () => {
    if (goalTitle.length < 1) return;

    updateWeeklyTask(id, goalTitle);
    setisEdit(false);
  };

  const weekDays = getWeekDays(new Date(startDate));

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => closeModal()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* close button */}
          <Pressable onPress={closeModal} style={styles.close}>
            <Feather name="x" size={36} color={Colors.light.text} />
          </Pressable>

          <Text style={styles.title}>
            Weekly Goal: {formatDateShort(startDate)} -{" "}
            {formatDateShort(endDate)}
          </Text>

          <View style={styles.goalTitle}>
            {isEdit ? (
              <TextInput
                label="Goal Title"
                value={goalTitle}
                mode="outlined"
                style={{ width: "85%" }}
                onChangeText={(text: React.SetStateAction<string>) =>
                  setGoalTitle(text)
                }
              />
            ) : (
              <Text style={globalStyles.labelText}>{goalTitle}</Text>
            )}

            <Feather
              onPress={() => setisEdit(!isEdit)}
              name={isEdit ? "check" : "edit-3"}
              size={24}
              color={Colors.light.quinary}
            />
          </View>

          <View style={styles.calendar}>
            {weekDays.map((day, index) => {
              const task = dailyTasks.find(
                (task) => formatDate(task.date) === formatDate(day)
              ); // Find the task for that day

              return (
                <View key={index} style={styles.dayContainer}>
                  <Text style={styles.dayLabel}>{formatDateShort(day)}</Text>
                  <View style={styles.checkmarkContainer}>
                    {task ? (
                      <Feather name="check-circle" size={20} color="green" />
                    ) : (
                      <Feather name="circle" size={20} color="gray" />
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* progress */}
          <View style={styles.progress}>
            <Text style={globalStyles.labelText}>
              Week Progress: {goal.dailyTasks.length} / {goal.numTasks}
            </Text>
            <GoalProgressBar
              progress={
                dailyTasks.length > 0
                  ? parseFloat(
                      ((dailyTasks.length / numTasks) * 100).toFixed(2)
                    )
                  : 0
              }
              color={color ? color : "grey"}
            />
          </View>

          {/* action button */}
          <Animated.View
            style={{
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: backgroundInterpolate,
            }}
          >
            <Button
              mode="contained"
              onPress={handlePress}
              style={{
                borderRadius: 8,
              }}
              disabled={isTaskCompleted}
              labelStyle={{ color: "white" }}
              textColor="#fff"
              icon={() =>
                isTaskCompleted ? (
                  <Feather name="check-circle" size={20} color="white" />
                ) : null
              }
            >
              {isTaskCompleted ? "Task Completed!" : "Complete Task"}
            </Button>
          </Animated.View>
          {goalTitle !== title && (
            <Button
              style={{
                borderRadius: 8,
              }}
              mode="outlined"
              onPress={onUpdate}
              disabled={goalTitle.length < 1}
            >
              Save Goal Title
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default WeeklyDailyActions;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 12,
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-start",
    alignContent: "center",
    borderRadius: 16,
    gap: 16,
  },
  close: {
    marginLeft: "auto",
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: Fonts.primary[600],
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    marginHorizontal: "auto",
  },
  dayContainer: {
    marginBottom: 10,
    borderBlockColor: Colors.light.text,
    backgroundColor: "white",
    borderWidth: 1,
    padding: 4,
    paddingBottom: 10,
    flex: 1,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  checkmarkContainer: {
    marginTop: 5,
    marginHorizontal: "auto",
  },
  progress: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    textAlign: "left",
  },
  goalTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
