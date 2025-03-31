import Wave from "@/assets/images/goals/wave.svg";
import CreateGoal from "@/src/components/goal/CreateGoal";
import GoalCard from "@/src/components/goal/GoalCard";
import WeeklyCardList from "@/src/components/goal/WeeklyCardList";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { useGoals } from "@/src/providers/GoalsProvider";
import { globalStyles } from "@/src/styles/globals";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

/**
 * There could be a qizard that helps users figure out how this system works
 * For each long term goal, there abould be a streak counter
 * ?? Should we have like an achivement for the long term goals achieved?
 * TODO ~ Might want to see a history of completed goals
 */

const GoalsScreen = () => {
  const {
    goals,
    weeklyGoals,
    selectedGoalColors,
    createGoal,
    today,
    completeWeeklyTask,
  } = useGoals();
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
          <Pressable>
            <Octicons name="history" size={36} color="white" />
          </Pressable>
        </Link>
      </View>

      {/* Goal overview */}
      {/* TODO ~ caraousel for other goals, MAX number of lng term goals is 10 */}
      <View>
        <FlatList
          data={goals}
          renderItem={({ item }) => <GoalCard goal={item} />}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.goalCardContainer}
        />
      </View>

      {/* weekly goals */}
      {/* TODO ~ Will be a flatlist */}

      <View style={{ height: `55%` }}>
        <Text style={styles.subtitle}>Weekly Goals</Text>
        <WeeklyCardList
          goals={goals}
          currentDate={today}
          completeWeeklyTask={completeWeeklyTask}
          weeklyGoals={weeklyGoals}
        />
      </View>

      {/* Create Goal Modal */}
      {goalModalVisible && (
        <CreateGoal
          selectedGoalColors={selectedGoalColors}
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
});

export default GoalsScreen;
