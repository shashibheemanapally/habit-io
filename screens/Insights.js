import { View } from "react-native";
import { StyleSheet, Text, FlatList } from "react-native";
import AppColors from "../constants/AppColors";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";

export default function Insights({}) {
  const db = useSQLite();
  const [habitInputItems, setHabitInputItems] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM habit_inputs`,
          [],
          (_, { rows: { _array } }) => {
            console.log(_array);
            setHabitInputItems(_array);
          }
        );
      });

      return () => {};
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Insights on your habits</Text>
        <View style={styles.separator}></View>
        <FlatList
          style={styles.habbitFlatList}
          data={habitInputItems}
          renderItem={(itemData) => (
            <View style={styles.habitInputItemContainer}>
              <Text style={styles.simpleText}>
                date: {itemData.item.cal_date}
              </Text>
              <Text style={styles.simpleText}>
                habit_id: {itemData.item.habit_id}
              </Text>
              <Text style={styles.simpleText}>perf: {itemData.item.perf}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index}
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
    height: 50,
  },
  simpleText: {
    color: "white",
    fontFamily: "regular",
  },
  habbitFlatList: {
    height: "80%",
    flexGrow: 0,
  },
  habitInputItemContainer: {
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
});
