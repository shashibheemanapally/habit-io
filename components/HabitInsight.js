import { View, Text, Pressable, StyleSheet } from "react-native";
import AppColors from "../constants/AppColors";
import { FAB } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";
import { useNavigation } from "@react-navigation/native";

export default function HabitInsight({ habitId, insight, habitInputItems }) {
  const db = useSQLite();
  const [habitDesc, setHabitDesc] = useState("");
  const [habitStartDate, sethabitStartDate] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT habit_desc, start_date FROM habits WHERE habit_id = ?`,
        [habitId],
        (_, { rows: { _array } }) => {
          // console.log(_array);
          setHabitDesc(_array[0].habit_desc);
          sethabitStartDate(_array[0].start_date);
        }
      );
    });
  }, []);

  function navigateToHabitInsightsCal() {
    navigation.navigate("HabitInsightsCalander", {
      habitDesc: habitDesc,
      habitStartDate: habitStartDate,
      habitId: habitId,
      insight: insight,
      habitInputItems: habitInputItems,
    });
  }

  function getHabitScore(insight) {
    const perfectScore = (insight.happy + insight.neutral + insight.sad) * 2;
    const actualScore = insight.happy * 2 + insight.neutral * 1;
    if (actualScore == 0 || perfectScore == 0) {
      return 0;
    }
    return Math.floor((actualScore / perfectScore) * 100);
  }
  return (
    <Pressable
      style={styles.itemOuterContainer}
      onPress={navigateToHabitInsightsCal}
    >
      <View style={styles.itemInnerTextContainer}>
        <Text style={styles.itemText}>{habitDesc}</Text>
      </View>
      <View style={styles.insightContainer}>
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
        <View style={styles.insightMetricContainer}>
          <Text
            style={[
              styles.metricText,
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
          <Text style={styles.subHeadingText}>score</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemOuterContainer: {
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
    backgroundColor: AppColors.dark_panel,
    paddingTop: 5,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  itemInnerTextContainer: {
    backgroundColor: AppColors.dark_panel,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  itemText: {
    color: "white",
    textAlign: "left",
    fontFamily: "regular",
    fontSize: 20,
  },
  subHeadingText: {
    fontSize: 18,
    color: "white",
    fontFamily: "bold",
  },
  pressed: {
    opacity: 0.75,
  },
  itemInnerButtonsContainer: {
    flex: 6,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  fabInput: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
  insightContainer: { flexDirection: "row" },
  insightMetricContainer: {
    flex: 7,

    alignItems: "center",
    justifyContent: "center",
  },
  metricText: {
    fontFamily: "bold",
    fontSize: 40,
  },
});
