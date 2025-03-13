import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Pressable,
  Image,
} from "react-native";

import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import Feather from "@expo/vector-icons/Feather";
import { useMeditate } from "@/src/providers/MeditateProvider";
import { globalStyles } from "@/src/styles/globals";
import { router } from "expo-router";
import { TrackAsset, DurationType } from "@/src/types/meditation";
import { Picker } from "@react-native-picker/picker";
import Track from "@/src/components/meditate/Track";

const MeditateScreen = () => {
  const {
    tracks,
    onTrackPress,
    currentAudio,
    setSelectedDuration,
    selectedDuration,
  } = useMeditate();

  const durations: DurationType[] = [5, 10, 15, 20, 25, 30];

  const handleDurationSelect = (duration: DurationType) => {
    setSelectedDuration(duration);
    // You can add additional logic here, such as updating the context or performing other actions
  };

  const onTrackSelect = (track: TrackAsset) => {
    onTrackPress(track);
    router.push("/(main)/meditate/player");
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Meditation</Text>

      <Pressable style={styles.backBtn}>
        <Feather name="chevron-left" size={32} color={Colors.light.textDark} />
      </Pressable>

      {/* set the duration */}
      <View style={styles.duration}>
        <Text style={globalStyles.subheader}>Set Duration:</Text>
        <Picker
          selectedValue={selectedDuration}
          onValueChange={(itemValue) => setSelectedDuration(itemValue)}
          style={styles.picker}
        >
          {durations.map((duration) => (
            <Picker.Item
              key={duration}
              label={`${duration} minutes`}
              value={duration}
            />
          ))}
        </Picker>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Track track={item} onPress={onTrackSelect} />
        )}
        contentContainerStyle={{ gap: 10, padding: 5, paddingBottom: 80 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.greyBg,
    marginBottom: 10,
  },
  backBtn: {
    position: "absolute",
    top: 32,
    left: 20,
    zIndex: 10,
  },
  duration: {
    marginTop: 16,
    marginBottom: 24,
    display: "flex",
    gap: 8,
  },
  durationAction: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  picker: {
    width: "90%",
    height: 40,
    marginTop: 8,
    marginHorizontal: "auto",
    backgroundColor: "white",
    borderColor: Colors.light.primary,
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default MeditateScreen;
