import { StyleSheet, Text, View } from "react-native";
import { Router } from "expo-router";
import React from "react";

/**
 * TODO - Behavior
 * ! 03/22 - this might be redundant
 * We want a way to edit the weekly goal, shit we'll need to set how many action items per week (max once per day)
 * We need a way to create or modify a weekly goal (we'll need a way to link this from the goal screen)
 * ** Maybe make a pop-up on goal creation to handle this?
 * So we'll want a componnet for user to 'complete' daily task
 * We'll want a component to create/edit weekly Goal
 *
 * This page will primarily be for create/edit
 * Make use of router
 */

const WeeklyGoalScreen = () => {
  return (
    <View>
      <Text>WeeklyGoalScreen</Text>
    </View>
  );
};

export default WeeklyGoalScreen;

const styles = StyleSheet.create({});
