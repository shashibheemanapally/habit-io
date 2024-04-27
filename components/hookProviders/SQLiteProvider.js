import React, { createContext, useContext } from "react";
import * as SQLite from "expo-sqlite";

// Create a context to hold the SQLite database instance
const SQLiteContext = createContext(null);

// Custom hook to access the SQLite database instance
export const useSQLite = () => useContext(SQLiteContext);

// Component to initialize the SQLite database instance and provide it through context
export const SQLiteProvider = ({ children }) => {
  const db = SQLite.openDatabase("habit_io_draft.db");

  return <SQLiteContext.Provider value={db}>{children}</SQLiteContext.Provider>;
};
