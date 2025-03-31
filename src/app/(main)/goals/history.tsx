import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import { globalStyles } from "@/src/styles/globals";
import { useGoals } from "@/src/providers/GoalsProvider";
import { GetCategoryImage } from "@/src/components/goal/GetCategoryImage";
import GoalProgressBar from "@/src/components/goal/GoalProgressBar";
import { dateToReadible } from "@/src/utils/dateUtils";
import { FontAwesome6 } from "@expo/vector-icons";
import BackButton from "@/src/components/BackButton";
import { router } from "expo-router";
import Fonts from "@/src/constants/Fonts";
import HistoryCard from "@/src/components/goal/HistoryCard";

const HistoryScreen = () => {
  const { goals } = useGoals();

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Goal History</Text>
      <BackButton onPress={() => router.back()} />

      <FlatList
        data={goals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <HistoryCard goal={item} />}
        numColumns={1}
        contentContainerStyle={{
          paddingBottom: 120,
          marginTop: 30,
          paddingHorizontal: 5,
        }}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 20,
    backgroundColor: Colors.light.greyBg,
  },
});
