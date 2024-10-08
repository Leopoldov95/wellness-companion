import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import Colors from "@/src/constants/Colors";
import { Link, Redirect, router, Stack } from "expo-router";
import Button from "@/src/components/Button";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { globalStyles } from "@/src/styles/globals";

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
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
      setLoading(false);
      return;
    }

    // const { error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    // if (error) Alert.alert(error.message);
    //! Only for testing, but move the user to the home page
    setLoading(false);

    router.push("/(main)");
    //return <Redirect href={"/(main)"} />;

    //router.push("/");
  }

  const validateInput = () => {
    const { email, password, passwordConfirm } = form;
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign In" }} />

      <View style={styles.header}>
        <Text style={globalStyles.title}>Create Account</Text>
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholder="john@gmail.com"
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
        onPress={signInWithEmail}
        text={loading ? "Signing in..." : "Sign in"}
      />
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
});

export default SignUpScreen;
