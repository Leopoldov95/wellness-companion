import BackButton from "@/src/components/BackButton";
import Journal from "@/src/components/journal/Journal";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { useJournal } from "@/src/providers/JournalProvider";
import { globalStyles } from "@/src/styles/globals";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import { useInsertJournal, useJournals } from "@/src/api/journal";
import { GratitudeEntry } from "@/src/types/journal";
import Toaster from "@/src/components/Snackbar";
const { width } = Dimensions.get("window");

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
  const { profile } = useAuth();
  const { hasWrittenToday, shareJournal } = useJournal();
  const { mutate: insertJournal } = useInsertJournal();
  //const { hasWrittenToday, entries } = useJournal();
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [isWrittenToday, setIsWrittenToday] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const { data: fetchedJournals } = useJournals(profile.id);

  const showToast = (message: string, type: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const toggleSaveModal = () => {
    onJournalSave();
    setSaveModalVisible(false);
  };

  const [entries, setEntries] = useState({
    entry1: "",
    entry2: "",
    entry3: "",
  });

  // check if user already created an entry
  useEffect(() => {
    if (!fetchedJournals || fetchedJournals.length === 0) return;

    const todayDate = new Date().toISOString().split("T")[0];

    const hasWrittenToday = fetchedJournals.find((entry: GratitudeEntry) => {
      const entryDate = new Date(entry.created_at).toISOString().split("T")[0];

      return entryDate === todayDate;
    });

    setIsWrittenToday(!!hasWrittenToday);
  }, [fetchedJournals]);

  const handleInputChange = (text: string, index: number) => {
    setEntries((prev) => ({
      ...prev,
      [`entry${index + 1}`]: text,
    }));
  };

  // need to pass in the flag to determine if it's shared or not
  const onJournalSave = (share: boolean = false) => {
    // call the ctx save method here
    insertJournal(
      {
        userId: profile.id,
        items: [entries.entry1, entries.entry2, entries.entry3],
        is_shared: share,
      },
      {
        onError: (error) => {
          showToast(error.message, "success");
        },
      }
    );

    //TODO clear form and disable button
    setEntries({
      entry1: "",
      entry2: "",
      entry3: "",
    });
  };

  const canSave = entries.entry1 && entries.entry2 && entries.entry3;

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />

      <Text style={globalStyles.title}>Gratitude Journal</Text>

      {/* Journal component */}
      {!hasWrittenToday ? (
        <Journal entries={entries} onInputChange={handleInputChange} />
      ) : (
        <View style={styles.feedbackContainer}>
          <Text style={globalStyles.subheader}>
            You already written your gratitude today!
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
        <Pressable
          style={styles.button}
          onPress={() => router.push("/(main)/journal/shared")}
        >
          <Feather name="users" size={24} color="white" />
          <Text style={styles.buttonText}>Shared</Text>
        </Pressable>
        {/* save the entry */}
        {/*** MUST BE DISABLED IF NO ENTRY */}
        {/* ??? Maybe ask the user to sare anonymously AFTER creating a graiue journal */}
        <Pressable
          style={[
            styles.saveBtn,
            (!canSave || isWrittenToday) && styles.disabledBtn,
          ]}
          onPress={() => setSaveModalVisible(true)}
          disabled={!canSave || isWrittenToday}
        >
          <Feather
            name="save"
            size={24}
            color={canSave ? Colors.light.secondary : "lightgray"}
          />
          <Text
            style={{ color: canSave ? Colors.light.secondary : "lightgray" }}
          >
            Save
          </Text>
        </Pressable>
        {/* option to share anonmysously */}
        {/* See post history */}
        <Pressable
          style={styles.button}
          onPress={() => router.push("/(main)/journal/entries")}
        >
          <Feather name="clock" size={24} color="white" />
          <Text style={styles.buttonText}>History</Text>
        </Pressable>
      </View>

      {/* Snackbar */}
      <Toaster
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />

      <Modal
        isVisible={isSaveModalVisible}
        onBackdropPress={toggleSaveModal}
        animationIn="slideInUp"
        animationOut={"slideOutDown"}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Great Job!</Text>
          <Image
            source={require("@/assets/images/journal/confetti.png")}
            style={styles.image}
            resizeMode="contain"
          />
          {/* share anonymously */}
          {/* TODO~ Flow */}
          {/* 
            1. On Save press the gratide entry gets saved to the DB
            2. IF user clickes the share button, THEN it will share to community
            3. Easiest would be to just use local entry state
          */}
          <Button
            icon="share"
            mode="contained"
            onPress={() => onJournalSave(true)}
            style={styles.shareButton}
          >
            Share Anonymously
          </Button>

          {/* close */}
          <Pressable style={styles.modalButton} onPress={toggleSaveModal}>
            <Text style={styles.modalButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    backgroundColor: Colors.light.greyBg,
  },
  backBtn: {
    position: "absolute",
    top: 10,
    left: 10,
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
    marginTop: 40,
    gap: 10,
  },
  button: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    flex: 1,
    backgroundColor: Colors.light.quinary,
    borderRadius: 32,
    padding: 12,
    gap: 8,
  },
  saveBtn: {
    borderColor: Colors.light.secondary,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 32,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    flex: 2,
  },
  saveBtnText: {
    color: Colors.light.secondary,
  },
  buttonText: {
    color: "white",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: Colors.light.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledBtn: {
    opacity: 0.5,
    borderColor: "lightgray",
  },
  shareButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
});

export default JournalScreen;
