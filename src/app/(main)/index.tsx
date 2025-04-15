import Journaling from "@/assets/images/activities/journaling.svg";
import Meditate from "@/assets/images/activities/meditate.svg";
import { useInsertMood, useMoodList } from "@/src/api/moods";
import Facts from "@/src/components/Facts";
import GoalProgressBar from "@/src/components/goal/GoalProgressBar";
import WeeklyCard from "@/src/components/goal/WeeklyCard";
import MoodSelector from "@/src/components/mood/MoodSelector";
import Toaster from "@/src/components/Snackbar";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { useAuth } from "@/src/providers/AuthProvider";
import { useGoals } from "@/src/providers/GoalsProvider";
import { useMood } from "@/src/providers/MoodProvider";
import { globalStyles } from "@/src/styles/globals";
import { Goal, WeeklyGoal } from "@/src/types/goals";
import { MoodEntry, moodType } from "@/src/types/mood";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";

const HomeScreen = () => {
  // const { isMoodTracked } = useMood();
  const {
    getUpcommingWeeklyGoal,
    completeWeeklyTask,
    weeklyGoals,
    goals,
    today,
  } = useGoals();
  const { mutate: insertMood } = useInsertMood();

  //? Is this flow okay? What is session changes?
  const { profile } = useAuth();
  const { data: fetchedMoods, error, isLoading } = useMoodList(profile.id);
  //*
  const [upcommingGoals, setUpcommingGoals] = useState<WeeklyGoal[]>([]);
  const [progress, setProgress] = useState(0);
  const [parentGoal, setParentGoal] = useState<Goal | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [isMoodTracked, setIsMoodTracked] = useState(false);

  useEffect(() => {
    const validDailyGoals = getUpcommingWeeklyGoal();

    setUpcommingGoals(validDailyGoals);
    if (validDailyGoals.length > 0) {
      setParentGoal(
        goals.filter((goal) => goal.id === validDailyGoals[0].goalId)[0]
      );
    }

    setProgress(
      Math.floor(
        ((weeklyGoals.length - validDailyGoals.length) / weeklyGoals.length) *
          100
      )
    );
  }, [weeklyGoals]);

  useEffect(() => {
    if (!fetchedMoods || fetchedMoods.length === 0) return;

    const todayDate = new Date().toISOString().split("T")[0];

    const moodToday = fetchedMoods.find((entry: MoodEntry) => {
      const entryDate = new Date(entry.created_at).toISOString().split("T")[0];
      return entryDate === todayDate;
    });

    setIsMoodTracked(!!moodToday);
  }, [fetchedMoods]);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // 'Tue'
    year: "numeric", // '2025'
    month: "short", // 'Jan'
    day: "numeric", // '25'
  };

  // const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", options);

  const showToast = (message: string, type: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const onMoodPress = (mood: moodType) => {
    insertMood(
      { userId: profile.id, mood },
      {
        onSuccess: () => {
          // update mood provider?
          showToast("Mood recorded successfully!", "success");
        },
        onError: (error) => {
          showToast(error.message, "error");
        },
      }
    );
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch</Text>;
  }

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
        <View>
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
        {!isMoodTracked && <MoodSelector onMoodPress={onMoodPress} />}

        {/* Fun mental health facts */}
        <Facts />

        {/* Upcomming self care */}
        <View>
          <Text style={[globalStyles.subheader, { marginBottom: 10 }]}>
            Daily Tasks
          </Text>
          {upcommingGoals.length > 0 && parentGoal ? (
            <WeeklyCard
              parentGoal={parentGoal}
              currentDate={today}
              completeWeeklyTask={completeWeeklyTask}
              weeklyGoal={upcommingGoals[0]}
            />
          ) : (
            <View style={styles.noGoal}>
              <Text style={[globalStyles.labelText, { textAlign: "center" }]}>
                All Caught Up!
              </Text>
              <MaterialCommunityIcons
                name="party-popper"
                size={24}
                color="black"
              />
            </View>
          )}
        </View>

        {/* weeekly progress of self care goals */}
        {/* TODO ~ this could be used to track number of DAILY tasks */}
        <View style={styles.progress}>
          <Text style={globalStyles.labelText}>Daily Progress:</Text>
          <View style={{ flex: 1 }}>
            <GoalProgressBar progress={progress} color="pink" />
          </View>
        </View>

        {/*** Quick Links ***/}
        <View style={styles.links}>
          {/* Meditate */}
          <Link href={"/(main)/meditate"} asChild>
            <Pressable
              style={{
                ...styles.cardLink,
                ...{ backgroundColor: Colors.light.warmYellow },
              }}
            >
              <Text style={styles.menuOption}>Meditate</Text>
              <Meditate width={100} height={100} />
            </Pressable>
          </Link>
          {/* Gratitude Journal */}
          <Link href={"/(main)/journal"} asChild>
            <Pressable
              style={{
                ...styles.cardLink,
                ...{ backgroundColor: Colors.light.softOrange },
              }}
            >
              <Text style={styles.menuOption}>Journaling</Text>
              <Journaling width={100} height={100} />
            </Pressable>
          </Link>
        </View>
      </ScrollView>

      <Toaster
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />

      {/* Snackbar for error messages */}
      {/* <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        style={[
          snackbarMessage.includes("already")
            ? styles.messageError
            : styles.messageSuccess,
          { marginBottom: 90 },
        ]}
        action={{
          label: "DISMISS",
          textColor: "white",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar> */}
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
  progress: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  cardLink: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.warmYellow,
    borderRadius: 32,
    gap: 4,
  },
  links: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  menuOption: {
    fontFamily: Fonts.seconday[600],
    fontSize: 32,
    color: "white",
  },
  noGoal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderColor: Colors.light.lightBlue,
    borderWidth: 2,
  },
  moodMessage: {
    height: 80,
    borderColor: Colors.light.primary,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
