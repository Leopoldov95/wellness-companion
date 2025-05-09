import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { AVATARS } from "@/src/constants/Profile";
import { supabase } from "@/src/lib/supabase";
import { globalStyles } from "@/src/styles/globals";
import Feather from "@expo/vector-icons/Feather";
import { decode } from "base64-arraybuffer";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";

const DEFAULT_IMAGE = AVATARS.alien_02;

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [image, setImage] = useState<string | number>(DEFAULT_IMAGE);
  const [imageKey, setImageKey] = useState<string | null>("alien_02");
  const [isExpanded, setIsExpanded] = useState(true);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });
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
      setImageKey(null);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  async function signUpWithEmail() {
    setLoading(true);

    if (!validateInput()) {
      setLoading(false);
      return;
    }
    let userImagePath = "";

    // user has selected default profile
    if (imageKey !== null && typeof image === "number") {
      userImagePath = `default:${imageKey}`;
    }
    if (imageKey === null && typeof image === "string") {
      const imagePath = await uploadImage();
      if (!imagePath) {
        setErrors("Issue uploading image.");
        return;
      }
      userImagePath = imagePath;
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name, // must match what the trigger expects
          avatar_url: userImagePath,
        },
      },
    });

    if (error) {
      console.log(error);

      Alert.alert(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);

    //* no need for manual redirect as session handler takes care of that
  }

  const validateInput = () => {
    const { email, password, passwordConfirm, name } = form;
    if (!email) {
      setErrors("Email is Required");
      return false;
    }

    // check email validity
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      setErrors("Email is invalid");
      return false;
    }

    if (!name) {
      setErrors("Name is Required");
      return false;
    }

    if (!password) {
      setErrors("Password is required");
      return false;
    }

    if (!passwordConfirm) {
      setErrors("Password is required");
      return false;
    }

    if (password !== passwordConfirm) {
      setErrors("Passwords do not match");
      return false;
    }

    return true;
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign In" }} />

      <View style={styles.header}>
        <Text style={globalStyles.title}>Create Account</Text>
      </View>

      <Image
        source={typeof image === "string" ? { uri: image } : image}
        style={styles.image}
      />

      <Text
        onPress={pickImage}
        style={[globalStyles.linkText, { textAlign: "center", fontSize: 16 }]}
      >
        Upload Image
      </Text>

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

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholder="john@gmail.com"
        style={styles.input}
      />

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="First Last"
        style={styles.input}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordInput}>
        <TextInput
          style={styles.nestedInput}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholder=""
          autoCapitalize="none"
          secureTextEntry={!showPassword ? true : false}
        />
        <Feather
          onPress={() => setShowPassword(!showPassword)}
          style={styles.passwordIcon}
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="grey"
        />
      </View>

      {/* Password Confirmation Input */}
      <Text style={styles.label}>Password Confirmation</Text>
      <View style={styles.passwordInput}>
        <TextInput
          style={styles.nestedInput}
          value={form.passwordConfirm}
          onChangeText={(text) => handleChange("passwordConfirm", text)}
          placeholder=""
          autoCapitalize="none"
          secureTextEntry={!showPasswordConfirm ? true : false}
        />
        <Feather
          onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
          style={styles.passwordIcon}
          name={showPasswordConfirm ? "eye-off" : "eye"}
          size={24}
          color="grey"
        />
      </View>

      <Text style={styles.error}>{errors}</Text>
      <Button
        disabled={loading}
        onPress={signUpWithEmail}
        text={loading ? "Creating Account..." : "Create Account"}
      />
      <Link href="/(auth)/sign-in" style={styles.link}>
        <Text style={styles.linkText}>Already have an account?</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: Colors.light.greyBg,
  },
  header: {
    marginBottom: 10,
  },
  label: {
    color: Colors.light.text,
    fontFamily: Fonts.primary[400],
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  error: {
    color: "red",
  },
  link: {
    textAlign: "center",
    marginTop: 5,
  },
  linkText: {
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  nestedInput: {
    width: "100%",
  },
  passwordInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  passwordIcon: {
    marginLeft: "auto",
  },
  image: {
    width: 150,
    height: 150,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 75,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 40,
  },
  avatarContainer: {
    overflow: "hidden",
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
});

export default SignUpScreen;
