import React from "react";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";
import Colors from "../constants/Colors";

type ToasterType = {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  type: "success" | "error";
};

const Toaster: React.FC<ToasterType> = ({
  visible,
  onDismiss,
  message,
  type,
}) => {
  const getType = () => {
    switch (type) {
      case "success":
        return styles.messageSuccess;
      case "error":
        return styles.messageError;
      default:
        return {};
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={5000}
      style={[getType(), { marginBottom: 90 }]}
      action={{
        label: "DISMISS",
        textColor: "white",
        onPress: onDismiss,
      }}
    >
      {message}
    </Snackbar>
  );
};

export default Toaster;

const styles = StyleSheet.create({
  messageError: {
    backgroundColor: Colors.light.red,
    color: "white",
  },
  messageSuccess: {
    backgroundColor: "#4caf50",
    color: "white",
  },
});
