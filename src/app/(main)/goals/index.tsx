import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";
import Fonts from "@/src/constants/Fonts";
import GoalCard from "@/src/components/goal/GoalCard";
import WeeklyCard from "@/src/components/goal/WeeklyCard";
import Wave from "@/assets/images/goals/wave.svg";
import { useGoals } from "@/src/providers/GoalsProvider";
import CreateGoal from "@/src/components/goal/CreateGoal";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  Drawer,
  SegmentedButtons,
  Switch,
  ToggleButton,
} from "react-native-paper";
import Modal from "react-native-modal";
import { Link } from "expo-router";
import WeeklyCardList from "@/src/components/goal/WeeklyCardList";

/**
 * Think about what users want for goals. We don't want this to just be a "to-do" list
 * Maybe let the user determine what long term goals they want (can be monthly or yearly)
 * Then, the user can determine what weekly goals they want to focus on
 * There could be a qizard that helps users figure out how this system works
 * For each long term goal, there abould be a streak counter
 * ?? Should we have like an achivement for the long term goals achieved?
 * Goals will need to be categorized
 * Each main goal will have 1 weekly goal at a time
 * ? How do we ties the weekly goals to main ones??
 * TODO ~ Might want to see a history of completed goals
 */

const GoalsScreen = () => {
  const { goals, weeklyGoals, createGoal } = useGoals();
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [goalView, setGoalView] = useState("normal");

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
        <Pressable onPress={() => setMenuVisible(true)}>
          <AntDesign name="menu-unfold" size={36} color="white" />
        </Pressable>
      </View>

      {/* Goal overview */}
      {/* TODO ~ caraousel for other goals, MAX number of lng term goals is 10 */}
      <View>
        <FlatList
          data={goals}
          renderItem={({ item }) => (
            <GoalCard goal={item} goalView={goalView} />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.goalCardContainer}
        />
      </View>

      {/* weekly goals */}
      {/* TODO ~ Will be a flatlist */}

      <View style={{ height: `${goalView === "normal" ? "55%" : "70%"}` }}>
        <Text style={styles.subtitle}>Weekly Goals</Text>
        <WeeklyCardList weeklyGoals={weeklyGoals} />
      </View>

      {/* Create Goal Modal */}
      {goalModalVisible && (
        <CreateGoal
          visiblity={goalModalVisible}
          setVisibility={setGoalModalVisible}
          createGoal={createGoal}
        />
      )}

      {/* Drawer Modal */}
      <Modal
        isVisible={menuVisible}
        onBackdropPress={() => setMenuVisible(false)} // Close when tapping outside
        animationIn="slideInRight" // Slide in from the right
        animationOut="slideOutRight" // Slide out to the right
        useNativeDriver={true}
        style={{
          margin: 0,
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }} // Align right
      >
        <View
          style={{
            width: "65%",
            height: "100%",
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <Drawer.Section>
            <Pressable
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                flexDirection: "row",
                marginBottom: 10,
              }}
              onPress={() => setMenuVisible(false)}
            >
              <AntDesign name="menu-fold" size={32} color="black" />
            </Pressable>
          </Drawer.Section>
          <Drawer.Section style={styles.menuContainer}>
            <View>
              <Text style={styles.linkText}>Goal View</Text>
              <SegmentedButtons
                value={goalView}
                style={styles.menuButtons}
                onValueChange={setGoalView}
                buttons={[
                  {
                    value: "normal",
                    label: "Normal",
                  },
                  {
                    value: "compact",
                    label: "Compact",
                  },
                ]}
              />
            </View>

            <Link href="/(main)/goals/history">
              <Text style={globalStyles.linkText}>Past Goals</Text>
            </Link>
          </Drawer.Section>
        </View>
      </Modal>
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
  menuContainer: {
    display: "flex",
    gap: 10,
    paddingVertical: 10,
  },
  linkText: {
    fontFamily: Fonts.primary[400],
  },
  menuButtons: {
    marginVertical: 8,
  },
});

export default GoalsScreen;
