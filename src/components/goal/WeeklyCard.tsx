import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { Goal, WeeklyGoal } from "@/src/types/goals";
import WeeklyDailyActions from "./weekly/WeeklyDailyActions";
import { isActiveWeeklyGoal } from "@/src/utils/goalsUtils";
import { dateToReadible } from "@/src/utils/dateUtils";

type WeeklyCardProps = {
  weeklyGoal: WeeklyGoal;
  parentGoal: Goal; // needed to get parent details
  completeWeeklyTask: (id: number, date: Date) => void;
  currentDate: Date;
};

const WeeklyCard: React.FC<WeeklyCardProps> = ({
  weeklyGoal,
  parentGoal,
  currentDate,
  completeWeeklyTask,
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { id, title, numTasks, dailyTasks, endDate } = weeklyGoal;
  const { category, title: parentTitle, color } = parentGoal;

  const isActive = isActiveWeeklyGoal(weeklyGoal, currentDate, true);

  const progress =
    dailyTasks.length > 0
      ? Math.round((dailyTasks.length / numTasks) * 100)
      : 0;

  return (
    <View style={[styles.container, !isActive && { opacity: 0.6 }]}>
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
        <View style={styles.detail}>
          <Text style={styles.parentGoal}>{parentTitle}</Text>
          <Text style={styles.date}>{dateToReadible(endDate)}</Text>
        </View>

        <View style={styles.bar}>
          <View
            style={[
              styles.progress,
              { width: `${progress}%`, backgroundColor: color },
            ]}
          ></View>
        </View>
      </Pressable>
      {/* TODO will need to redo this logic, grey out card when goal is completed */}
      {/* (ONLY FOR GOALS page) */}
      {isModalVisible && isActive && (
        <WeeklyDailyActions
          goal={weeklyGoal}
          isModalVisible
          currentDate={currentDate}
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
    backgroundColor: "white",
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
  date: {
    fontFamily: Fonts.primary[600],
    marginTop: 6,
    marginBottom: 4,
  },
});
