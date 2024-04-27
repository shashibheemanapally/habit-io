import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { FAB } from "react-native-paper";

import { Button, View } from "react-native";
import { StyleSheet, Text, FlatList } from "react-native";
import AppColors from "../constants/AppColors";
import React, { useEffect, useState } from "react";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";
import HabitListItem from "../components/HabitListItem";
import { useFocusEffect } from "@react-navigation/native";

export default function Habits({}) {
  const db = useSQLite();
  const navigation = useNavigation();
  const [habitItems, setHabitItems] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from habits where hidden=0;`,
          [],
          (_, { rows: { _array } }) => {
            setHabitItems(_array);
          }
        );
      });

      return () => {};
    }, [])
  );

  function addNewHabbitHandler() {
    navigation.navigate("AddHabit", {});
  }
  function deleteAllHabitsHandler() {
    db.transaction((tx) => {
      tx.executeSql("DELETE from habits;");
      tx.executeSql("DELETE from habit_inputs;");
    });
    db.transaction((tx) => {
      tx.executeSql(
        `select * from habits where hidden=0;`,
        [],
        (_, { rows: { _array } }) => {
          setHabitItems(_array);
        }
      );
    });
  }

  function deleteHabitsWithIdHandler(habit_id) {
    db.transaction((tx) => {
      tx.executeSql("DELETE from habits where habit_id=?;", [habit_id]);
      tx.executeSql("DELETE from habit_inputs where habit_id=?;", [habit_id]);
    });
    db.transaction((tx) => {
      tx.executeSql(
        `select * from habits where hidden=0;`,
        [],
        (_, { rows: { _array } }) => {
          setHabitItems(_array);
        }
      );
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Your Habits</Text>
        <View style={styles.separator}></View>
        <FlatList
          style={styles.habbitFlatList}
          data={habitItems}
          renderItem={(itemData) => (
            <View style={styles.habitItemContainer}>
              <HabitListItem
                onLongPress={() =>
                  deleteHabitsWithIdHandler(itemData.item.habit_id)
                }
              >
                {itemData.item.habit_desc}
              </HabitListItem>
              <Text style={styles.simpleText}>
                {itemData.item.schedule_info}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
        <FAB
          icon={({ color, size }) => (
            <Entypo name="circle-with-plus" color={"white"} size={size} />
          )}
          style={styles.newHabitFab}
          onPress={addNewHabbitHandler}
          backgroundColor={AppColors.dark_panel}
        />
        <FAB
          icon={({ color, size }) => (
            <Entypo name="trash" color={"red"} size={size} />
          )}
          style={styles.delHabitsFab}
          onPress={deleteAllHabitsHandler}
          backgroundColor={AppColors.dark_panel}
        />
        <View style={styles.separator}></View>
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
    height: 80,
  },
  newHabitFab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
  },
  habitItemContainer: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 24,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: AppColors.dark_panel,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    width: "auto",
  },
  delHabitsFab: {
    position: "absolute",
    margin: 16,
    right: 0,
  },
  simpleText: {
    color: "white",
    fontFamily: "regular",
  },
  habbitFlatList: {
    height: "68%",
    flexGrow: 0,
  },
});
