import { Goal, GoalForm, WeeklyGoal, ValidDateType } from "@/src/types/goals";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import GoalFormFields from "./GoalFormFields";

type EditGoalFormProps = {
  initialData: Goal;
  onSubmit: (formData: GoalForm) => void;
  onDelete: () => void;
  onCancel: () => void;
  selectedGoalColors: string[];
  weeklyGoals: WeeklyGoal[];
  validDates: ValidDateType;
};

const EditGoalForm: React.FC<EditGoalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  selectedGoalColors,
  validDates,
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
      <GoalFormFields
        selectedGoalColors={selectedGoalColors}
        form={form}
        handleChange={handleChange}
        validDates={validDates}
      />

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
          onPress={onDelete}
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
