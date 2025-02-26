import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { globalStyles } from "@/src/styles/globals";
import Fonts from "@/src/constants/Fonts";
import { Link } from "expo-router";
import { moodType } from "@/src/types/mood";
import { useMood } from "@/src/providers/MoodProvider";
import Meditate from "@/assets/images/activities/meditate.svg";
import Journaling from "@/assets/images/activities/journaling.svg";
import MoodSelector from "@/src/components/mood/MoodSelector";
import Facts from "@/src/components/Facts";
import { useGoals } from "@/src/providers/GoalsProvider";
import { WeeklyGoal } from "@/src/types/goals";
import WeeklyCard from "@/src/components/goal/WeeklyCard";

const HomeScreen = () => {
  const { onMoodPress, isMoodTracked } = useMood();
  const { getUpcommingWeeklyGoal, completeWeeklyTask, weeklyGoals } =
    useGoals();
  // const [upcommingGoal, setUpcommingGoal] = useState<WeeklyGoal | null>(null);

  const upcommingGoal = React.useMemo(
    () => getUpcommingWeeklyGoal(),
    [weeklyGoals]
  );

  // const fetchUpcommingGoal = () => {
  //   const goal = getUpcommingWeeklyGoal();
  //   if (goal) {
  //     setUpcommingGoal(goal);
  //   }
  // };

  // useEffect(() => {
  //   fetchUpcommingGoal();
  // }, []);

  // // update upcomming goal details on task completion
  // useEffect(() => {
  //   console.log("weekly goals was updated");
  //   console.log(weeklyGoals);

  //   fetchUpcommingGoal();
  // }, [weeklyGoals]);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // 'Tue'
    year: "numeric", // '2025'
    month: "short", // 'Jan'
    day: "numeric", // '25'
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <View style={styles.container}>
      {/* User Profile */}
      <View style={styles.header}>
        <View style={styles.profileContentLeft}>
          <View style={styles.dateContainer}>
            <Feather name="calendar" size={18} color="white" />
            <Text style={{ color: "white" }}>{formattedDate}</Text>
          </View>
          <View>
            <Text
              style={[
                globalStyles.body,
                {
                  color: "white",
                },
              ]}
            >
              Welcome back,
            </Text>
            <Text style={styles.name}>John Doe</Text>
          </View>
        </View>
        <View style={styles.profileContentRight}>
          <Image
            style={styles.avatar}
            source={require("@/assets/images/placeholder/profile.png")}
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood Tracking */}
        {/* (?) We might want to make this it's own component */}
        <MoodSelector onMoodPress={onMoodPress} isMoodTracked={isMoodTracked} />

        {/* Fun mental health facts */}
        <Facts />

        {/* Upcomming self care */}
        <View style={styles.upcomming}>
          {upcommingGoal && (
            <React.Fragment>
              <Text style={globalStyles.subheader}>Upcomming Goal</Text>
              <WeeklyCard
                completeWeeklyTask={completeWeeklyTask}
                weeklyGoal={upcommingGoal}
              />
            </React.Fragment>
          )}
        </View>

        {/* weeekly progress of self care goals */}
        <View style={styles.progress}></View>

        {/*** Quick Links ***/}
        {/* Meditate */}
        <Link href={"/(main)/meditate"} asChild>
          <Pressable style={styles.meditate}>
            <Meditate width={100} height={100} />
            <Text style={styles.menuOption}>Meditate</Text>
          </Pressable>
        </Link>

        {/* Gratitude Journal */}
        <Link href={"/(main)/journal"} asChild>
          <Pressable style={styles.journaling}>
            <Text style={styles.menuOption}>Journaling</Text>
            <Journaling width={100} height={100} />
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.offWhite,
    flex: 1,
  },
  name: {
    color: "white",
    fontFamily: Fonts.primary[600],
    fontSize: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 32,
  },
  header: {
    backgroundColor: Colors.light.primary,
    color: "#fff",
    padding: 32,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  profileContentLeft: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
  },
  profileContentRight: {},
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    color: "white",
  },
  main: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 15,
    gap: 24,
    paddingBottom: 120,
  },
  upcomming: {},
  progress: {},
  meditate: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.warmYellow,
    borderRadius: 32,
    gap: 4,
  },
  journaling: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.softOrange,
    borderRadius: 32,
    gap: 4,
  },
  menuOption: {
    fontFamily: Fonts.seconday[600],
    fontSize: 32,
    color: "white",
  },
});

export default HomeScreen;
