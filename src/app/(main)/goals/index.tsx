import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";

import Fonts from "@/src/constants/Fonts";
import GoalCard from "@/src/components/goal/GoalCard";
import { Category } from "@/src/types/goals";
import { Button } from "react-native-paper";
import WeeklyCard from "@/src/components/goal/WeeklyCard";
import Feather from "@expo/vector-icons/Feather";
import Wave from "@/assets/images/goals/wave.svg";
import { useGoals } from "@/src/providers/GoalsProvider";
import CreateGoal from "@/src/components/goal/CreateGoal";

/**
 * Think about what users want for goals. We don't want this to just be a "to-do" list
 * Maybe let the user determine what long term goals they want (can be monthly or yearly)
 * Then, the user can determine what weekly goals they want to focus on
 * There could be a qizard that helps users figure out how this system works
 * For each long term goal, there abould be a streak counter
 * ?? Should we have like an achivement for the long term goals achieved?
 * Goals will need to be categorized
 * Each main goal will have 1 weekly goal at a time
 * ? How do we ties the weekly goals to main ones
 * TODO ~ Might want to see a history of completed goals
 */

const GoalsScreen = () => {
  const { goals, weeklyGoals, createGoal } = useGoals();
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Wave
          style={{ objectFit: "cover", transform: [{ scale: 3 }] }}
          width="100%"
          height={200}
        />
      </View>
      <Text style={[globalStyles.title, { color: "white" }]}>Your Goals</Text>
      {/* Goal overview */}
      {/* TODO ~ caraousel for other goals, MAX number of lng term goals is 10 */}
      <View>
        <FlatList
          data={goals}
          renderItem={GoalCard}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.goalCardContainer}
        />
      </View>

      {/* weekly goals */}
      {/* TODO ~ Will be a flatlist */}

      <View style={{ height: "50%" }}>
        <Text style={styles.subtitle}>Weekly Goals</Text>
        <FlatList
          data={weeklyGoals}
          renderItem={WeeklyCard}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginTop: 8,
          }}
        />
      </View>

      {/* ability to create goals */}
      <View style={styles.btnContainer}>
        <Pressable
          style={styles.goalBtn}
          android_ripple={{
            borderless: true,
          }}
          onPress={() => setGoalModalVisible(true)}
        >
          <Feather name="plus" size={24} color="white" />
          <Text style={styles.goalText}>Add Goal</Text>
        </Pressable>
      </View>

      {/* Create Goal Modal */}
      {goalModalVisible && (
        <CreateGoal
          visiblity={goalModalVisible}
          setVisibility={setGoalModalVisible}
          createGoal={createGoal}
        />
      )}
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
  btnContainer: {
    borderRadius: 20,
    overflow: "hidden",
    margin: "auto",
  },
  goalBtn: {
    backgroundColor: Colors.light.quinary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 20,
  },
  goalText: {
    color: "white",
    fontFamily: Fonts.seconday[600],
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default GoalsScreen;
