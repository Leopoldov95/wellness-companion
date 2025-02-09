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

import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";
import EntryThumb from "@/src/components/journal/EntryThumb";
import EntryModal from "@/src/components/journal/EntryModal";
import { useJournal } from "@/src/providers/JournalProvider";
import { Snackbar } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import EntryFilter from "@/src/components/journal/EntryFilter";
import {
  FilterOptions,
  GratitudeEntry,
  SortOptions,
} from "@/src/types/journal";
import { filterEntries, sortEntries } from "@/src/services/journalService";

const EntriesScreen = () => {
  const { entries, toggleFavorite, toggleShare, deleteEntry } = useJournal();
  const [filteredEntries, setFilteredEntries] = useState<GratitudeEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOptions>("newest");
  const [filters, setFilters] = useState<FilterOptions>({
    favorite: false,
    shared: false,
  });

  useEffect(() => {
    // to avoid managing to much state management, let's update the filteredEntries whwnever there is an update to te entries
    setFilteredEntries(entries);
    // filter
    setFilteredEntries(filterEntries(entries, filters));
    // run the sort option
    setFilteredEntries(sortEntries(entries, selectedSort));

    //
  }, [entries]);

  // sorting
  useEffect(() => {
    console.log("sorting changed!");
    console.log(selectedSort);
    setFilteredEntries(sortEntries(entries, selectedSort));
  }, [selectedSort]);

  // filtering
  useEffect(() => {
    console.log("filtered updated");
    console.log(filters);

    setFilteredEntries(filterEntries(entries, filters));
  }, [filters]);

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

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
    ? filteredEntries.find((entry) => entry.id === selectedEntryId)
    : null;

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Your Entriess</Text>

      {/* user sort */}
      <View style={styles.filterBtnContainer}>
        <Pressable
          onPress={toggleFilterModal}
          style={styles.filterButton}
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
        >
          <Ionicons name="filter" size={24} color={Colors.light.text} />
        </Pressable>
      </View>

      {/* thumbnails render */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <EntryThumb
            item={item}
            index={index}
            onPress={() => openModal(item.id)}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 120, marginTop: 20 }}
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

      {/* modal for filter */}
      <EntryFilter
        isFilterModalVisible={isFilterModalVisible}
        toggleFilterModal={toggleFilterModal}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        filters={filters}
        setFilters={setFilters}
      />
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
  filterButton: {
    borderColor: Colors.light.text,
    borderWidth: 1,
    padding: 8,
    display: "flex",
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  filterBtnContainer: {
    marginTop: 15,
  },
});

export default EntriesScreen;
