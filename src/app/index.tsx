import { View, Text } from "react-native";
import React, { useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { ActivityIndicator } from "react-native-paper";

export default function index() {
  const { session, loading } = useAuth();
  // const [user, setUser] = useState(null);

  if (loading) {
    return <ActivityIndicator />;
  }
  //TODO ~ check if user has an active session
  if (!session) {
    return <Redirect href={"/(auth)/welcome"} />;
  }
  // if (!user) {
  //   return <Redirect href={"/(auth)/sign-in"} />;
  // }

  return <Redirect href={"/(main)"} />;
}
