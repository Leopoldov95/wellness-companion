import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Goal } from "@/src/types/goals";
import Colors from "@/src/constants/Colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { GetCategoryImage } from "./GetCategoryImage";
import { globalStyles } from "@/src/styles/globals";
import { dateToReadible } from "@/src/utils/dateUtils";
import GoalProgressBar from "./GoalProgressBar";
import Fonts from "@/src/constants/Fonts";

type HistoryCardType = {
  goal: Goal;
};

const HistoryCard: React.FC<HistoryCardType> = ({ goal }) => {
  return (
    <View style={styles.goalCard}>
      {/* Icon based on completion */}
      <View style={styles.icon}>
        <FontAwesome6 name="award" size={30} color={Colors.light.primary} />
      </View>
      {/* category image */}
      <View style={styles.category}>{GetCategoryImage(goal.category, 90)}</View>

      {/* details with goal bar */}
      <View style={styles.detailContainer}>
        <Text style={[globalStyles.subheader, { textAlign: "left" }]}>
          {goal.title}
        </Text>
        <View style={styles.detailRow}>
          <Text>
            {dateToReadible(goal.created)} - {dateToReadible(goal.dueDate)}
          </Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{goal.category}</Text>
        </View>
        <View style={{ width: "100%" }}>
          <GoalProgressBar
            compact={true}
            color={goal.color}
            progress={goal.progress}
          />
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  goalCard: {
    display: "flex",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
    borderRadius: 12,
    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius
    // Android Shadow
    elevation: 2,
    backgroundColor: "white",
    marginBottom: 16,
  },
  category: {
    width: 90,
    height: "auto",
  },
  detailContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    gap: 4,
    alignItems: "baseline",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
  },
  icon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  chip: {
    backgroundColor: "#926dfc33",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginVertical: 4,
  },
  chipText: {
    color: Colors.light.tertiary,
    fontSize: 12,
    fontFamily: Fonts.primary[500],
  },
});
