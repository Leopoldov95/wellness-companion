import { ListRenderItem, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
const IMG_HEIGHT = 120;
const IMG_WIDTH = "100%";
// SVG assets

import Cooking from "@/assets/images/activities/cooking.svg";
import CreativeArts from "@/assets/images/activities/crotchet.svg";
import EventPlanning from "@/assets/images/activities/event.svg";
import Gardening from "@/assets/images/activities/gardening.svg";
import Hiking from "@/assets/images/activities/hiking.svg";
import Journaling from "@/assets/images/activities/journaling.svg";
import Mindfulness from "@/assets/images/activities/meditate.svg";
import SelfCare from "@/assets/images/activities/meditate.svg";
import OutdoorActivities from "@/assets/images/activities/meditate.svg";
import Planning from "@/assets/images/activities/planning.svg";
import HobbiesInterests from "@/assets/images/activities/meditate.svg";
import Reading from "@/assets/images/activities/reading.svg";
import SocialActivities from "@/assets/images/activities/meditate.svg";
import Sports from "@/assets/images/activities/sports.svg";
import Volunteer from "@/assets/images/activities/volunteer.svg";
import Fitness from "@/assets/images/activities/meditate.svg";
import Health from "@/assets/images/activities/meditate.svg";
import Learning from "@/assets/images/activities/meditate.svg";
import Travel from "@/assets/images/activities/meditate.svg";
import CareerWork from "@/assets/images/activities/meditate.svg";
import Finance from "@/assets/images/activities/meditate.svg";
import Family from "@/assets/images/activities/meditate.svg";
import Pets from "@/assets/images/activities/meditate.svg";
import Technology from "@/assets/images/activities/meditate.svg";
import { Category } from "@/src/types/goals";

type GoalsProps = {
  category: Category;
  title: string;
  dueDate: string;
  progress: number;
};

const GoalCard: ListRenderItem<GoalsProps> = ({ item }) => {
  const { category, title, dueDate, progress } = item;
  const getCategoryImage = (category: Category) => {
    switch (category) {
      case "cooking":
        return (
          <Cooking style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "creative arts":
        return (
          <CreativeArts
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "event planning":
        return (
          <EventPlanning
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "gardening":
        return (
          <Gardening
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "hiking":
        return (
          <Hiking style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "journaling":
        return (
          <Journaling
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "mindfulness":
        return (
          <Mindfulness
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "self-care":
        return (
          <SelfCare
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "outdoor":
        return (
          <OutdoorActivities
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "planning":
        return (
          <Planning
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "hobbies":
        return (
          <HobbiesInterests
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "reading":
        return (
          <Reading style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "social":
        return (
          <SocialActivities
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "sports":
        return (
          <Sports style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "volunteer":
        return (
          <Volunteer
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "fitness":
        return (
          <Fitness style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "health":
        return (
          <Health style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "learning":
        return (
          <Learning
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "travel":
        return (
          <Travel style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "career/work":
        return (
          <CareerWork
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      case "finance":
        return (
          <Finance style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "family":
        return (
          <Family style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "pets":
        return (
          <Pets style={styles.image} width={IMG_WIDTH} height={IMG_HEIGHT} />
        );
      case "technology":
        return (
          <Technology
            style={styles.image}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
        );
      default:
        throw new Error(`Invalid category: ${category}`);
    }
  };

  return (
    // TODO ~ Make the goals cards pressable
    <View style={styles.card}>
      {getCategoryImage(category)}

      <Text numberOfLines={2} ellipsizeMode="clip" style={styles.title}>
        {title}
      </Text>
      {/* progress bar */}
      <View style={styles.bar}>
        <View style={[styles.progress, { width: `${progress}%` }]}></View>
      </View>

      <View style={styles.detail}>
        {/* <View style={styles.chip}>
          <Text style={styles.chipText}>{category}</Text>
        </View> */}
        <Text style={styles.date}>{dueDate}</Text>
      </View>
    </View>
  );
};

export default GoalCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    // borderColor: Colors.light.text,
    // borderWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    textAlign: "center",
    width: 180,

    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius
    // Android Shadow
    elevation: 3,
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
    backgroundColor: Colors.light.secondary,
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
    textAlign: "center",
    width: "100%",
    // display: "flex",
    // flexDirection: "row",
    // width: "100%",
    // alignItems: "flex-start",
    // justifyContent: "space-between",
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
    fontFamily: Fonts.primary[400],
    textAlign: "center",
  },
});
