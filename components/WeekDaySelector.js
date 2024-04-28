import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native";
import AppColors from "../constants/AppColors";

export default function WeekDaySelector({
  dayIndex,
  weekDays,
  onPress,
  weekDayLetter,
}) {
  return (
    <Pressable
      style={[
        styles.weekDaySelector,
        {
          backgroundColor: weekDays[dayIndex] ? "orange" : AppColors.dark_panel,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.simpleText}>{weekDayLetter}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  weekDaySelector: {
    borderColor: "white",
    borderWidth: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  simpleText: {
    color: "white",
    fontFamily: "regular",
  },
});
