/**
 * User Post history page
 * User can see all past posts
 * ? How many posts per page before load more?
 * User can view individual post
 * User can delete indiidual post
 * User can share or unshare a post
 * User can Favortie a post
 * User can sort posts by Recent, Favorite, Shared, Unshared
 */

import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { GratitudeEntry } from "@/src/types/journal";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";
import EntryThumb from "@/src/components/journal/EntryThumb";
import EntryModal from "@/src/components/journal/EntryModal";
import { useJournal } from "@/src/providers/JournalContext";
import { Button, Snackbar } from "react-native-paper";

const EntriesScreen = () => {
  const { entries, toggleFavorite, toggleShare, deleteEntry } = useJournal();
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onDismissSnackBar = () => {
    setMessage(null);
  };

  const openModal = (entryId: number) => {
    setSelectedEntryId(entryId);
  };

  const closeModal = (message?: string) => {
    setSelectedEntryId(null);
    if (message) {
      setMessage(message);
    }
  };

  const selectedEntry = selectedEntryId
    ? entries.find((entry) => entry.id === selectedEntryId)
    : null;

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Your Entriess</Text>

      {/* thumbnails render */}
      <FlatList
        data={entries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <EntryThumb
            item={item}
            index={index}
            onPress={() => openModal(item.id)}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* modal */}
      {selectedEntry && (
        <EntryModal
          isModalVisible={!!selectedEntryId}
          entry={selectedEntry}
          closeModal={closeModal}
          toggleShare={toggleShare}
          toggleFavorite={toggleFavorite}
          deleteEntry={deleteEntry}
          setSelectedEntryId={setSelectedEntryId}
        />
      )}

      {/* snackbar */}
      <Snackbar
        visible={!!message}
        onDismiss={onDismissSnackBar}
        duration={1500}
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: Colors.light.greyBg,
  },
});

export default EntriesScreen;
