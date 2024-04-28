import { Pressable, ScrollView, TextInput, View } from "react-native";
import { StyleSheet, Text } from "react-native";
import AppColors from "../constants/AppColors";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";
import { Picker } from "@react-native-picker/picker";
import { todayDate } from "../util/calUtil";
import { Button, FAB } from "react-native-paper";
import { addNewHabit } from "../util/dbUtil";
import WeekDaySelector from "../components/WeekDaySelector";

export default function AddHabit({}) {
  const db = useSQLite();
  const navigation = useNavigation();
  const [habitText, setHabitText] = useState("");
  const [scheduleType, setScheduleType] = useState("On week days");
  const [weekFrequency, setWeekFrequency] = useState("1");
  const [dayFrequency, setDayFrequency] = useState("3");
  const [startFrom, setStartFrom] = useState(todayDate());
  const [weekDays, setWeekDays] = useState([
    false,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);

  function addNewHabitHandler() {
    function formatWeekDays(weekDays) {
      let result = "";
      for (let i = 0; i < weekDays.length; i++) {
        if (weekDays[i]) {
          result = result + i + ",";
        }
      }
      return result.slice(0, -1);
    }

    let schedule_info = "";
    if (scheduleType === "On week days") {
      const weekDayIndices = formatWeekDays(weekDays);
      if (weekDayIndices.length === 0) {
        return;
      }
      schedule_info = "weekdays|" + weekFrequency + "|" + weekDayIndices;
    } else if (scheduleType === "For every fixed number of days") {
      schedule_info = "fixeddays|" + dayFrequency;
    } else {
      return;
    }

    const newHabitAdded = addNewHabit(habitText, startFrom, schedule_info, db);
    if (!newHabitAdded) {
      console.log("Error while adding new habit");
      return;
    }

    setHabitText("");
    navigation.goBack();
  }

  function handleWeekDaySelect(dayOfTheWeek) {
    weekDays[dayOfTheWeek] = !weekDays[dayOfTheWeek];
    setWeekDays(Array.from(weekDays));
  }

  let scheduleInputComponent = <></>;

  if (scheduleType === "On week days") {
    scheduleInputComponent = (
      <View>
        <Text style={styles.simpleText}>Week frequency:</Text>
        <TextInput
          style={styles.scheduleInputText}
          value={weekFrequency}
          onChangeText={(text) => setWeekFrequency(text)}
        ></TextInput>

        <View style={styles.weekDaysSelectorContainer}>
          <WeekDaySelector
            dayIndex={0}
            weekDays={weekDays}
            onPress={() => {
              handleWeekDaySelect(0);
            }}
            weekDayLetter={"S"}
          ></WeekDaySelector>
          <WeekDaySelector
            dayIndex={1}
            weekDays={weekDays}
            onPress={() => {
              handleWeekDaySelect(1);
            }}
            weekDayLetter={"M"}
          ></WeekDaySelector>
          <WeekDaySelector
            dayIndex={2}
            weekDays={weekDays}
            onPress={() => {
              handleWeekDaySelect(2);
            }}
            weekDayLetter={"T"}
          ></WeekDaySelector>
          <WeekDaySelector
            dayIndex={3}
            weekDays={weekDays}
            onPress={() => {
              handleWeekDaySelect(3);
            }}
            weekDayLetter={"W"}
          ></WeekDaySelector>
          <WeekDaySelector
            dayIndex={4}
            weekDays={weekDays}
            onPress={() => {
              handleWeekDaySelect(4);
            }}
            weekDayLetter={"T"}
          ></WeekDaySelector>
          <WeekDaySelector
            dayIndex={5}
            weekDays={weekDays}
            onPress={() => {
              handleWeekDaySelect(5);
            }}
            weekDayLetter={"F"}
          ></WeekDaySelector>
          <WeekDaySelector
            dayIndex={6}
            weekDays={weekDays}
            onPress={() => {
              handleWeekDaySelect(6);
            }}
            weekDayLetter={"S"}
          ></WeekDaySelector>
        </View>
      </View>
    );
  } else if (scheduleType === "For every fixed number of days") {
    scheduleInputComponent = (
      <View>
        <Text style={styles.simpleText}>Day frequency:</Text>
        <TextInput
          style={styles.scheduleInputText}
          value={dayFrequency}
          onChangeText={(text) => setDayFrequency(text)}
        ></TextInput>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Add a new Habit</Text>
        <ScrollView>
          <View style={styles.separator}></View>
          <TextInput
            style={styles.habitInputText}
            value={habitText}
            onChangeText={(text) => setHabitText(text)}
          ></TextInput>
          <View style={styles.scheduleContainer}>
            <Text style={styles.subHeadingText}>Schedule:</Text>
            <Picker
              style={styles.scheduleTypePicker}
              selectedValue={scheduleType}
              onValueChange={(itemValue, itemIndex) =>
                setScheduleType(itemValue)
              }
              dropdownIconColor={"white"}
            >
              <Picker.Item label="On week days" value="On week days" />
              <Picker.Item
                label="For every fixed number of days"
                value="For every fixed number of days"
              />
              {/* <Picker.Item label="Days of the year" value="Days of the year" /> */}
            </Picker>
            {scheduleInputComponent}
          </View>
          <View style={styles.scheduleContainer}>
            <Text style={styles.simpleText}>Start from: YYYYMMDD</Text>
            <TextInput
              style={styles.scheduleInputText}
              value={startFrom}
              onChangeText={(text) => setStartFrom(text)}
            ></TextInput>
          </View>
          <View style={styles.addButtonContainer}>
            <Button
              mode="contained"
              onPress={addNewHabitHandler}
              compact={true}
            >
              Add
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark_background,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: "5%",
    marginVertical: "1%",
    flexDirection: "column",
  },
  headingText: {
    fontSize: 40,
    color: "white",
    fontFamily: "regular",
  },
  subHeadingText: {
    fontSize: 20,
    color: "white",
    fontFamily: "regular",
  },
  separator: {
    height: 30,
  },
  scheduleContainer: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: AppColors.dark_panel,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    width: "auto",
  },
  habitInputText: {
    width: "auto",
    backgroundColor: "black",
    marginVertical: 16,
    marginHorizontal: 24,
    padding: 15,
    borderRadius: 8,
    color: "white",
    fontFamily: "regular",
  },
  scheduleTypePicker: {
    width: "100%",
    color: "white",
    backgroundColor: AppColors.dark_panel,
  },
  scheduleInputText: {
    width: "auto",
    backgroundColor: "black",
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    color: "white",
    fontFamily: "regular",
    textAlign: "center",
  },
  simpleText: {
    color: "white",
    fontFamily: "regular",
  },
  addButtonContainer: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 24,
    padding: 16,
    width: "auto",
  },
  weekDaysSelectorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});
