import History from "@/assets/images/goals/history.svg";
import { usePastGoals } from "@/src/api/goals";
import BackButton from "@/src/components/BackButton";
import HistoryCard from "@/src/components/goal/HistoryCard";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { globalStyles } from "@/src/styles/globals";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const HistoryScreen = () => {
  const { profile } = useAuth();

  const { data, error, isLoading } = usePastGoals(profile.id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error fetching history goals...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title}>Goal History</Text>
      <BackButton onPress={() => router.back()} />

      {data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HistoryCard goal={item} />}
          numColumns={1}
          contentContainerStyle={{
            paddingBottom: 120,
            marginTop: 30,
            paddingHorizontal: 5,
          }}
        />
      ) : (
        <View style={styles.noGoals}>
          <History width={325} height={325} />
          <Text style={[globalStyles.title, { color: "#333" }]}>
            No Historical Goals Yet!
          </Text>
        </View>
      )}
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
  noGoals: {
    height: "75%",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
