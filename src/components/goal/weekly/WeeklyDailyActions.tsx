import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { WeeklyGoal } from "@/src/types/goals";
import { Feather } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import GoalProgressBar from "../GoalProgressBar";
import { Link } from "expo-router";
import { globalStyles } from "@/src/styles/globals";
import { formatDate, formatDateShort } from "@/src/utils/dateUtils";
import { Button } from "react-native-paper";
import Fonts from "@/src/constants/Fonts";

type WeeklyDailyActionsProps = {
  goal: WeeklyGoal;
  isModalVisible: boolean;
  completeWeeklyTask: (id: number, date: Date) => void;
  closeModal: () => void;
};

const WeeklyDailyActions: React.FC<WeeklyDailyActionsProps> = ({
  goal,
  isModalVisible,
  closeModal,
  completeWeeklyTask,
}) => {
  const {
    id,
    title,
    category,
    parent,
    numTasks,
    dailyTasks,
    color,
    startDate,
    endDate,
  } = goal;

  const [completed, setCompleted] = useState(false);
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setCompleted(true);

    // Animate background change
    Animated.timing(backgroundColor, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false, // Background color animation requires false
    }).start();

    // need to add result to entry list
    const date = new Date();
    // TODO ~ remember to Date transform this

    completeWeeklyTask(id, new Date("2024-01-12"));
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

  const weekDays = getWeekDays(startDate);

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

          <View style={styles.calendar}>
            {weekDays.map((day, index) => {
              const task = dailyTasks.find(
                (task) => task.getTime() === day.getTime()
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
            <Text style={globalStyles.labelText}>Week Progress</Text>
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
              textColor="white"
              disabled={completed} // Disable after completion
            >
              {completed ? (
                <>
                  <Text
                    style={{
                      color: "white",
                    }}
                  >
                    Task Completed!
                  </Text>
                  <Feather name="check-circle" size={20} color="white" />
                </>
              ) : (
                "Complete Task"
              )}
            </Button>
          </Animated.View>

          {/* link to edit weekly */}
          <Link href={`/(main)/goals/weekly/${id}`} asChild>
            <Text
              style={{
                ...globalStyles.linkText,
                textAlign: "center",
              }}
            >
              Modify Weekly Goal
            </Text>
          </Link>
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
    position: "absolute",
    top: "25%",
    left: "2.5%",
    padding: 10,
    paddingVertical: 20,
    height: "50%",
    width: "95%",
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
});
