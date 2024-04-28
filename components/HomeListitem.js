import { View, Text, Pressable, StyleSheet } from "react-native";
import AppColors from "../constants/AppColors";
import { FAB } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";

function HomeListItem({
  children,
  currentMood,
  onPressSad,
  onPressNeutral,
  onPressHappy,
  onPressDeselect,
}) {
  const [selectedMood, setSelectedMood] = useState(currentMood);
  //   const [hasInputGiven, setHasInputGiven] = useState(false);

  function selectSadHandler() {
    onPressSad();
    setSelectedMood("sad");
    // setHasInputGiven(true);
  }

  function selectNeutralHandler() {
    onPressNeutral();
    setSelectedMood("neutral");
    // setHasInputGiven(true);
  }

  function selectHappyHandler() {
    onPressHappy();
    setSelectedMood("happy");
    // setHasInputGiven(true);
  }

  function selectNoneHandler() {
    onPressDeselect();
    setSelectedMood("none");
    // setHasInputGiven(false);
  }

  return (
    <Pressable style={styles.itemOuterContainer} onPress={selectNoneHandler}>
      <View style={styles.itemInnerTextContainer}>
        <Text
          style={[
            styles.itemText,
            {
              textDecorationLine:
                selectedMood === "none" ? "none" : "line-through",
              fontFamily: selectedMood === "none" ? "regular" : "regularItalic",
            },
          ]}
        >
          {children}
        </Text>
      </View>
      <View style={styles.itemInnerButtonsContainer}>
        <FAB
          icon={({ color, size }) => (
            <Entypo
              name="emoji-sad"
              color={selectedMood === "sad" ? "red" : "white"}
              size={size}
            />
          )}
          style={styles.fabInput}
          onPress={selectSadHandler}
          backgroundColor={
            selectedMood === "sad" ? "#000000" : AppColors.dark_background
          }
          rippleColor={"red"}
        />
        <FAB
          icon={({ color, size }) => (
            <Entypo
              name="emoji-neutral"
              color={selectedMood === "neutral" ? "yellow" : "white"}
              size={size}
            />
          )}
          style={styles.fabInput}
          onPress={selectNeutralHandler}
          backgroundColor={
            selectedMood === "neutral" ? "#000000" : AppColors.dark_background
          }
          rippleColor={"yellow"}
        />
        <FAB
          icon={({ color, size }) => (
            <Entypo
              name="emoji-happy"
              color={selectedMood === "happy" ? "green" : "white"}
              size={size}
            />
          )}
          style={styles.fabInput}
          onPress={selectHappyHandler}
          backgroundColor={
            selectedMood === "happy" ? "#000000" : AppColors.dark_background
          }
          rippleColor={"green"}
        />
      </View>
    </Pressable>
  );
}

export default HomeListItem;

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
  pressed: {
    opacity: 0.75,
  },
  itemInnerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  fabInput: {
    marginHorizontal: 8,
  },
});
