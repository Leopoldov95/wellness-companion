import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import Fonts from "@/src/constants/Fonts";
import { Button, TextInput } from "react-native-paper";
import { GetCategoryImage } from "./GetCategoryImage";
import { categoryData, GoalForm } from "@/src/types/goals";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import Colors, { GoalColors } from "@/src/constants/Colors";

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
  handleChange: (field: keyof GoalForm, value: string | Date) => void;
};

const getFutureDataByMonth = (month: number) => {
  return new Date(new Date().setMonth(new Date().getMonth() + month));
};

const GoalFormFields: React.FC<GoalFormFieldProps> = ({
  form,
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
    DateTimePickerAndroid.open({
      value: form.dueDate,
      onChange,
      mode: "date",
      is24Hour: true,
      minimumDate: getFutureDataByMonth(1),
      maximumDate: getFutureDataByMonth(7),
    });
  };

  const toggleAccordion = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        style={styles.titleField}
      />
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
          {form.dueDate ? form.dueDate.toDateString() : "Target Goal Date"}
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
          <FlatList
            data={GOAL_COLORS}
            keyExtractor={(item) => item.id.toString()}
            numColumns={7}
            nestedScrollEnabled={true}
            scrollEnabled={false}
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
        </Collapsible>
      </View>
    </React.Fragment>
  );
};

export default GoalFormFields;

const styles = StyleSheet.create({
  imageWrapper: {
    marginTop: -18,
    marginBottom: -10,
  },
  colorContainer: {
    marginTop: -6,
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
    paddingVertical: 0,
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
});
