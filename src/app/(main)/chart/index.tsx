import { useMoodList } from "@/src/api/moods";
import GoalProgressBar from "@/src/components/goal/GoalProgressBar";
import MoodCalendar from "@/src/components/mood/MoodCalendar";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { useAuth } from "@/src/providers/AuthProvider";
import { globalStyles } from "@/src/styles/globals";
import { dateToYearMonth } from "@/src/utils/dateUtils";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const ChartScreen = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(
    dateToYearMonth(new Date())
  );
  const { profile } = useAuth();
  const { data: fetchedMoods, error, isLoading } = useMoodList(profile.id);

  if (error) {
    console.warn("ERROR");
  }

  if (isLoading) {
    console.warn("LOADING");
  }

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
            <Text style={styles.bigText}>17</Text>
          </View>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Completed:</Text>
            <Text style={styles.bigText}>46%</Text>
          </View>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Weekly Goals:</Text>
            <Text style={styles.bigText}>36</Text>
          </View>
        </View>
        <View style={styles.topCategories}>
          <View style={styles.categoryRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Skbidi</Text>
            </View>
            <View style={styles.progressContainer}>
              <GoalProgressBar progress={87} color={Colors.light.primary} />
            </View>
          </View>
          {/*  */}
          <View style={styles.categoryRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Skbidi</Text>
            </View>
            <View style={styles.progressContainer}>
              <GoalProgressBar progress={87} color={Colors.light.primary} />
            </View>
          </View>
          {/*  */}
          <View style={styles.categoryRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Skbidi</Text>
            </View>
            <View style={styles.progressContainer}>
              <GoalProgressBar progress={87} color={Colors.light.primary} />
            </View>
          </View>
          {/*  */}
          <View style={styles.categoryRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Skbidi</Text>
            </View>
            <View style={styles.progressContainer}>
              <GoalProgressBar progress={87} color={Colors.light.primary} />
            </View>
          </View>
          {/*  */}
          <View style={styles.categoryRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Skbidi</Text>
            </View>
            <View style={styles.progressContainer}>
              <GoalProgressBar progress={87} color={Colors.light.primary} />
            </View>
          </View>
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
            <Text style={styles.bigText}>7</Text>
          </View>
          <View style={styles.card}>
            <Text style={globalStyles.labelText}>Total Entries:</Text>
            <Text style={styles.bigText}>46</Text>
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
