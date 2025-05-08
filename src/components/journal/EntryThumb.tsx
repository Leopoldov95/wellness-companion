import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { GratitudeEntry } from "@/src/types/journal";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

interface EntryThumbProps {
  item: GratitudeEntry;
  image: ImageSourcePropType;
  onPress: () => void;
}

const EntryThumb: React.FC<EntryThumbProps> = ({ item, image, onPress }) => {
  return (
    <View style={styles.entryContainer}>
      <Image resizeMode="contain" source={image} style={styles.image} />
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "rgba(0,0,0,0.1)" }}
        style={styles.entryContent}
      >
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

        <Text style={styles.date}>{item.created_at.toLocaleDateString()}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
    borderRadius: 20,
  },
  entryContainer: {
    marginBottom: 16,
    aspectRatio: 1,
    width: ITEM_WIDTH,
    position: "relative",
    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius
    // Android Shadow
    elevation: 3,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
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
    fontSize: 10,
    marginBottom: 4,
    fontFamily: Fonts.primary[400],
  },
  entryHeart: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  date: {
    textAlign: "center",
    marginTop: "auto",
  },
});

export default EntryThumb;
