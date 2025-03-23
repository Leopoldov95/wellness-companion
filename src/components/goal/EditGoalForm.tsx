import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import GoalFormFields from "./GoalFormFields";
import { Button } from "react-native-paper";
import { Goal, GoalForm, WeeklyGoal } from "@/src/types/goals";
import { globalStyles } from "@/src/styles/globals";
import GoalProgressBar from "./GoalProgressBar";
import WeeklyCardList from "./WeeklyCardList";

type EditGoalFormProps = {
  initialData: Goal;
  onSubmit: (formData: GoalForm) => void;
  onDelete: (formData: number) => void;
  onCancel: () => void;
  weeklyGoals: WeeklyGoal[];
};

const EditGoalForm: React.FC<EditGoalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  weeklyGoals,
}) => {
  const [form, setForm] = useState<GoalForm>({ ...initialData });

  const handleChange = (field: keyof GoalForm, value: string | Date) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <GoalFormFields form={form} handleChange={handleChange} />

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => onSubmit(form)}>
          Update
        </Button>
        <Button
          mode="outlined"
          onPress={onCancel}
          buttonColor="#EEEEEE"
          textColor="#616161"
          style={{ borderColor: "#616161" }}
        >
          Cancel
        </Button>
        <Button
          mode="outlined"
          onPress={() => onDelete(initialData.id)}
          buttonColor="#fdeded"
          textColor="#b00020"
          style={{ borderColor: "#b00020" }}
        >
          Delete
        </Button>
      </View>
    </View>
  );
};

export default EditGoalForm;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 14,
    flex: 1,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 8,
  },
});
