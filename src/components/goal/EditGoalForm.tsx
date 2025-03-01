import { StyleSheet, Text, View } from "react-native";
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
  onCancel: () => void;
  onPause: () => void;
  onArchive: () => void;
  weeklyGoals: WeeklyGoal[];
};

const EditGoalForm: React.FC<EditGoalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onPause,
  onArchive,
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
      <Text style={globalStyles.subheader}>Edit Goal</Text>

      <GoalFormFields form={form} handleChange={handleChange} />

      <GoalProgressBar
        progress={initialData.progress}
        color={initialData.color}
      />

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => onSubmit(form)}>
          Update
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
        <Button
          buttonColor="#e5f6fd"
          textColor="#014361"
          style={{ borderColor: "#014361" }}
          compact={true}
          mode="outlined"
          onPress={onPause}
        >
          {initialData.isPaused ? "Unpause" : "Pause"}
        </Button>
        <Button
          buttonColor="#fff4e5"
          textColor="#663c00"
          style={{ borderColor: "#663c00" }}
          compact={true}
          onPress={onArchive}
          mode="outlined"
        >
          {initialData.isArchived ? "Unarchive" : "Archive"}
        </Button>
      </View>

      <Text>Weekly Goals</Text>
      <View>
        <WeeklyCardList weeklyGoals={weeklyGoals} />
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
