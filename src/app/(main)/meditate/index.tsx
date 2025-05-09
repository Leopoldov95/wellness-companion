import { FlatList, StyleSheet, Text, View } from "react-native";

import BackButton from "@/src/components/BackButton";
import Track from "@/src/components/meditate/Track";
import Colors from "@/src/constants/Colors";
import { useMeditate } from "@/src/providers/MeditateProvider";
import { globalStyles } from "@/src/styles/globals";
import { DurationType, TrackAsset } from "@/src/types/meditation";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

const MeditateScreen = () => {
  const { tracks, onTrackPress, setSelectedDuration, selectedDuration } =
    useMeditate();

  const durations: DurationType[] = [5, 10, 15, 20, 25, 30];

  const onTrackSelect = (track: TrackAsset) => {
    onTrackPress(track);
    router.push("/(main)/meditate/player");
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Meditation</Text>

      <BackButton onPress={() => router.back()} />

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
        keyExtractor={(item) => item.id.toString()}
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
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: Colors.light.greyBg,
    marginBottom: 10,
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
