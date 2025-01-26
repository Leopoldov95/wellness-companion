import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Image,
  FlatList,
  Alert,
} from "react-native";
import React from "react";
import { GratitudeEntry } from "@/src/types/journal";
import Fonts from "@/src/constants/Fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Colors from "@/src/constants/Colors";
import { Feather } from "@expo/vector-icons";

interface EntryModalProps {
  entry: GratitudeEntry;
  isModalVisible: boolean;
  closeModal: (message?: string) => void;
  toggleFavorite: (entryId: number) => void;
  toggleShare: (entryId: number) => void;
  deleteEntry: (entryId: number) => void;
  setSelectedEntryId: React.Dispatch<React.SetStateAction<number | null>>;
}

const EntryModal: React.FC<EntryModalProps> = ({
  entry,
  isModalVisible,
  toggleFavorite,
  toggleShare,
  deleteEntry,
  setSelectedEntryId,
  closeModal,
}) => {
  const onToggleShare = (entryId: number) => {
    toggleShare(entryId);
    closeModal("Shared status updated.");
  };

  const onToggleFavorite = (entryId: number) => {
    toggleFavorite(entryId);
    closeModal("Favorite status updated");
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
            deleteEntry(entryId);
            closeModal("Entry deleted.");
          },
        },
      ]
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => closeModal()}
    >
      <View style={styles.modalContainer}>
        <Image
          resizeMode="cover"
          source={require("@/assets/images/journal/notes/note-1.png")}
          style={styles.image}
        />
        <View style={styles.modalContent}>
          <FlatList
            data={entry.items}
            renderItem={({ item, index }) => (
              <Text style={styles.entryText}>
                {index + 1}. {item}
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          {/* actions */}
          <View style={styles.modalActions}>
            <Pressable
              onPress={() => onToggleShare(entry.id)}
              android_ripple={{ color: "rgba(0,0,0,0.1)", radius: 30 }}
              style={styles.modalButton}
            >
              {entry.isShared ? (
                <MaterialCommunityIcons name="share" size={32} color="black" />
              ) : (
                <MaterialCommunityIcons
                  name="share-off"
                  size={32}
                  color="black"
                />
              )}
            </Pressable>
            <Pressable
              onPress={() => onToggleFavorite(entry.id)}
              android_ripple={{ color: "rgba(0,0,0,0.1)", radius: 30 }}
              style={styles.modalButton}
            >
              {entry.isFavorite ? (
                <AntDesign name="heart" size={32} color={Colors.light.red} />
              ) : (
                <AntDesign name="hearto" size={32} color={Colors.light.red} />
              )}
            </Pressable>
            <Pressable
              onPress={() => onDelete(entry.id)}
              android_ripple={{ color: "rgba(0,0,0,0.1)", radius: 30 }}
              style={styles.modalButton}
            >
              <Feather name="trash-2" size={32} color="red" />
            </Pressable>
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)", radius: 30 }}
              onPress={() => closeModal()}
              style={styles.modalButton}
            >
              <AntDesign name="close" size={32} color="black" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EntryModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  modalContent: {
    position: "absolute",
    top: "25%",
    left: 0,
    padding: 20,
    paddingBottom: 40,
    height: "50%",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "50%",
    aspectRatio: 1,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: Fonts.primary[500],
  },
  modalActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  modalButton: {
    padding: 12,
    borderRadius: 40,
    borderColor: Colors.light.text,
    borderWidth: 1,
    overflow: "hidden",
  },
});
