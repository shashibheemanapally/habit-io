import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "react-native-paper";

import { View } from "react-native";
import { StyleSheet, Text } from "react-native";
import AppColors from "../constants/AppColors";

export default function Habits({}) {
  const navigation = useNavigation();
  function addNewHabbitHandler() {
    navigation.navigate("AddHabit");
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Your Habits</Text>
        <FAB
          icon={({ color, size }) => (
            <Ionicons name="add-circle" color={"white"} size={size} />
          )}
          style={styles.newHabitFab}
          onPress={addNewHabbitHandler}
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
    height: 50,
  },
  newHabitFab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
  },
});
