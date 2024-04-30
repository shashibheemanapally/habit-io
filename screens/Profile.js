import { Pressable, TextInput, View } from "react-native";
import { StyleSheet, Text, Switch } from "react-native";
import AppColors from "../constants/AppColors";
import React, { useState } from "react";
import { useSQLite } from "../components/hookProviders/SQLiteProvider";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

async function scheduleAfterBedPushNotification() {
  const notiFicationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Rise and shine! 🌄🌄🌄",
      body: "Take a look at the things to do today's",
    },
    trigger: { hour: 9, minute: 0, repeats: true },
  });
  console.log(notiFicationId);
  return notiFicationId;
}

async function scheduleBeforeBedPushNotification() {
  const notiFicationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sleep well! 💤💤💤",
      body: "It's time to give your inputs and hit the bed",
    },
    trigger: { hour: 23, minute: 0, repeats: true },
  });
  console.log(notiFicationId);
  return notiFicationId;
}

async function unSchedulePushNotification(notiFicationId) {
  console.log(notiFicationId);
  await Notifications.cancelScheduledNotificationAsync(notiFicationId);
}

export default function Profile({}) {
  const db = useSQLite();
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  const [isBeforeBedRemEnabled, setIsBeforeBedRemEnabled] = useState(false);
  const [isAfterBedRemEnabled, setIsAfterBedRemEnabled] = useState(false);

  const toggleIsBeforeBedRemEnabledSwitch = async (value) => {
    if (value === false) {
      console.log("turning off evening notification");
      db.transaction(async (tx) => {
        tx.executeSql(
          `SELECT * from user_pref where key = 'isBeforeBedRemEnabled'`,
          [],
          async (_, { rows: { _array } }) => {
            if (_array.length !== 0) {
              const id = _array[0].value;
              await unSchedulePushNotification(id);
            }
          }
        );
        tx.executeSql(
          `DELETE from user_pref where key = 'isBeforeBedRemEnabled'`,
          [],
          null
        );
      });
    } else {
      console.log("turning on evening notification");
      const id = await scheduleBeforeBedPushNotification();
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO user_pref (key, value) VALUES (?, ?);",
          ["isBeforeBedRemEnabled", id],
          null
        );
      });
    }
    setIsBeforeBedRemEnabled(value);
  };

  const toggleIsAfterBedRemEnabledSwitch = async (value) => {
    if (value === false) {
      console.log("turning off morning notification");
      db.transaction(async (tx) => {
        tx.executeSql(
          `SELECT * from user_pref where key = 'isAfterBedRemEnabled'`,
          [],
          async (_, { rows: { _array } }) => {
            if (_array.length !== 0) {
              const id = _array[0].value;
              await unSchedulePushNotification(id);
            }
          }
        );
        tx.executeSql(
          `DELETE from user_pref where key = 'isAfterBedRemEnabled'`,
          [],
          null
        );
      });
    } else {
      console.log("turning on moring notification");
      const id = await scheduleAfterBedPushNotification();
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO user_pref (key, value) VALUES (?, ?);",
          ["isAfterBedRemEnabled", id],
          null
        );
      });
    }
    setIsAfterBedRemEnabled(value);
  };

  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * from user_pref where key = 'userName'`,
          [],
          (_, { rows: { _array } }) => {
            if (_array.length !== 0) {
              setUserName(_array[0].value);
            }
          }
        );
        tx.executeSql(
          `SELECT * from user_pref where key = 'isBeforeBedRemEnabled'`,
          [],
          (_, { rows: { _array } }) => {
            if (_array.length !== 0) {
              setIsBeforeBedRemEnabled(true);
            } else {
              setIsBeforeBedRemEnabled(false);
            }
          }
        );
        tx.executeSql(
          `SELECT * from user_pref where key = 'isAfterBedRemEnabled'`,
          [],
          (_, { rows: { _array } }) => {
            if (_array.length !== 0) {
              setIsAfterBedRemEnabled(true);
            } else {
              setIsAfterBedRemEnabled(false);
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
        `SELECT * from user_pref where key = 'userName'`,
        [],
        (_, { rows: { _array } }) => {
          if (_array.length === 0) {
            tx.executeSql(
              "INSERT INTO user_pref (key, value) VALUES (?, ?);",
              ["userName", userName],
              () => {
                console.log("new name inserted");
              },
              (tx, error) => console.log(error)
            );
          } else {
            tx.executeSql(
              "UPDATE user_pref set value=? where key='userName';",
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
        <Text style={styles.subHeadingText}>Enter your name</Text>
        <TextInput
          style={styles.nameInput}
          value={userName}
          onChangeText={(text) => {
            setUserName(text);
          }}
        ></TextInput>
        <Button
          mode="contained"
          onPress={submitNameHandler}
          style={styles.submitButton}
        >
          submit
        </Button>
        <View style={styles.separator}></View>
        <View style={styles.scheduleContainer}>
          <Text style={styles.subHeadingText}>
            Before bed reminder: 2300 💤
          </Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isBeforeBedRemEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async (value) => {
              await toggleIsBeforeBedRemEnabledSwitch(value);
            }}
            value={isBeforeBedRemEnabled}
          />
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.subHeadingText}>After bed reminder: 0900 🌄</Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isAfterBedRemEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async (value) => {
              await toggleIsAfterBedRemEnabledSwitch(value);
            }}
            value={isAfterBedRemEnabled}
          />
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
    // marginHorizontal: 24,
    padding: 15,
    borderRadius: 8,
    color: "white",
    fontFamily: "regular",
  },
  submitButton: {
    width: 200,
    justifyContent: "center",
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
