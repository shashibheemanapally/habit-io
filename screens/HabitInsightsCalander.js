import { Button, View } from "react-native";
import { StyleSheet, Text, FlatList } from "react-native";
import AppColors from "../constants/AppColors";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { CalendarList } from "react-native-calendars";
import { FAB } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

export default function HabitInsightsCalander({}) {
  const route = useRoute();
  const [markedDates, setMarkedDates] = useState({});

  const habitDesc = route.params.habitDesc;
  const habitId = route.params.habitId;
  const insight = route.params.insight;
  const habitInputItems = route.params.habitInputItems;
  const habitStartDate = route.params.habitStartDate;

  useEffect(() => {
    const markedDatesTemp = {};

    habitInputItems
      .filter((e) => {
        return e.habit_id === habitId;
      })
      .forEach((habitInput) => {
        if (habitInput.perf === 1) {
          markedDatesTemp[
            habitInput.cal_date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
          ] = { selected: true, selectedColor: "red" };
        } else if (habitInput.perf === 2) {
          markedDatesTemp[
            habitInput.cal_date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
          ] = { selected: true, selectedColor: "yellow" };
        } else if (habitInput.perf === 3) {
          markedDatesTemp[
            habitInput.cal_date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
          ] = { selected: true, selectedColor: "green" };
        }
      });

    markedDatesTemp[
      habitStartDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
    ] = {
      ...markedDatesTemp[
        habitStartDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
      ],
      marked: true,
    };

    setMarkedDates(markedDatesTemp);
  }, []);

  function getHabitScore(insight) {
    const perfectScore = (insight.happy + insight.neutral + insight.sad) * 2;
    const actualScore = insight.happy * 2 + insight.neutral * 1;
    if (actualScore == 0 || perfectScore == 0) {
      return 0;
    }

    return Math.floor((actualScore / perfectScore) * 100);
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>{habitDesc}</Text>
          <Text
            style={[
              styles.headingText,
              {
                color:
                  getHabitScore(insight) >= 70
                    ? "green"
                    : getHabitScore(insight) < 30
                    ? "red"
                    : "yellow",
              },
            ]}
          >
            {getHabitScore(insight)}/100
          </Text>
          <View style={styles.itemInnerButtonsContainer}>
            <FAB
              icon={({ color, size }) => (
                <Entypo name="emoji-happy" color={"green"} size={size} />
              )}
              label={insight.happy.toString()}
              color="white"
              style={styles.fabInput}
              backgroundColor={"#000000"}
            />
            <FAB
              icon={({ color, size }) => (
                <Entypo name="emoji-neutral" color={"yellow"} size={size} />
              )}
              label={insight.neutral.toString()}
              color="white"
              style={styles.fabInput}
              backgroundColor={"#000000"}
            />
            <FAB
              icon={({ color, size }) => (
                <Entypo name="emoji-sad" color={"red"} size={size} />
              )}
              label={insight.sad.toString()}
              color="white"
              style={styles.fabInput}
              backgroundColor={"#000000"}
            />
          </View>
        </View>

        <View>
          <CalendarList
            markedDates={markedDates}
            theme={{
              calendarBackground: "transparent",
              dayTextColor: "#ffffff",
              selectedDayTextColor: "#000000",
            }}
          ></CalendarList>
        </View>
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
    marginHorizontal: "0%",
    marginVertical: "1%",
    flexDirection: "column",
  },
  headingText: {
    fontSize: 20,
    color: "white",
    fontFamily: "regular",
  },

  separator: {
    height: 10,
  },

  headingContainer: {
    marginHorizontal: 40,
    marginBottom: 20,
  },
  itemInnerButtonsContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  fabInput: {
    marginHorizontal: 4,
    marginTop: 5,
  },
});
