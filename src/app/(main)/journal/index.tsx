import { useInsertJournal, useJournals } from "@/src/api/journal";
import BackButton from "@/src/components/BackButton";
import Journal from "@/src/components/journal/Journal";
import Toaster from "@/src/components/Snackbar";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { useJournal } from "@/src/providers/JournalProvider";
import { globalStyles } from "@/src/styles/globals";
import { GratitudeEntry } from "@/src/types/journal";
import { datetoLocalString } from "@/src/utils/dateUtils";
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
const { width } = Dimensions.get("window");

const JournalScreen = () => {
  const { profile } = useAuth();
  const { hasWrittenToday } = useJournal();
  const { mutate: insertJournal } = useInsertJournal();
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

    const todayDate = datetoLocalString(new Date());

    const hasWrittenToday = fetchedJournals.find((entry: GratitudeEntry) => {
      const entryDate = datetoLocalString(new Date(entry.created_at));

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
          showToast(error.message, "error");
        },
      }
    );

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
          disabled={true}
          style={[styles.button, styles.disabledBtn]}
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
