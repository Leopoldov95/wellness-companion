import { useDeleteProfile, useUpdateProfile } from "@/src/api/profile";
import RemoteImage from "@/src/components/RemoteImage";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { AVATARS } from "@/src/constants/Profile";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { globalStyles } from "@/src/styles/globals";
import { Feather } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { Avatar, Button, TextInput } from "react-native-paper";

type UpdateProfileInput = {
  id: string; // user id
  full_name?: string;
  avatar_url?: string;
  password?: string;
};

const ProfileScreen = () => {
  const { profile } = useAuth();

  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: deleteProfile } = useDeleteProfile();
  const [image, setImage] = useState<string | number>(
    profile?.avatar_url || AVATARS.alien_02
  );
  const [imageKey, setImageKey] = useState<string | null>("alien_02");

  const [isExpanded, setIsExpanded] = useState(true);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasChange, setHasChanges] = useState(false);
  // TODO ~ This will need to be update by the ctx
  const [form, setForm] = useState({
    name: profile.full_name,
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    if (profile?.avatar_url) {
      const avatar_url = profile?.avatar_url;
      if (avatar_url.length > 0) {
        if (profile?.avatar_url.startsWith("default:")) {
          // It's a default avatar, like "female_01"
          const avatarKey = avatar_url.replace("default:", "");
          if (avatarKey in AVATARS) {
            const image = AVATARS[avatarKey as keyof typeof AVATARS];
            setImage(image);
          }
        } else {
          // It's an uploaded avatar
          const image = avatar_url;
          setImage(image);
        }
      }
    }
  }, [profile]);

  // need to check if user has made changes
  useEffect(() => {
    if (image !== profile?.avatar_url) {
      setHasChanges(true);
      return;
    }
    if (form.name.trim() !== profile?.full_name.trim()) {
      setHasChanges(true);
      return;
    }

    if (form.password.length > 1 || form.passwordConfirm.length > 1) {
      setHasChanges(true);
      return;
    }

    setHasChanges(false);
  }, [form, image]);

  const handleChange = (field: string, value: string) => {
    setErrors("");
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

  const uploadImage = async () => {
    if (!image || typeof image !== "string" || !image.startsWith("file://")) {
      // no image selected, or it's a local asset (not a file:// upload)
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${Crypto.randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
    if (error) {
      console.log(error);
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
          deleteProfile(profile.id);
          supabase.auth.signOut();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  const onSave = async () => {
    setLoading(true);

    const updates: UpdateProfileInput = {
      id: profile.id,
    };

    if (!validateInput()) {
      setLoading(false);
      return;
    }

    if (form.name.trim() !== profile?.full_name.trim()) {
      updates.full_name = form.name.trim();
    }

    if (form.password.length > 0) {
      updates.password = form.password;
    }

    if (image !== profile?.avatar_url) {
      let userImagePath = "";

      // user has selected default profile
      if (imageKey !== null && typeof image === "number") {
        userImagePath = `default:${imageKey}`;
      }
      if (typeof image === "string") {
        const imagePath = await uploadImage();
        if (!imagePath) {
          setErrors("Issue uploading image.");
          return;
        }
        userImagePath = imagePath;
      }

      updates.avatar_url = userImagePath;
    }

    // call DB here
    updateProfile(updates, {
      onError: (error) => {
        console.log("something wrong...");

        console.log(error);
      },
    });

    setLoading(false);
  };

  const validateInput = () => {
    const { password, passwordConfirm, name } = form;

    if (!name) {
      setErrors("Name cannot be empty");
      return false;
    }

    // only need to worry about password change if user has updated it
    if (password.length > 0 || passwordConfirm.length > 0) {
      if (password !== passwordConfirm) {
        setErrors("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Stack.Screen options={{ title: "Profile" }} />

        <View style={styles.container}>
          <Text>Hi {profile?.full_name}!</Text>

          <View style={styles.avatarContainer}>
            {image.toString().startsWith("default:") ||
            !isNaN(Number(image)) ? (
              <Avatar.Image
                size={196}
                source={typeof image === "string" ? { uri: image } : image}
              />
            ) : (
              <RemoteImage
                fallback={image.toString()}
                path={profile?.avatar_url}
                style={styles.profile}
                resizeMode="cover"
              />
            )}

            <Pressable
              style={styles.imgButton}
              android_ripple={{ color: "rgba(0,0,0,0.1)", radius: 30 }}
              onPress={pickImage}
            >
              <Feather name="camera" size={24} color="black" />
            </Pressable>
          </View>
          <View style={styles.avatarContainer}>
            <Pressable onPress={toggleAccordion} style={styles.accordionHeader}>
              <Text style={styles.label}>Choose Avatar Instead</Text>

              <Feather
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color="black"
              />
            </Pressable>
            <Collapsible collapsed={!isExpanded}>
              <View style={styles.avatarWrapper}>
                {Object.entries(AVATARS).map(([key, image]) => (
                  <Pressable
                    onPress={() => {
                      setImage(image);
                      setImageKey(key);
                      toggleAccordion();
                    }}
                    key={key}
                  >
                    <Image
                      resizeMode="cover"
                      source={image}
                      style={styles.avatar}
                    />
                  </Pressable>
                ))}
              </View>
            </Collapsible>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              label="Name"
              mode="outlined"
              value={form.name}
              onChangeText={(text) => handleChange("name", text)}
            />

            <TextInput
              style={styles.input}
              label="New Password"
              mode="outlined"
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TextInput
              style={styles.input}
              label="New Password Confirmation"
              mode="outlined"
              value={form.passwordConfirm}
              onChangeText={(text) => handleChange("passwordConfirm", text)}
            />
          </View>
          <Text style={styles.error}>{errors}</Text>
          <Button
            buttonColor="#5030af33"
            textColor={Colors.light.tertiary}
            mode="contained"
            disabled={loading || !hasChange}
            style={styles.saveButton}
            onPress={onSave}
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
          <Button
            buttonColor="#fff"
            textColor={Colors.light.quinary}
            mode="outlined"
            style={{
              marginTop: 8,
              width: "100%",
              borderColor: Colors.light.quinary,
            }}
            onPress={() => supabase.auth.signOut()}
            disabled={loading}
          >
            Sign Out
          </Button>
          <Button
            buttonColor="#b0002033"
            textColor="#b00020"
            mode="contained"
            style={styles.deleteButton}
            onPress={onDelete}
            disabled={loading}
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
  error: {
    color: "red",
    marginBottom: 10,
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
  avatar: {
    width: 80,
    height: 80,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 40,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatarWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: "auto",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    rowGap: 10,
  },
  label: {
    color: Colors.light.text,
    fontFamily: Fonts.primary[400],
    fontSize: 16,
  },
  profile: {
    width: 196,
    height: 196,
    aspectRatio: 1,
    borderRadius: 98,
    overflow: "hidden",
  },
});

export default ProfileScreen;
