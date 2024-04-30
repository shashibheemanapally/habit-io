import * as SQLite from "expo-sqlite";

export function setupDbTablesForce() {
  const db = SQLite.openDatabase("habit_io_draft.db");
  console.log("creating db tables if not exists");
  db.transaction(
    (tx) => {
      tx.executeSql(
        "create TABLE IF NOT EXISTS habits (habit_id integer primary key not NULL, habit_desc text Not NULL,start_date text NOT NULL,schedule_info text NOT NULL, hidden integer NOT NULL);"
      );
      tx.executeSql(
        "create TABLE IF NOT EXISTS habit_inputs (cal_date text NOT NULL, habit_id integer Not NULL, perf integer not NULL, PRIMARY KEY(cal_date, habit_id));"
      );
      tx.executeSql(
        "create TABLE IF NOT EXISTS user_pref (key text primary key not NULL, value text Not NULL);"
      );
    },
    (error) => console.log(error),
    () => {
      console.log("transaction success");
    }
  );
}

export function setupDbTables() {
  try {
    const db = SQLite.openDatabase("habit_io_draft.db");

    const doesLocalTablesExist = checkIfLocalTablesExists(db);
    console.log("doesLocalTablesExist ", doesLocalTablesExist);
    if (!doesLocalTablesExist) {
      const doesRemoteTablesExist = checkIfRemoteTablesExists();
      if (doesRemoteTablesExist) {
        console.log("downlaoding db tables");
        //downloadRemoteTables()
        //setupDbTables()
        //return
      } else {
        console.log("creating db tables if not exists");
        db.transaction(
          (tx) => {
            tx.executeSql(
              "create TABLE IF NOT EXISTS habits (habit_id integer primary key not NULL, habit_desc text Not NULL,start_date text NOT NULL,schedule_info text NOT NULL, hidden integer NOT NULL);"
            );
            tx.executeSql(
              "create TABLE IF NOT EXISTS habit_inputs (cal_date text NOT NULL, habit_id integer Not NULL, perf integer not NULL, PRIMARY KEY(cal_date, habit_id));"
            );
          },
          (error) => console.log(error)
        );
      }
    }
    console.log("db tables exists");
  } catch (error) {
    console.error("Error setting up tables:", error);
  }
}

function checkIfLocalTablesExists(db) {
  console.log("checkIfLocalTablesExists 1");
  let doesLocalTablesExist = true;

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='habits';",
      [],
      (_, { rows }) => {
        if (rows.length < 1) {
          console.log("rows.length ", rows.length);
          doesLocalTablesExist = false;
        }
      }
    );
    tx.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='habit_inputs';",
      [],
      (_, { rows }) => {
        if (rows.length < 1) {
          console.log("rows.length ", rows.length);
          doesLocalTablesExist = false;
        }
      }
    );
  });
  console.log("checkIfLocalTablesExists 2");
  console.log("doesLocalTablesExist ", doesLocalTablesExist);
  return doesLocalTablesExist;
}

function checkIfRemoteTablesExists() {
  return false;
}

//INSERT INTO habits (habit_desc, start_date, schedule_info, hidden) VALUES ('habbit 3', '20241234', 'onmondays', 0);
//INSERT INTO habit_inputs (cal_date, habit_id, perf) VALUES ('2024123', 4, 0);
//SELECT * FROM habits LEFT JOIN habit_inputs ON habits.habit_id = habit_inputs.habit_id and habit_inputs.cal_date='20240427';
// tx.executeSql("select * from habits;", [], (_, { rows }) =>
//       console.log(JSON.stringify(rows))
//     );
//     tx.executeSql("DELETE from habits;", [], (_, { rows }) =>
//       console.log(JSON.stringify(rows))
//     );

export function addNewHabit(habit_desc, start_date, schedule_info, db) {
  console.log(habit_desc);
  console.log(start_date);
  console.log(schedule_info);
  let transactionComplete = true;
  if (
    !(
      isValidHabitDesc(habit_desc) &&
      isValidStartDate(start_date) &&
      isValidScheduleInfo(schedule_info)
    )
  ) {
    return false;
  }

  db.transaction(
    (tx) => {
      tx.executeSql(
        "INSERT INTO habits (habit_desc, start_date, schedule_info, hidden) VALUES (?, ?, ?, ?);",
        [habit_desc, start_date, schedule_info, 0],
        () => {
          console.log("new habit inserted");
        },
        (tx, error) => console.log(error)
      );
    },
    (error) => {
      transactionComplete = false;
    },
    null
  );

  return transactionComplete;
}

function isValidHabitDesc(habit_desc) {
  if (habit_desc.length === 0) {
    return false;
  }
  return true;
}

function isValidStartDate(start_date) {
  if (!isValidDate(start_date)) {
    return false;
  }
  return true;
}

function isValidScheduleInfo(schedule_info) {
  //weekdays|1|0,1,2,3,4,5,6      : weekdays with given week frequency
  //fixeddays|3                   : with given fixed days frequency from start date
  //yeardays|0526,0629            : with given days of year

  //0 for Sunday, 1 for Monday, 2 for Tuesday, and so on
  try {
    if (schedule_info.length === 0) {
      return false;
    }

    const scheduleElements = schedule_info.split("|");

    if (scheduleElements.length < 2) {
      return false;
    }

    if (scheduleElements[0] === "weekdays") {
      if (!isPositiveNumber(scheduleElements[1])) {
        return false;
      }
      const days = scheduleElements[2].split(",");
      for (let i = 0; i < days.length; i++) {
        if (!isPositiveSingleDigitOrZero(days[i])) {
          return false;
        }
      }
    } else if (scheduleElements[0] === "fixeddays") {
      if (!isPositiveNumber(scheduleElements[1])) {
        return false;
      }
    } else if (scheduleElements[0] === "yeardays") {
      if (!isPositiveNumber(scheduleElements[1])) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

function isValidHidden(hidden) {
  return hidden === "0" || hidden === "1";
}

function isValidDate(dateString) {
  if (!/^\d{8}$/.test(dateString)) return false;

  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(4, 6)) - 1;
  const day = parseInt(dateString.substring(6, 8));

  const date = new Date(year, month, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}

function isPositiveNumber(str) {
  // Regular expression to match a positive number
  const regex = /^\d*\.?\d+$/;
  return regex.test(str);
}

function isPositiveSingleDigitOrZero(str) {
  // Regular expression to match a positive single digit or zero
  const regex = /^[0-9]$/;
  return regex.test(str);
}
