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
import { useNavigation } from "@react-navigation/native";
import { Button, FAB } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

export default function Home({}) {
  const db = useSQLite();
  const [currentDate, setCurrentDate] = useState(todayDate());
  const [habitItems, setHabitItems] = useState([]);
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification.",
        data: { userName: "Max" },
      },
      trigger: {
        seconds: 5,
      },
    });
  }

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
            // console.log(_array);
          }
        );
        tx.executeSql(
          `SELECT * from user_info`,
          [],
          (_, { rows: { _array } }) => {
            if (_array.length !== 0) {
              setUserName(_array[0].name);
            }
          }
        );
      });

      return () => {};
    }, [])
  );

  function homeYesterDayHandler() {
    navigation.navigate("HomeYesterday", {});
  }

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       `SELECT habits.habit_id as habit_id, habit_desc, start_date,schedule_info, hidden, cal_date, perf FROM habits LEFT JOIN habit_inputs ON habits.habit_id = habit_inputs.habit_id and habit_inputs.cal_date=?;`,
  //       [currentDate],
  //       (_, { rows: { _array } }) => {
  //         setHabitItems(
  //           _array
  //             .filter((habit) => isValidForTheDay(habit))
  //             .sort((o1, o2) => {
  //               return o1.perf === null ? -1 : 1;
  //             })
  //         );
  //         console.log(_array);
  //       }
  //     );
  //   });

  //   return () => {};
  // }, [currentDate]);

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
    // console.log("perf is ", perf);
    if (perf === 1) {
      return "sad";
    } else if (perf === 2) {
      return "neutral";
    } else if (perf === 3) {
      return "happy";
    } else {
      return "none";
    }
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

  // const label1 = formatDateToUserFriendly(todayDate());
  // const value1 = todayDate();

  // const label2 = formatDateToUserFriendly(subtractNDays(todayDate(), 1));
  // const value2 = subtractNDays(todayDate(), 1);

  // const label3 = formatDateToUserFriendly(subtractNDays(todayDate(), 2));
  // const value3 = subtractNDays(todayDate(), 2);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Welcome {userName}! </Text>
        <View style={styles.separator}></View>

        <Text style={styles.subHeadingText}>
          {formatDateToUserFriendly(currentDate)} : Today
        </Text>

        <View style={styles.separator}></View>

        {habitItems.length === 0 ? (
          <View style={styles.noHabitsContainer}>
            <Text
              style={[styles.subHeadingText, { fontFamily: "regularItalic" }]}
            >
              No scheduled habits to display today, try adding new habits from
              the menu
            </Text>
          </View>
        ) : (
          <></>
        )}

        {/* <View style={styles.currentDatePickerContainer}>
          <Picker
            style={styles.currentDatePicker}
            selectedValue={currentDate}
            onValueChange={(itemValue, itemIndex) => setCurrentDate(itemValue)}
            dropdownIconColor={"white"}
          >
            <Picker.Item label={label1} value={value1} />
            <Picker.Item label={label2} value={value2} />
            <Picker.Item label={label3} value={value3} />
          </Picker>
        </View> */}
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
        <FAB
          size="small"
          icon={({ color, size }) => (
            <Entypo name="back-in-time" color={"white"} size={size} />
          )}
          style={styles.dayToggleFab}
          onPress={homeYesterDayHandler}
          backgroundColor={AppColors.dark_panel}
          rippleColor={"yellow"}
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
    fontFamily: "bold",
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
    height: "72%",
    flexGrow: 0,
  },
  subHeadingContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  dayToggleFab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 20,
  },
  noHabitsContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    marginVertical: 50,
    borderColor: "white",
  },
});
