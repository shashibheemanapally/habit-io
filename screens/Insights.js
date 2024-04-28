import { View } from "react-native";
import { StyleSheet, Text, FlatList } from "react-native";
import AppColors from "../constants/AppColors";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";
import HabitInsight from "../components/HabitInsight";

export default function Insights({}) {
  const db = useSQLite();

  const [habitInputItems, setHabitInputItems] = useState(null);
  const [habitInputInsights, setHabitInputInsights] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM habit_inputs`,
          [],
          (_, { rows: { _array } }) => {
            // console.log(_array);
            setHabitInputItems(_array);
            setHabitInputInsights(getInsights(_array));
          }
        );
      });

      return () => {};
    }, [])
  );

  function getInsights(habitInputs) {
    const map = new Map();
    for (let i = 0; i < habitInputs.length; i++) {
      const habitId = habitInputs[i].habit_id;
      const mood = habitInputs[i].perf;

      if (!map.has(habitId)) {
        map.set(habitId, { happy: 0, neutral: 0, sad: 0 });
      }

      if (mood === 1) {
        map.get(habitId).sad = map.get(habitId).sad + 1;
      } else if (mood === 2) {
        map.get(habitId).neutral = map.get(habitId).neutral + 1;
      } else if (mood === 3) {
        map.get(habitId).happy = map.get(habitId).happy + 1;
      }
    }
    const array = Array.from(map, ([habit_id, insight]) => ({
      habit_id,
      insight,
    }));
    // console.log(array);
    return array;
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Insights on your habits</Text>
        <View style={styles.separator}></View>
        <FlatList
          style={styles.habbitFlatList}
          data={habitInputInsights}
          renderItem={(itemData) => (
            <HabitInsight
              habitId={itemData.item.habit_id}
              insight={itemData.item.insight}
              habitInputItems={habitInputItems}
            ></HabitInsight>
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
