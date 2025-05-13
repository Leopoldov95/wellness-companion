import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { globalStyles } from "@/src/styles/globals";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SignInScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  async function signInWithEmail() {
    setLoading(true);
    if (!validateInput()) {
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) Alert.alert(error.message);
    //! Only for testing, but move the user to the home page

    setLoading(false);
    //* no need for manual redirect as session handler takes care of that
  }

  const validateInput = () => {
    const { email, password } = form;
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

    if (!password) {
      setErrors("Password is required");
      return false;
    }

    return true;
  };

  const handleFacebookAuth = () => {
    console.warn("Signing in using Facvebook...");
  };

  const handleGoogleAuth = () => {
    console.warn("Signing in using Google...");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign In" }} />

      <View style={styles.header}>
        <Text style={globalStyles.title}>Sign In</Text>
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholder="john@gmail.com"
        style={styles.input}
      />

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

      <Text style={styles.error}>{errors}</Text>
      <Button
        disabled={loading}
        onPress={signInWithEmail}
        text={loading ? "Signing in..." : "Sign in"}
      />
      {/* External Providers Authentication */}
      <View style={styles.socialContainer}>
        <Pressable disabled onPress={handleGoogleAuth} style={styles.iconLink}>
          <FontAwesome5 size={24} name="google" style={styles.icon} />
        </Pressable>
        <Pressable
          disabled
          onPress={handleFacebookAuth}
          style={styles.iconLink}
        >
          <FontAwesome5 size={24} name="facebook" style={styles.icon} />
        </Pressable>
      </View>
      {/* TODO ~ need to handle this at a later time */}
      {/* <Link href="/(auth)/sign-up" style={styles.link}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </Link> */}
      <Link href="/(auth)/sign-up" style={styles.link}>
        <Text style={styles.linkText}>Create an account</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    padding: 30,
    backgroundColor: Colors.light.greyBg,
  },
  header: {
    marginBottom: 32,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  passwordIcon: {
    marginLeft: "auto",
  },
  socialContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 24,
    flexDirection: "row",
    marginVertical: 16,
  },
  iconLink: {
    borderColor: Colors.light.primary,
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 60,
    color: Colors.light.primary,
  },
  icon: {
    color: Colors.light.primary,
  },
});

export default SignInScreen;
