import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Fonts from "@/src/constants/Fonts";
import { Checkbox } from "react-native-paper";
import Modal from "react-native-modal";
import Colors from "@/src/constants/Colors";

type Filter = {
  favorite: boolean;
  shared: boolean;
};

type SortOptions = "newest" | "oldest" | "favorite" | "shared";

type EntryFilterProps = {
  isFilterModalVisible: boolean;
  toggleFilterModal: () => void;
  selectedSort: SortOptions;
  setSelectedSort: React.Dispatch<React.SetStateAction<SortOptions>>;
  filters: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
};

const EntryFilter: React.FC<EntryFilterProps> = ({
  isFilterModalVisible,
  toggleFilterModal,
  selectedSort,
  setSelectedSort,
  filters,
  setFilters,
}) => {
  return (
    <Modal
      isVisible={isFilterModalVisible}
      onBackdropPress={toggleFilterModal}
      animationIn="slideInRight"
      animationOut={"slideOutRight"}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        {/* close */}
        <Pressable onPress={toggleFilterModal}>
          <Text style={styles.modalCloseText}>Close</Text>
        </Pressable>

        {/* Sort By */}
        <View style={styles.filterRowContainer}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.sortRow}>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              onPress={() => setSelectedSort("newest")}
              style={[
                styles.filterOption,
                selectedSort === "newest" && styles.selected,
              ]}
            >
              <Text style={selectedSort === "newest" && styles.selectedText}>
                Newest
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              onPress={() => setSelectedSort("oldest")}
              style={[
                styles.filterOption,
                selectedSort === "oldest" && styles.selected,
              ]}
            >
              <Text style={selectedSort === "oldest" && styles.selectedText}>
                Oldest
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              onPress={() => setSelectedSort("favorite")}
              style={[
                styles.filterOption,
                selectedSort === "favorite" && styles.selected,
              ]}
            >
              <Text style={selectedSort === "favorite" && styles.selectedText}>
                Favorite
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              onPress={() => setSelectedSort("shared")}
              style={[
                styles.filterOption,
                selectedSort === "shared" && styles.selected,
              ]}
            >
              <Text style={selectedSort === "shared" && styles.selectedText}>
                Shared
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.filterRowContainer}>
          <Text style={styles.filterLabel}>Filter By</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={filters.favorite ? "checked" : "unchecked"}
              onPress={() => {
                setFilters({ ...filters, favorite: !filters.favorite });
              }}
            />
            <Text style={styles.checkboxLabel}>Favorite</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={filters.shared ? "checked" : "unchecked"}
              onPress={() => {
                setFilters({ ...filters, shared: !filters.shared });
              }}
            />
            <Text style={styles.checkboxLabel}>Shared</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EntryFilter;

const styles = StyleSheet.create({
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
  sortRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  filterOption: {
    borderColor: Colors.light.secondary,
    borderWidth: 1,
    width: "25%",
    display: "flex",
    alignItems: "center",
    padding: 16,
  },
  filterRowContainer: {
    marginTop: 8,
    marginBottom: 4,
    display: "flex",
    alignItems: "flex-start",

    width: "100%",
  },
  filterLabel: {
    fontFamily: Fonts.primary[500],
    fontSize: 16,
    marginBottom: 8,
  },
  modalCloseText: {
    fontFamily: Fonts.seconday[700],
    fontSize: 18,
    color: Colors.light.tertiary,
  },
  selected: {
    backgroundColor: Colors.light.secondary,
  },
  selectedText: {
    color: "#fff",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  checkboxLabel: {
    fontFamily: Fonts.primary[400],
    fontSize: 16,
  },
});
