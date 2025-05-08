import { useAllWeeklyGoals, useGoalsList, usePastGoals } from "@/src/api/goals";
import { useJournals } from "@/src/api/journal";
import { useMoodList } from "@/src/api/moods";
import GoalProgressBar from "@/src/components/goal/GoalProgressBar";
import MoodCalendar from "@/src/components/mood/MoodCalendar";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { useAuth } from "@/src/providers/AuthProvider";
import { globalStyles } from "@/src/styles/globals";
import { Goal, WeeklyGoal } from "@/src/types/goals";
import { GratitudeEntry } from "@/src/types/journal";
import { dateToYearMonth } from "@/src/utils/dateUtils";
import { calculateGoalProgress } from "@/src/utils/goalsUtils";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ChartScreen = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(
    dateToYearMonth(new Date())
  );
  const { profile } = useAuth();
  const {
    data: fetchedMoods,
    error: moodError,
    isLoading: isMoodLoading,
  } = useMoodList(profile.id);
  const {
    data: fetchedJournal,
    error: journalError,
    isLoading: isJournalLoading,
  } = useJournals(profile.id);
  // active goals
  const {
    data: fetchedGoals,
    error: goalsError,
    isLoading: isGoalsLoading,
  } = useGoalsList(profile.id);

  // past goals
  const {
    data: fetchedPastGoals,
    error: pastGoalsError,
    isLoading: isPastGoalsLoading,
  } = usePastGoals(profile.id);

  // all weekly goals
  const {
    data: fetchedAllWeeklyGoals,
    error: allWeeklyGoalsError,
    isLoading: isAllWeeklyGoalsLoading,
  } = useAllWeeklyGoals(profile.id);

  if (
    moodError ||
    journalError ||
    goalsError ||
    pastGoalsError ||
    allWeeklyGoalsError
  ) {
    return <Text>ERROR FETCHING DATA...</Text>;
  }

  if (
    isMoodLoading ||
    isJournalLoading ||
    isGoalsLoading ||
    isPastGoalsLoading ||
    isAllWeeklyGoalsLoading
  ) {
    return <ActivityIndicator />;
  }

  const filterJournalEntries = (entries: GratitudeEntry[]): number => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed (0 = January)
    const currentYear = now.getFullYear();

    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    }).length;
  };

  // method to get top categories for the goals (including completed)
  const getTopCategories = (goals: Goal[]) => {
    const total = goals.length;

    const categoryCountMap = goals.reduce((acc, goal) => {
      const category = goal.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / total) * 100),
      }));

    return sortedCategories;
  };

  // method to get all completed goals
  const getCompletedGoals = (pastGoals: Goal[]) => {
    return pastGoals.filter((goal) => goal.status === "completed").length;
  };

  // method to get all completed weekly goals

  const getCompletedWeeklyGoals = (weeklyGoals: WeeklyGoal[]) => {
    return weeklyGoals.filter((goal) => goal.status === "completed").length;
  };

  // current main parent goal complettion (not sure how this could work)
  const calculateTotalCompletion = (
    goals: Goal[],
    weeklyGoals: WeeklyGoal[]
  ) => {
    let sum = 0;
    goals.forEach((goal) => {
      sum += calculateGoalProgress(
        goal,
        weeklyGoals.filter((wkGoal) => wkGoal.goalId === goal.id)
      );
    });

    return Math.round(sum / goals.length);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={globalStyles.title}>Stats</Text>

      <View style={styles.moodContainer}>
        <Text style={globalStyles.subheader}>Moods</Text>
        <MoodCalendar
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          moodEntries={fetchedMoods}
        />
      </View>

      {/* Goal data */}

      <View style={styles.goalContainer}>
        <Text style={globalStyles.subheader}>Goals {currentMonth}</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Completed (Lifetime):</Text>
            <Text style={styles.bigText}>
              {getCompletedGoals(fetchedPastGoals)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Completed:</Text>
            <Text style={styles.bigText}>
              {calculateTotalCompletion(
                fetchedGoals.concat(fetchedPastGoals),
                fetchedAllWeeklyGoals
              )}
              %
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Weekly Goals:</Text>
            <Text style={styles.bigText}>
              {getCompletedWeeklyGoals(fetchedAllWeeklyGoals)}
            </Text>
          </View>
        </View>
        <View style={styles.topCategories}>
          {getTopCategories(fetchedGoals.concat(fetchedPastGoals)).map(
            (goal, idx) => (
              <View key={`goal-${idx}`} style={styles.categoryRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{goal.category}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <GoalProgressBar
                    progress={goal.percentage}
                    color={Colors.light.primary}
                  />
                </View>
              </View>
            )
          )}
        </View>
      </View>

      {/* goals completed lifetime. SHOW NA if any are still in progress */}
      {/* completetion rate lifetime. Do NOt include in progress goals, show NA if no data available */}
      {/* weekly goals completed this month */}
      {/* top goals category */}

      {/* Journal data ✅ */}
      <View style={styles.journalContainer}>
        <Text style={globalStyles.subheader}>Journaling</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Entries This Month:</Text>
            <Text style={styles.bigText}>
              {filterJournalEntries(fetchedJournal)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Total Entries:</Text>
            <Text style={styles.bigText}>{fetchedJournal?.length}</Text>
          </View>
        </View>
      </View>
      {/* Entries this month */}
      {/* lifetime entries */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: Colors.light.greyBg,
    paddingBottom: 100,
  },
  moodContainer: {
    marginTop: 20,
  },
  goalContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },
  card: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderColor: Colors.light.primary,
    borderWidth: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  bigText: {
    fontSize: 18,
    fontFamily: Fonts.primary[600],
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
  topCategories: {
    marginTop: 20,
  },
  categoryRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  progressContainer: {
    flex: 1,
  },
});

export default ChartScreen;
