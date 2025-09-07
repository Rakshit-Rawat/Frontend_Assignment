import React, { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [rows, setRows] = useState([]); // array of product rows
  return <DataContext.Provider value={{ rows, setRows }}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
