import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Happy from "@/assets/images/emotions/colored/happy.svg";
import Sad from "@/assets/images/emotions/colored/sad.svg";
import Neutral from "@/assets/images/emotions/colored/neutral.svg";
import VeryHappy from "@/assets/images/emotions/colored/very-happy.svg";
import VerySad from "@/assets/images/emotions/colored/very-sad.svg";
import { Calendar, DateData } from "react-native-calendars";
import { MoodEntry, moodType } from "@/src/types/mood";
import { globalStyles } from "@/src/styles/globals";

type MoodCalendarProps = {
  moodEntries: MoodEntry[];
  currentMonth: string;
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>;
};

const getMood = (mood: moodType) => {
  switch (mood) {
    case 1:
      return <VerySad width={30} height={30} />;
    case 2:
      return <Sad width={30} height={30} fill="red" />;
    case 3:
      return <Neutral width={30} height={30} fill="red" />;
    case 4:
      return <Happy width={30} height={30} />;
    case 5:
      return <VeryHappy width={30} height={30} />;
  }
};

const getMonthMoodAverage = (
  moods: MoodEntry[],
  month: string
): moodType | null => {
  // Filter entries for the specified month (YYYY-MM)
  const filteredEntries = moods.filter((entry) =>
    new Date(entry.created_at).toISOString().startsWith(month)
  );

  // If no entries found, return 0 to indicate no data
  if (filteredEntries.length === 0) return null;

  // Calculate the sum of moods
  const totalMood = filteredEntries.reduce((sum, entry) => sum + entry.mood, 0);

  const averageMood = Math.round(totalMood / filteredEntries.length);

  // Ensure the value is a valid moodType (1 to 5)
  return (
    averageMood >= 1 && averageMood <= 5 ? averageMood : null
  ) as moodType | null;
};

// Convert mood data to marked dates
const getMarkedDates = (entries: MoodEntry[]) => {
  const marked: Record<
    string,
    { customStyles: { container: object; text: object } }
  > = {};

  entries.forEach((entry) => {
    const dateKey = new Date(entry.created_at).toISOString().split("T")[0];

    marked[dateKey] = {
      customStyles: {
        container: styles.markedContainer,
        text: styles.markedText,
      },
    };
  });

  return marked;
};

const MoodCalendar: React.FC<MoodCalendarProps> = ({
  moodEntries,
  currentMonth,
  setCurrentMonth,
}) => {
  const [moodAverage, setMoodAverage] = useState<moodType | null>(null);

  useEffect(() => {
    setMoodAverage(getMonthMoodAverage(moodEntries, currentMonth));
  }, [currentMonth]);

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        markedDates={getMarkedDates(moodEntries)}
        onMonthChange={(month: DateData) =>
          setCurrentMonth(month.dateString.slice(0, 7))
        }
        dayComponent={({ date, state }: { date: DateData; state: string }) => {
          const moodEntry = moodEntries.find(
            (entry) =>
              new Date(entry.created_at).toISOString().split("T")[0] ===
              date.dateString
          );

          return (
            <View
              style={[
                styles.dayContainer,
                state === "disabled" && styles.disabledDay,
              ]}
            >
              {moodEntry ? (
                <View style={styles.moodIcon}>{getMood(moodEntry.mood)}</View>
              ) : (
                <Text style={styles.dateText}>{date.day}</Text>
              )}
            </View>
          );
        }}
      />

      <View style={styles.moodAverage}>
        <Text style={globalStyles.labelText}>Monthly Mood Average:</Text>
        <Text>{moodAverage ? getMood(moodAverage) : "N/A"}</Text>
      </View>
    </View>
  );
};

export default MoodCalendar;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dayContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  disabledDay: {
    opacity: 0.4, // Makes out-of-month days faded
  },
  markedContainer: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  markedText: {
    color: "black",
    fontWeight: "bold",
  },
  moodIcon: {
    marginTop: 2,
  },
  moodAverage: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
