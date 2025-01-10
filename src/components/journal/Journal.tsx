import { View, Text, StyleSheet, Dimensions, TextInput } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";
const { width } = Dimensions.get("window");
import { useJournal } from "@/src/providers/JournalContext";
import Fonts from "@/src/constants/Fonts";
const SPIRAL_COUNT = 15;

const Journal = ({
  entries,
  onInputChange,
}: {
  entries: { [key: string]: string };
  onInputChange: (text: string, index: number) => void;
}) => {
  //const { todayPrompt, hasWrittenToday, entries } = useJournal();
  const { todayPrompt, hasWrittenToday } = useJournal();

  return (
    <View style={styles.journal}>
      {/* Notebook design start */}
      {/* Spiral rings */}
      <View style={styles.spiralContainer}>
        {[...Array(SPIRAL_COUNT)].map((_, index) => (
          <View key={index} style={styles.spiral}>
            <View style={styles.spiralInner} />
          </View>
        ))}
      </View>

      {/* Notebook design end */}
      {/* User prompt */}
      <View style={styles.userInputContainer}>
        {[1, 2, 3].map((bullet, index) => (
          <View key={bullet} style={styles.bulletRow}>
            <Text style={styles.bullet}>{bullet}.</Text>
            <TextInput
              style={styles.input}
              multiline={true}
              placeholder={bullet === 1 ? todayPrompt : "Write Something..."}
              textAlignVertical="top"
              textAlign="left"
              maxLength={50}
              value={entries[`entry${bullet}`]}
              onChangeText={(text) => onInputChange(text, index)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  journal: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 480,
    marginTop: 30,
    borderRadius: 10,
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Box shadow for Android
    elevation: 1,
  },
  spiralContainer: {
    width: 20,
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  spiral: {
    width: 12,
    height: 12,
    borderRadius: 7.5,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  spiralInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  paper: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  line: {
    height: 1,
    backgroundColor: "#bbb",
    marginBottom: 40,
  },
  userInputContainer: {
    position: "absolute",
    top: 0,
    left: 40,
    width: "80%",
    paddingTop: 20,
  },
  bulletRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 10, // Matches the spacing of your notebook lines
    width: "100%",
  },
  bullet: {
    fontSize: 16,
    fontFamily: Fonts.primary[500],
    color: "#000", // Choose a color that contrasts well
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 40, // Adjust to match the height of your notebook lines
    fontFamily: Fonts.primary[500],
    padding: 0,
    height: 65,
  },
});

export default Journal;
