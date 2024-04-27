import { View } from "react-native";
import { StyleSheet, Text, FlatList } from "react-native";
import AppColors from "../constants/AppColors";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";
import React, { useEffect, useState } from "react";
import {
  todayDate,
  formatDateToUserFriendly,
  subtractNDays,
  isValidForWeekDays,
  isValidForFixedDays,
} from "../util/calUtil";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import HomeListItem from "../components/HomeListitem";

export default function Home({}) {
  const db = useSQLite();
  const [currentDate, setCurrentDate] = useState(todayDate());
  const [habitItems, setHabitItems] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT habits.habit_id as habit_id, habit_desc, start_date,schedule_info, hidden, cal_date, perf FROM habits LEFT JOIN habit_inputs ON habits.habit_id = habit_inputs.habit_id and habit_inputs.cal_date=?;`,
          [currentDate],
          (_, { rows: { _array } }) => {
            setHabitItems(
              _array
                .filter((habit) => isValidForTheDay(habit))
                .sort((o1, o2) => {
                  return o1.perf === null ? -1 : 1;
                })
            );
            console.log(_array);
          }
        );
      });

      return () => {};
    }, [])
  );

  function onPressSadHandler(habit_id) {
    //perf 1
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE from habit_inputs where cal_date=? AND habit_id=?;",
        [currentDate, habit_id]
      );
      tx.executeSql(
        "INSERT INTO habit_inputs (cal_date, habit_id, perf) VALUES (?, ?, ?);",
        [currentDate, habit_id, 1],
        null,
        (tx, error) => console.log(error)
      );
    });
  }

  function onPressNeutralHandler(habit_id) {
    //perf 2
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE from habit_inputs where cal_date=? AND habit_id=?;",
        [currentDate, habit_id]
      );
      tx.executeSql(
        "INSERT INTO habit_inputs (cal_date, habit_id, perf) VALUES (?, ?, ?);",
        [currentDate, habit_id, 2],
        null,
        (tx, error) => console.log(error)
      );
    });
  }

  function onPressHappyHandler(habit_id) {
    //perf 3
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE from habit_inputs where cal_date=? AND habit_id=?;",
        [currentDate, habit_id]
      );
      tx.executeSql(
        "INSERT INTO habit_inputs (cal_date, habit_id, perf) VALUES (?, ?, ?);",
        [currentDate, habit_id, 3],
        null,
        (tx, error) => console.log(error)
      );
    });
  }

  function onPressDeselectHandler(habit_id) {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE from habit_inputs where cal_date=? AND habit_id=?;",
        [currentDate, habit_id]
      );
    });
  }

  function getCurrentMood(perf) {
    if (perf === 1) {
      return "sad";
    } else if (perf === 2) {
      return "neutral";
    } else if (perf === 3) {
      return "happy";
    }
    return "none";
  }

  // function filterAndSort(givenHabitItems) {
  //   givenHabitItems
  //     .filter((habit) => isValidForTheDay(habit))
  //     .sort((o1, o2) => {
  //       return o1.perf === null ? -1 : 1;
  //     });
  // }

  function isValidForTheDay(habit) {
    const scheduleInfoArray = habit.schedule_info.split("|");
    if (scheduleInfoArray[0] === "weekdays") {
      return isValidForWeekDays(
        currentDate,
        habit.start_date,
        scheduleInfoArray[1],
        scheduleInfoArray[2]
      );
    } else if (scheduleInfoArray[0] === "fixeddays") {
      return isValidForFixedDays(
        currentDate,
        habit.start_date,
        scheduleInfoArray[1]
      );
    }
    return false;
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Welcome Shashi!</Text>
        <View style={styles.separator}></View>

        <View style={styles.currentDatePickerContainer}>
          <Picker
            style={styles.currentDatePicker}
            selectedValue={formatDateToUserFriendly(currentDate)}
            onValueChange={(itemValue, itemIndex) => setCurrentDate(itemValue)}
            dropdownIconColor={"white"}
          >
            <Picker.Item
              label={formatDateToUserFriendly(currentDate)}
              value={currentDate}
            />
            <Picker.Item
              label={formatDateToUserFriendly(subtractNDays(currentDate, 1))}
              value={subtractNDays(currentDate, 1)}
            />
            <Picker.Item
              label={formatDateToUserFriendly(subtractNDays(currentDate, 2))}
              value={subtractNDays(currentDate, 2)}
            />
          </Picker>
        </View>
        <FlatList
          style={styles.habbitFlatList}
          data={habitItems}
          renderItem={(itemData) => (
            <HomeListItem
              currentMood={getCurrentMood(itemData.item.perf)}
              onPressSad={() => onPressSadHandler(itemData.item.habit_id)}
              onPressNeutral={() =>
                onPressNeutralHandler(itemData.item.habit_id)
              }
              onPressHappy={() => onPressHappyHandler(itemData.item.habit_id)}
              onPressDeselect={() =>
                onPressDeselectHandler(itemData.item.habit_id)
              }
            >
              {itemData.item.habit_desc}
            </HomeListItem>
          )}
          keyExtractor={(item, index) => item.habit_id}
        />
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
    height: 20,
  },
  currentDatePicker: {
    width: "100%",
    color: "white",
    backgroundColor: AppColors.dark_panel,
    width: 250,
    backgroundColor: AppColors.dark_background,
  },
  currentDatePickerContainer: {
    alignItems: "flex-end",
  },
  habbitFlatList: {
    height: "74%",
    flexGrow: 0,
  },
});
