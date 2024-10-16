import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { globalStyles } from "@/src/styles/globals";
import Fonts from "@/src/constants/Fonts";
import Facts from "@/src/components/Facts";
import Happy from "@/assets/images/emotions/happy.svg";
import Sad from "@/assets/images/emotions/sad.svg";
import Neutral from "@/assets/images/emotions/neutral.svg";
import VeryHappy from "@/assets/images/emotions/very-happy.svg";
import VerySad from "@/assets/images/emotions/very-sad.svg";

const HomeScreen = () => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // 'Tue'
    year: "numeric", // '2025'
    month: "short", // 'Jan'
    day: "numeric", // '25'
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", options);
  return (
    <View style={styles.container}>
      {/* User Profile */}
      <View style={styles.header}>
        <View style={styles.profileContentLeft}>
          <View style={styles.dateContainer}>
            <Feather name="calendar" size={18} color="white" />
            <Text style={{ color: "white" }}>{formattedDate}</Text>
          </View>
          <View>
            <Text
              style={[
                globalStyles.body,
                {
                  color: "white",
                },
              ]}
            >
              Welcome back,
            </Text>
            <Text style={styles.name}>John Doe</Text>
          </View>
        </View>
        <View style={styles.profileContentRight}>
          <Image
            style={styles.avatar}
            source={require("@/assets/images/placeholder/profile.png")}
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {/* Mood Tracking */}
        {/* (?) We might want to make this it's own component */}
        <View style={styles.moodContainer}>
          <Text style={[globalStyles.subheader, { textAlign: "center" }]}>
            How Was Your Mood Today?
          </Text>
          <View style={styles.moods}>
            <Pressable>
              <VerySad width={60} height={60} />
            </Pressable>
            <Pressable>
              <Sad width={60} height={60} />
            </Pressable>
            <Pressable>
              <Neutral width={60} height={60} />
            </Pressable>
            <Pressable>
              <Happy width={60} height={60} />
            </Pressable>
            <Pressable>
              <VeryHappy width={60} height={60} />
            </Pressable>
          </View>
        </View>

        {/* Upcomming self care */}
        <View style={styles.upcomming}></View>

        {/* weeekly progress of self care goals */}
        <View style={styles.progress}></View>

        {/* Fun mental health facts */}
        <Facts />

        {/*** Quick Links ***/}
        {/* Meditate */}
        {/* Gratitude Journal */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.offWhite,
    flex: 1,
  },
  name: {
    color: "white",
    fontFamily: Fonts.primary[600],
    fontSize: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 32,
  },
  header: {
    backgroundColor: Colors.light.primary,
    color: "#fff",
    padding: 32,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  profileContentLeft: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
  },
  profileContentRight: {},
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    color: "white",
  },
  main: {
    flex: 1,
    padding: 15,
    gap: 24,
  },
  moodContainer: {},
  moods: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.quaternary,
    borderRadius: 25,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  upcomming: {},
  progress: {},
});

export default HomeScreen;
