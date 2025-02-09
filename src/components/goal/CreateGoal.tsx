import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Category, categoryData } from "@/src/types/goals";
import Modal from "react-native-modal";
import { GetCategoryImage } from "./GetCategoryImage";
import { Dropdown } from "react-native-element-dropdown";
import { globalStyles } from "@/src/styles/globals";
import { Button, TextInput } from "react-native-paper";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Colors, { GoalColors } from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";

const GOAL_COLORS = [
  {
    id: 0,
    color: GoalColors.purple,
  },
  {
    id: 1,
    color: GoalColors.pink,
  },
  {
    id: 2,
    color: GoalColors.softOrange,
  },
  {
    id: 3,
    color: GoalColors.lavender,
  },
  {
    id: 4,
    color: GoalColors.softTeal,
  },
  {
    id: 5,
    color: GoalColors.coral,
  },
  {
    id: 6,
    color: GoalColors.lightBlue,
  },
  {
    id: 7,
    color: GoalColors.goldenYellow,
  },
  {
    id: 8,
    color: GoalColors.mintGreen,
  },
  {
    id: 9,
    color: GoalColors.peach,
  },
  {
    id: 10,
    color: GoalColors.maroon,
  },
  {
    id: 11,
    color: GoalColors.brownGrey,
  },
  {
    id: 12,
    color: GoalColors.pastelNavy,
  },
  {
    id: 13,
    color: GoalColors.vintageOrange,
  },
];

type GoalForm = {
  category: Category;
  title: string;
  dueDate: Date;
  color: string;
};

type CreateGoalProps = {
  visiblity: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  createGoal: (formData: GoalForm) => void;
};

const getFutureDataByMonth = (month: number) => {
  return new Date(new Date().setMonth(new Date().getMonth() + month));
};

const CreateGoal: React.FC<CreateGoalProps> = ({
  visiblity,
  setVisibility,
  createGoal,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [form, setForm] = useState<GoalForm>({
    category: "cooking",
    title: "",
    dueDate: getFutureDataByMonth(1),
    color: "",
  });

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    if (currentDate) {
      //setDate(currentDate);
      handleChange("dueDate", currentDate);
    }
  };

  const handleChange = (field: keyof GoalForm, value: string | Date) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeModal = () => {
    setVisibility(false);
    // reset form
    setForm({
      category: "cooking",
      title: "",
      dueDate: new Date(),
      color: "",
    });
  };

  const onSubmit = () => {
    if (form.title.length < 5) {
      // throw error
      return;
    }

    if (form.color.length < 1) {
      // throw error
      return;
    }
    createGoal(form);
    closeModal();
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: form.dueDate,
      onChange,
      mode: "date",
      is24Hour: true,
      minimumDate: getFutureDataByMonth(1),
      maximumDate: getFutureDataByMonth(7),
    });
  };

  return (
    <Modal
      isVisible={visiblity}
      onBackdropPress={closeModal}
      animationIn="slideInUp"
      animationOut={"slideOutDown"}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={[globalStyles.subheader, { textAlign: "center" }]}>
          Goal Creation
        </Text>

        <View style={styles.imageWrapper}>
          {form.category.length > 0 && GetCategoryImage(form.category, 180)}
        </View>

        {/* dropdown here */}
        <View>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={categoryData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select item" : "..."}
            searchPlaceholder="Search..."
            value={form.category}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              handleChange("category", item.value);
              setIsFocus(false);
            }}
          />
        </View>

        {/* Title */}
        <Text style={styles.label}>Goal Title</Text>
        <TextInput
          value={form.title}
          mode="outlined"
          maxLength={30}
          onChangeText={(text) => handleChange("title", text)}
          style={styles.titleField}
        />

        {/* Calendar Date Picker */}
        <View>
          <Button
            style={styles.dateButton}
            icon="calendar"
            mode="contained"
            onPress={showDatepicker}
          >
            Choose Date
          </Button>
          <Text style={[styles.label, { textAlign: "center", marginTop: 6 }]}>
            {form.dueDate ? form.dueDate.toDateString() : "Target Goal Date"}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>Color</Text>

          <FlatList
            data={GOAL_COLORS}
            keyExtractor={(item) => item.id.toString()}
            numColumns={7}
            renderItem={({ item }) => (
              <Pressable
                // TODO will need to disable if other goal has color selected
                style={[
                  styles.colorButton,
                  { backgroundColor: item.color },
                  form.color === item.color && styles.active,
                ]}
                onPress={() => handleChange("color", item.color)}
              />
            )}
            contentContainerStyle={styles.colorWrapper}
          />
        </View>

        {/* Create goal or cancel */}
        <View style={styles.actions}>
          <Button mode="contained" onPress={onSubmit}>
            Create
          </Button>
          <Button
            mode="outlined"
            onPress={closeModal}
            buttonColor="#b0002033"
            textColor="#b00020"
            style={{ borderColor: "#b00020" }}
          >
            Cancel
          </Button>
        </View>
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
  label: {
    fontWeight: "600",
    fontFamily: Fonts.primary[500],
    marginLeft: 8,
  },
  imageWrapper: {
    marginTop: -18,
    marginBottom: -10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "90%",
    gap: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dateButton: {
    borderRadius: 8,
  },
  colorWrapper: {
    paddingVertical: 10,
  },
  colorButton: {
    width: 38,
    height: 38,
    backgroundColor: "red",
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 6,
  },
  active: {
    borderColor: "#333",
    borderWidth: 1,
    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius
    // Android Shadow
    elevation: 3,
  },
  titleField: {
    height: 45,
    marginTop: -10,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 18,
    justifyContent: "center",
  },
  cancel: {
    borderColor: Colors.light.red,
  },
});
