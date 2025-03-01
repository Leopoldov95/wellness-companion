import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { WeeklyGoal } from "@/src/types/goals";
import WeeklyDailyActions from "./weekly/WeeklyDailyActions";

const WeeklyCard: React.FC<{
  weeklyGoal: WeeklyGoal;
  completeWeeklyTask: (id: number, date: Date) => void;
}> = ({ weeklyGoal, completeWeeklyTask }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { id, title, category, parent, numTasks, dailyTasks, color } =
    weeklyGoal;

  const progress =
    dailyTasks.length > 0
      ? Math.round((dailyTasks.length / numTasks) * 100)
      : 0;

  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
        style={styles.card}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.detail}>
          <Text style={styles.task}>{title}</Text>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{category}</Text>
          </View>
        </View>
        <Text style={styles.parentGoal}>{parent}</Text>
        <View style={styles.bar}>
          <View
            style={[
              styles.progress,
              { width: `${progress}%`, backgroundColor: color },
            ]}
          ></View>
        </View>
      </Pressable>

      {isModalVisible && weeklyGoal.status === "active" && (
        <WeeklyDailyActions
          goal={weeklyGoal}
          isModalVisible
          completeWeeklyTask={completeWeeklyTask}
          closeModal={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
};

export default WeeklyCard;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 12,
    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius
    // Android Shadow
    elevation: 2,
    marginBottom: 12,
  },
  card: {
    width: "100%",
    padding: 10,
    backgroundColor: Colors.light.greyBg,
  },
  detail: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "#926dfc33",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  chipText: {
    color: Colors.light.tertiary,
    fontSize: 12,
    fontFamily: Fonts.primary[500],
  },
  bar: {
    width: "100%",
    backgroundColor: "#ececec",
    height: 10,
    borderRadius: 4,
    marginVertical: 6,
    position: "relative",
    overflow: "hidden",
  },
  progress: {
    position: "absolute",
    height: 10,
    left: 0,
    top: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  task: {
    fontFamily: Fonts.primary[600],
  },
  parentGoal: {
    fontSize: 12,
    color: "lightgrey",
  },
});
