import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ListRenderItem,
  Image,
  Pressable,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { GratitudeEntry } from "@/src/types/journal";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";
import Fonts from "@/src/constants/Fonts";
import AntDesign from "@expo/vector-icons/AntDesign";

interface EntryThumbProps {
  item: GratitudeEntry;
  index: number;
  onPress: () => void;
}

const EntryThumb: React.FC<EntryThumbProps> = ({ item, index, onPress }) => {
  const images = {
    1: require("@/assets/images/journal/notes/note-1.png"),
    2: require("@/assets/images/journal/notes/note-2.png"),
    3: require("@/assets/images/journal/notes/note-3.png"),
    4: require("@/assets/images/journal/notes/note-4.png"),
    5: require("@/assets/images/journal/notes/note-5.png"),
  };
  const imageIndex = (index % 5) + 1;

  const openModal = () => {
    console.log("hello test");
  };
  return (
    <View style={styles.entryContainer}>
      <Image
        resizeMode="contain"
        source={images[imageIndex]}
        style={styles.image}
      />
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "rgba(0,0,0,0.1)" }}
        style={styles.entryContent}
      >
        {/* favorite action */}
        {/* ! Moving to Modal */}
        {/* <Pressable style={styles.entryFavorite}>
          <AntDesign name="heart" size={16} color={Colors.light.red} />
          <AntDesign name="hearto" size={24} color={Colors.light.red} />
        </Pressable> */}
        <FlatList
          data={item.items}
          renderItem={({ item, index }) => (
            <Text style={styles.entryText}>
              {index + 1}. {item}
            </Text>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        {item.isFavorite && (
          <AntDesign
            style={styles.entryHeart}
            name="heart"
            size={16}
            color={Colors.light.red}
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  entryContainer: {
    aspectRatio: 1,
    width: "50%",
    position: "relative",
  },
  entryContent: {
    position: "absolute",
    zIndex: 10,
    top: 5,
    left: 5,
    padding: 12,
    overflow: "hidden",
    height: "95%",
    width: "95%",
  },
  entryText: {
    fontSize: 8,
    marginBottom: 4,
    fontFamily: Fonts.primary[400],
  },
  entryHeart: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default EntryThumb;
