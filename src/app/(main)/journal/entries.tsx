import {
  useDeleteJournal,
  useJournals,
  useUpdateJournal,
} from "@/src/api/journal";
import BackButton from "@/src/components/BackButton";
import EntryFilter from "@/src/components/journal/EntryFilter";
import EntryModal from "@/src/components/journal/EntryModal";
import EntryThumb from "@/src/components/journal/EntryThumb";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { globalStyles } from "@/src/styles/globals";
import {
  FilterOptions,
  GratitudeEntry,
  SortOptions,
} from "@/src/types/journal";
import { filterEntries, sortEntries } from "@/src/utils/journalUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";

// Dynamic bg images
const BG_IMG = [
  require("@/assets/images/journal/entries/entry-bg-1.png"),
  require("@/assets/images/journal/entries/entry-bg-2.png"),
  require("@/assets/images/journal/entries/entry-bg-3.png"),
  require("@/assets/images/journal/entries/entry-bg-4.png"),
  require("@/assets/images/journal/entries/entry-bg-5.png"),
  require("@/assets/images/journal/entries/entry-bg-6.png"),
  require("@/assets/images/journal/entries/entry-bg-7.png"),
  require("@/assets/images/journal/entries/entry-bg-8.png"),
  require("@/assets/images/journal/entries/entry-bg-9.png"),
  require("@/assets/images/journal/entries/entry-bg-10.png"),
  require("@/assets/images/journal/entries/entry-bg-11.png"),
  require("@/assets/images/journal/entries/entry-bg-12.png"),
  require("@/assets/images/journal/entries/entry-bg-13.png"),
];

const EntriesScreen = () => {
  const { profile } = useAuth();
  const [filteredEntries, setFilteredEntries] = useState<GratitudeEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [modalImg, setModalImg] = useState<ImageSourcePropType>(BG_IMG[0]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOptions>("newest");
  const [filters, setFilters] = useState<FilterOptions>({
    favorite: false,
    shared: false,
  });

  const { data: fetchedJournals, isLoading, isError } = useJournals(profile.id);
  const { mutate: updateJournal } = useUpdateJournal();
  const { mutate: deleteJournal } = useDeleteJournal();

  useEffect(() => {
    if (!fetchedJournals) return;
    // to avoid managing to much state management, let's update the filteredEntries whwnever there is an update to te entries
    setFilteredEntries(fetchedJournals);
    // filter
    setFilteredEntries(filterEntries(fetchedJournals, filters));
    // run the sort option
    setFilteredEntries(sortEntries(fetchedJournals, selectedSort));

    //
  }, [fetchedJournals]);

  // sorting
  useEffect(() => {
    if (!fetchedJournals) return;
    setFilteredEntries(sortEntries(fetchedJournals, selectedSort));
  }, [selectedSort]);

  // filtering
  useEffect(() => {
    if (!fetchedJournals) return;
    setFilteredEntries(filterEntries(fetchedJournals, filters));
  }, [filters]);

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const onDismissSnackBar = () => {
    setMessage(null);
  };

  const openModal = (entryId: number, index: number) => {
    setSelectedEntryId(entryId);
    setModalImg(BG_IMG[index]);
  };

  const closeModal = (message?: string) => {
    setSelectedEntryId(null);
    if (message) {
      setMessage(message);
    }
  };

  const onShareToggle = (entryId: number) => {
    // save put
    const entry = fetchedJournals?.find((entry) => entry.id === entryId);
    if (entry) {
      updateJournal({
        id: entryId,
        is_shared: !entry?.isShared,
      });
    }
  };

  const onFavoriteToggle = (entryId: number) => {
    // save put
    const entry = fetchedJournals?.find((entry) => entry.id === entryId);
    if (entry) {
      updateJournal({
        id: entryId,
        is_favorite: !entry?.isFavorite,
      });
    }
  };

  const onDelete = (entryId: number) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this gratitude entry?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteJournal(entryId);
            setSelectedEntryId(null);
          },
        },
      ]
    );
  };

  const selectedEntry = selectedEntryId
    ? filteredEntries.find((entry) => entry.id === selectedEntryId)
    : null;

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      <Text style={globalStyles.title}>Your Entries</Text>

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
        data={fetchedJournals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <EntryThumb
            item={item}
            image={BG_IMG[index]}
            onPress={() => openModal(item.id, index)}
          />
        )}
        numColumns={2}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 20,
          paddingHorizontal: 10,
        }}
        columnWrapperStyle={{ columnGap: 10 }}
      />

      {/* modal */}
      {selectedEntry && (
        <EntryModal
          isModalVisible={!!selectedEntryId}
          entry={selectedEntry}
          image={modalImg}
          closeModal={closeModal}
          toggleShare={onShareToggle}
          toggleFavorite={onFavoriteToggle}
          deleteEntry={onDelete}
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
    paddingHorizontal: 20,
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
