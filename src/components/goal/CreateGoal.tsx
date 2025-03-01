import { StyleSheet, View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { GoalForm } from "@/src/types/goals";
import CreateGoalForm from "./CreateGoalForm";

type CreateGoalProps = {
  visiblity: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  createGoal: (formData: GoalForm) => void;
};

const CreateGoal: React.FC<CreateGoalProps> = ({
  visiblity,
  setVisibility,
  createGoal,
}) => {
  return (
    <Modal
      isVisible={visiblity}
      onBackdropPress={() => setVisibility(false)}
      animationIn="slideInUp"
      animationOut={"slideOutDown"}
      style={styles.modal}
    >
      <View style={styles.content}>
        <CreateGoalForm
          onSubmit={(form) => {
            createGoal(form);
            setVisibility(false);
          }}
          onCancel={() => setVisibility(false)}
        />
      </View>
    </Modal>
  );
};

export default CreateGoal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "90%",
  },
});
