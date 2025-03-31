import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { GoalForm } from "@/src/types/goals";
import GoalFormFields from "./GoalFormFields";
import { Button } from "react-native-paper";
import { globalStyles } from "@/src/styles/globals";

type CreateGoalFormProps = {
  onSubmit: (formData: GoalForm) => void;
  selectedGoalColors: string[];
  onCancel: () => void;
};

const CreateGoalForm: React.FC<CreateGoalFormProps> = ({
  onSubmit,
  selectedGoalColors,
  onCancel,
}) => {
  const [form, setForm] = useState<GoalForm>({
    category: "cooking",
    title: "",
    dueDate: new Date(),
    color: "",
    numTasks: 1,
    weeklyTask: "",
  });

  const handleChange = (
    field: keyof GoalForm,
    value: string | Date | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.subheader}>Create Goal</Text>

      <GoalFormFields
        selectedGoalColors={selectedGoalColors}
        form={form}
        handleChange={handleChange}
      />

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => onSubmit(form)}>
          Create
        </Button>
        <Button
          mode="outlined"
          onPress={onCancel}
          buttonColor="#fdeded"
          textColor="#b00020"
          style={{ borderColor: "#b00020" }}
        >
          Cancel
        </Button>
      </View>
    </View>
  );
};

export default CreateGoalForm;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 14,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 18,
  },
});
