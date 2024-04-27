import { View, Text, Pressable, StyleSheet } from "react-native";
import AppColors from "../constants/AppColors";

function HabitListItem({ children, onPress, onLongPress }) {
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
      </Pressable>
    </View>
  );
}

export default HabitListItem;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 10,
    margin: 4,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: AppColors.dark_panel,
    paddingVertical: 18,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "regular",
    fontSize: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
