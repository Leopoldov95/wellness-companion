import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import facts from "@/src/data/facts.json";
import { Fact } from "../types/fact";
import { globalStyles } from "../styles/globals";
import Fonts from "@/src/constants/Fonts";
import Colors from "@/src/constants/Colors";

const Facts = () => {
  const [randFact, setRandFact] = useState<Fact | null>(null);

  useEffect(() => {
    const fetchRandomFact = () => {
      const randIdx = Math.floor(Math.random() * facts.length);
      setRandFact(facts[randIdx]);
    };

    fetchRandomFact(); // Fetch initial random fact

    const intervalId = setInterval(fetchRandomFact, 15000); // Fetch new fact every 10 seconds

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, []);

  if (!randFact) {
    return null; // Return null if randFact is not yet loaded
  }

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <CountdownCircleTimer
          isPlaying
          duration={14.9}
          colors={[Colors.light.secondary]}
          size={30}
          strokeWidth={3}
          onComplete={() => {
            // do your stuff here
            return { shouldRepeat: true, delay: 0 }; // repeat animation in 1.5 seconds
          }}
        ></CountdownCircleTimer>
      </View>

      <Text style={styles.title}>Did You Know?</Text>
      <View style={styles.fact}>
        <Text style={globalStyles.bodySm}>{randFact.fact}</Text>
        <Text style={styles.source}>{randFact.source}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 32,
    borderColor: Colors.light.secondary,
    borderWidth: 2,
    gap: 4,
  },
  title: {
    fontFamily: Fonts.primary[600],
    textAlign: "center",
  },
  fact: {
    display: "flex",
    gap: 10,
    flexDirection: "column",
  },
  source: {
    fontFamily: Fonts.primary[300],
    fontSize: 12,
    fontStyle: "italic",
  },
  countdownText: {
    fontFamily: Fonts.primary[600],
    fontSize: 20,
    color: Colors.light.secondary,
  },
  countdown: {
    position: "absolute",
    top: 10,
    right: 16,
  },
});

export default Facts;
