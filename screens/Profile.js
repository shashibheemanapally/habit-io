import { Pressable, TextInput, View } from "react-native";
import { StyleSheet, Text } from "react-native";
import AppColors from "../constants/AppColors";
import React, { useState } from "react";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function Profile({}) {
  const db = useSQLite();
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * from user_info`,
          [],
          (_, { rows: { _array } }) => {
            if (_array.length !== 0) {
              setUserName(_array[0].name);
            }
          }
        );
      });

      return () => {};
    }, [])
  );

  function submitNameHandler() {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * from user_info`,
        [],
        (_, { rows: { _array } }) => {
          if (_array.length === 0) {
            tx.executeSql(
              "INSERT INTO user_info (name) VALUES (?);",
              [userName],
              () => {
                console.log("new name inserted");
              },
              (tx, error) => console.log(error)
            );
          } else {
            tx.executeSql(
              "UPDATE user_info set name=? where user_id=1;",
              [userName],
              () => {
                console.log(" name updated");
              },
              (tx, error) => console.log(error)
            );
          }
        }
      );
    });
    navigation.navigate("Home", {});
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headingText}>Profile</Text>
        <View style={styles.separator}></View>
        <TextInput
          style={styles.nameInput}
          value={userName}
          onChangeText={(text) => {
            setUserName(text);
          }}
        ></TextInput>
        <Button mode="contained" onPress={submitNameHandler}>
          submit
        </Button>
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
  nameInput: {
    width: "auto",
    backgroundColor: "black",
    marginVertical: 16,
    marginHorizontal: 24,
    padding: 15,
    borderRadius: 8,
    color: "white",
    fontFamily: "regular",
  },
});
