import { View, Text, Pressable, StyleSheet } from "react-native";
import AppColors from "../constants/AppColors";
import { FAB } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

function HabitListItem({
  children,
  onPress,
  onLongPress,
  scheduleInfo,
  hideHabitTogglePress,
  hidden,
}) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: "black" }}
        onLongPress={onLongPress}
      >
        <Text style={styles.buttonText}>{children}</Text>
        <View style={styles.shceduleInfoContainer}>
          <Text style={styles.simpleText}>{scheduleInfo}</Text>
        </View>
      </Pressable>
      <FAB
        icon={({ color, size }) =>
          hidden ? (
            <Entypo name="eye" color={"grey"} size={size} />
          ) : (
            <Entypo name="eye-with-line" color={"orange"} size={size} />
          )
        }
        type="small"
        mode="flat"
        onPress={hideHabitTogglePress}
        backgroundColor={AppColors.dark_background}
        animated="false"
      />
    </View>
  );
}

export default HabitListItem;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 10,
    margin: 4,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonInnerContainer: {
    backgroundColor: AppColors.dark_panel,
    paddingVertical: 1,
    paddingHorizontal: 16,
    elevation: 2,
    flex: 3,
  },
  buttonText: {
    color: "white",
    textAlign: "left",
    fontFamily: "regular",
    fontSize: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  simpleText: {
    color: "white",
    fontFamily: "regular",
  },
  shceduleInfoContainer: {
    backgroundColor: "black",
    padding: 6,
    width: "90%",
    marginVertical: 8,
    borderRadius: 8,
  },
});
