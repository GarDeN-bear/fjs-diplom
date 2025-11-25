import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

interface SearchContextType {
  checkInDate: Date | null;
  departureDate: Date | null;
  calendarState: boolean;
  setCheckInDate: (date: Date | null) => void;
  setDepartureDate: (date: Date | null) => void;
  setCalendarState: (state: boolean) => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [calendarState, setCalendarState] = useState<boolean>(true);

  const value: SearchContextType = {
    checkInDate,
    departureDate,
    calendarState,
    setCheckInDate,
    setDepartureDate,
    setCalendarState,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
