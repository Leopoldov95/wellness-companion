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

const DUMMYDATA: GratitudeEntry[] = [
  {
    id: 0,
    userId: 123,
    items: ["abc", "sdsd", "sdsd"],
    date: "12/23/32",
    isFavorite: false,
    isShared: false,
  },
  {
    id: 11,
    userId: 123,
    items: ["grateful1", "blessed1", "happy1"],
    date: "01/11/25",
    isFavorite: false,
    isShared: true,
  },
  {
    id: 12,
    userId: 123,
    items: ["grateful2", "blessed2", "happy2"],
    date: "01/11/25",
    isFavorite: true,
    isShared: false,
  },
  {
    id: 13,
    userId: 123,
    items: ["grateful3", "blessed3", "happy3"],
    date: "01/11/25",
    isFavorite: false,
    isShared: false,
  },
  {
    id: 14,
    userId: 123,
    items: ["grateful4", "blessed4", "happy4"],
    date: "01/11/25",
    isFavorite: true,
    isShared: true,
  },
  {
    id: 15,
    userId: 123,
    items: ["grateful5", "blessed5", "happy5"],
    date: "01/11/25",
    isFavorite: false,
    isShared: true,
  },
  {
    id: 16,
    userId: 123,
    items: ["grateful6", "blessed6", "happy6"],
    date: "01/11/25",
    isFavorite: false,
    isShared: true,
  },
  {
    id: 17,
    userId: 123,
    items: ["grateful7", "blessed7", "happy7"],
    date: "01/11/25",
    isFavorite: true,
    isShared: false,
  },
  {
    id: 18,
    userId: 123,
    items: ["grateful8", "blessed8", "happy8"],
    date: "01/11/25",
    isFavorite: true,
    isShared: true,
  },
  {
    id: 19,
    userId: 123,
    items: ["grateful9", "blessed9", "happy9"],
    date: "01/11/25",
    isFavorite: false,
    isShared: false,
  },
  {
    id: 20,
    userId: 123,
    items: ["grateful10", "blessed10", "happy10"],
    date: "01/11/25",
    isFavorite: false,
    isShared: true,
  },
];

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ListRenderItem,
  Image,
} from "react-native";
import React from "react";
import { GratitudeEntry } from "@/src/types/journal";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";

const renderNote: ListRenderItem<GratitudeEntry> = ({ item, index }) => {
  const images = {
    1: require("@/assets/images/journal/notes/note-1.png"),
    2: require("@/assets/images/journal/notes/note-2.png"),
    3: require("@/assets/images/journal/notes/note-3.png"),
    4: require("@/assets/images/journal/notes/note-4.png"),
    5: require("@/assets/images/journal/notes/note-5.png"),
  };
  const imageIndex = (index % 5) + 1;
  return (
    <View style={styles.entryContainer}>
      <Image
        resizeMode="contain"
        source={images[imageIndex]}
        style={styles.image}
      />
      <View style={styles.entryContent}></View>
    </View>
  );
};

const EntriesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Your Entries</Text>
      <FlatList
        data={DUMMYDATA}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNote}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 120 }}
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
  image: {
    width: "100%",
    height: "100%",
  },
  entryContainer: {
    aspectRatio: 1,
    width: "50%",
    position: "relative",
  },
  entryContent: {},
});

export default EntriesScreen;
