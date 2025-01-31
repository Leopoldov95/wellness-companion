import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Avatar, TextInput, Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { globalStyles } from "@/src/styles/globals";
const DEFAULT_IMAGE = "@/assets/images/avatars/alien_02.png";

const ProfileScreen = () => {
  const [image, setImage] = useState<string | null>(null);

  // TODO ~ This will need to be update by the ctx
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    console.log("\nform updated!");
    console.log(form);
  }, [form]);

  const handleChange = (field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // TODO ~ Will need to move this over to the Auth Provider
  const onDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete your profile?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          console.log("You want to delete your profile");

          // deleteEntry(entryId);
          // closeModal("Entry deleted.");
        },
      },
    ]);
  };

  const onSave = () => {
    console.log("you want to svae changes");
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Profile</Text>
          <Text>Hi userName!</Text>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={256}
              source={image ? { uri: image } : require(DEFAULT_IMAGE)}
            />
            <Pressable
              style={styles.imgButton}
              android_ripple={{ color: "rgba(0,0,0,0.1)", radius: 30 }}
              onPress={pickImage}
            >
              <Feather name="camera" size={24} color="black" />
            </Pressable>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              label="User Name"
              mode="outlined"
              value={form.username}
              onChangeText={(text) => handleChange("username", text)}
            />
            <TextInput
              style={styles.input}
              label="Email"
              mode="outlined"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
            />
            <TextInput
              style={styles.input}
              label="Password"
              mode="outlined"
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>
          <Button
            buttonColor="#5030af33"
            textColor={Colors.light.tertiary}
            mode="contained"
            disabled={true}
            style={styles.saveButton}
            onPress={onSave}
          >
            Save Changes
          </Button>
          <Button
            buttonColor="#b0002033"
            textColor="#b00020"
            mode="contained"
            style={styles.deleteButton}
            onPress={onDelete}
          >
            Delete Account
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: Colors.light.greyBg,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 20,
    position: "relative",
  },
  imgButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 18,
    backgroundColor: "#ececec",
    borderRadius: 30,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
  },
  input: {
    marginBottom: 6,
  },
  saveButton: {
    width: "100%",
  },
  deleteButton: {
    marginTop: 8,
    width: "100%",
  },
});

export default ProfileScreen;
