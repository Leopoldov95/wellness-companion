import { GoalColors } from "@/src/constants/Colors";
import Fonts from "@/src/constants/Fonts";
import { categoryData, GoalForm, ValidDateType } from "@/src/types/goals";
import { Feather } from "@expo/vector-icons";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { Fragment, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { Dropdown } from "react-native-element-dropdown";
import { Button, TextInput } from "react-native-paper";
import { GetCategoryImage } from "./GetCategoryImage";

const GOAL_COLORS = [
  GoalColors.purple,
  GoalColors.pink,
  GoalColors.softOrange,
  GoalColors.lavender,
  GoalColors.softTeal,
  GoalColors.coral,
  GoalColors.lightBlue,
  GoalColors.goldenYellow,
  GoalColors.mintGreen,
  GoalColors.peach,
  GoalColors.maroon,
  GoalColors.brownGrey,
  GoalColors.pastelNavy,
  GoalColors.vintageOrange,
];

const NUM_TASKS_OPTIONS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
];

type GoalFormFieldProps = {
  form: GoalForm;
  selectedGoalColors: string[];
  handleChange: (field: keyof GoalForm, value: string | Date) => void;
  validDates?: ValidDateType;
};

const getFutureDateByMonth = (month: number) => {
  return new Date(new Date().setMonth(new Date().getMonth() + month));
};

const GoalFormFields: React.FC<GoalFormFieldProps> = ({
  form,
  selectedGoalColors,
  validDates, //* we can use this prop to determine if its a new goal or existing goal
  handleChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

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

  const showDatePicker = () => {
    let minDate, maxDate;
    if (validDates) {
      minDate = validDates.startDate;
      maxDate = validDates.endDate;
    } else {
      minDate = getFutureDateByMonth(1);
      maxDate = getFutureDateByMonth(7);
    }

    DateTimePickerAndroid.open({
      value: new Date(form.dueDate),
      onChange,
      mode: "date",
      is24Hour: true,
      minimumDate: minDate,
      maximumDate: maxDate,
    });
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <React.Fragment>
      <View style={styles.imageWrapper}>
        {form.category.length > 0 && GetCategoryImage(form.category, 180)}
      </View>

      {/* Category Dropdown */}
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
          searchPlaceholder="Search..."
          value={form.category}
          onChange={(item) => {
            handleChange("category", item.value);
          }}
        />
      </View>

      {/* Title */}
      <Text style={styles.label}>Goal Title</Text>
      <TextInput
        value={form.title}
        mode="outlined"
        maxLength={30}
        outlineStyle={{ borderRadius: 8 }}
        onChangeText={(text) => handleChange("title", text)}
        placeholder="Become a better reader"
        placeholderTextColor="#A9A9A9"
        style={styles.titleField}
      />

      {/* Weekly Goal Title */}
      {!validDates && (
        <Fragment>
          <Text style={styles.label}>Weekly Task</Text>
          <TextInput
            value={form?.weeklyTask}
            mode="outlined"
            maxLength={30}
            outlineStyle={{ borderRadius: 8 }}
            onChangeText={(text) => handleChange("weeklyTask", text)}
            placeholder="Read 3 times a week"
            placeholderTextColor="#A9A9A9"
            style={styles.titleField}
          />
        </Fragment>
      )}
      {/* Category Dropdown */}
      <View>
        <Text style={styles.label}>Tasks Per Week</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={NUM_TASKS_OPTIONS}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={form.numTasks}
          onChange={(item) => {
            handleChange("numTasks", item.value);
          }}
        />
      </View>
      {/* Calendar Date Picker */}
      <View>
        <Button
          style={styles.dateButton}
          icon="calendar"
          mode="contained"
          onPress={showDatePicker}
        >
          Target End Date
        </Button>
        <Text style={[styles.label, { textAlign: "center", marginTop: 6 }]}>
          {new Date(form.dueDate)
            ? new Date(form.dueDate).toDateString()
            : "Target Goal Date"}
        </Text>
      </View>

      <View style={styles.colorContainer}>
        {/* <Text style={styles.label}>Color</Text> */}
        <Pressable onPress={toggleAccordion} style={styles.accordionHeader}>
          <Text style={styles.label}>Color</Text>

          <Feather
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </Pressable>
        <Collapsible collapsed={!isExpanded}>
          <View style={styles.colorWrapper}>
            {GOAL_COLORS.map((color, idx) => {
              const isUsed = selectedGoalColors.includes(color);
              return (
                <Pressable
                  key={idx}
                  disabled={isUsed}
                  // TODO will need to disable if other goal has color selected
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    form.color === color && styles.active,
                    isUsed && styles.disabled,
                  ]}
                  onPress={() => handleChange("color", color)}
                />
              );
            })}
          </View>
        </Collapsible>
      </View>
    </React.Fragment>
  );
};

export default GoalFormFields;

const styles = StyleSheet.create({
  imageWrapper: {
    marginTop: -18,
    marginBottom: -20,
  },
  colorContainer: {
    marginTop: -20,
    overflow: "hidden",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    fontWeight: "600",
    fontFamily: Fonts.primary[500],
    marginLeft: 8,
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
  titleField: {
    height: 45,
    marginTop: -10,
    backgroundColor: "transparent",
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
  colorWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: "auto",
  },
  colorButton: {
    width: 38,
    height: 38,
    backgroundColor: "red",
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 6,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.1,
  },
});
