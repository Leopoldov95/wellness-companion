import { View, Text } from "react-native";
import React, { useState } from "react";
import { Redirect } from "expo-router";

export default function index() {
  const [user, setUser] = useState(null);
  //TODO ~ check if user has an active session
  // if (!isUserActive) {
  //     return <Redirect  href={"/sign-in"}/>
  // }
  if (!user) {
    return <Redirect href={"/(auth)/welcome"} />;
  }

  return <Redirect href={"/(main)"} />;
}
