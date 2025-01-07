import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";
const { width } = Dimensions.get("window");
import { useJournal } from "@/src/providers/JournalContext";
import Fonts from "@/src/constants/Fonts";
import Journal from "@/src/components/journal/Journal";
import Feather from "@expo/vector-icons/Feather";
const SPIRAL_COUNT = 15;

//*TODO
//* MUST HAVES
// 1. We'll need to load/use the JSON prompt data to give users a prompt to help them start writing things down. It should show a new one daily (and not on page refesh)
// 2. Users can only write one gratude entry per day
// 3. Users can only wrtie 3 things they are grateful for.
//? What should be the character limit
// 3. We'll want a way for users to see their past gratitude journals
//? Should this be a new page or modal?
// 4. Users have the option to share their gratitudes anonymously after writing an entry
// 5. Users have a way to view anonymized posts
//? Should this be a new page?
//! Must be unique (user's should not be able to see the same gratidue entry twice). We'll need a flag for this
//! Users can "save" their favrotie gratitude entries
//! Entries are sorted from newest to oldest (unseen)
//! If a user has seen all unseen new entries, it will just restart
//* NICE TO HAVE
// 1. Gratidue jounral background can be dynamic with SVG graphics
// 2. Users can have 'avatars' for sharing as an additional bonus

const JournalScreen = () => {
  const { hasWrittenToday, entries } = useJournal();

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Gratitude Journal</Text>

      {/* Journal component */}
      {!hasWrittenToday ? (
        <Journal />
      ) : (
        <View style={styles.feedbackContainer}>
          <Text style={globalStyles.subheader}>
            You already written your gratidue today!
          </Text>
          <Image
            source={require("@/assets/images/journal/notebook.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.actionsContainer}>
        {/* View community posts */}
        <Pressable style={styles.journalAction}>
          <Feather name="users" size={24} color="black" />
          <Text>Community</Text>
        </Pressable>
        {/* save the entry */}
        {/*** MUST BE DISABLED IF NO ENTRY */}
        {/* ??? Maybe ask the user to sare anonymously AFTER creating a graiue journal */}
        <Pressable>
          <Feather name="save" size={24} color="black" />
          <Text>Save</Text>
        </Pressable>
        {/* option to share anonmysously */}
        {/* See post history */}
        <Pressable style={styles.journalAction}>
          <Feather name="clock" size={24} color="black" />
          <Text>History</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: Colors.light.greyBg,
  },
  feedbackContainer: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#ececec",
    borderRadius: 40,
    marginTop: 20,
    paddingTop: 20,
    height: 480,
    gap: 80,
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
  image: {
    width: 120,
    height: 120,
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  journalAction: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    width: 80,
    backgroundColor: "red",
    borderRadius: 30,
    padding: 10,
  },
});

export default JournalScreen;
