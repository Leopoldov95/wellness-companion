import {
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { Goal } from "@/src/types/goals";
import { Link } from "expo-router";
import { GetCategoryImage } from "./GetCategoryImage";
import { Feather } from "@expo/vector-icons";
import { dateToReadible } from "@/src/utils/dateUtils";

type GoalCardProps = {
  goal: Goal;
};

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { id, category, title, dueDate, progress, color } = goal;

  return (
    // TODO ~ Make the goals cards pressable
    <View style={styles.container}>
      <Link href={`/(main)/goals/goal/${id}`} asChild>
        <Pressable
          android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
          style={styles.card}
        >
          {GetCategoryImage(category)}

          <Text numberOfLines={2} ellipsizeMode="clip" style={styles.title}>
            {title}
          </Text>
          {/* progress bar */}
          <View style={styles.bar}>
            <View
              style={[
                styles.progress,
                { width: `${progress}%` },
                { backgroundColor: `${color}` },
              ]}
            ></View>
          </View>

          <View style={styles.detail}>
            {/* <View style={styles.chip}>
          <Text style={styles.chipText}>{category}</Text>
        </View> */}
            <Text>End Date:</Text>
            <Text style={styles.date}>{dateToReadible(dueDate)}</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

export default GoalCard;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 16,
    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius
    // Android Shadow
    elevation: 3,
  },
  card: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    textAlign: "center",
    width: 180,
    backgroundColor: Colors.light.greyBg,
  },
  image: {
    marginTop: -18,
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
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.primary[600],
    textAlign: "center",
    color: Colors.light.text,
    height: 35,
    lineHeight: 16,
  },
  detail: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginTop: 8,
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
  date: {
    color: Colors.light.text,
    fontSize: 12,
    fontFamily: Fonts.primary[600],
    textAlign: "center",
  },
});
