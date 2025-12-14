import React, { createContext, useContext, useState } from "react";
import * as utils from "../../../utils/utils";

interface SearchContextType {
  hotels: utils.Hotel[];
  rooms: utils.HotelRoom[];
  hotelName: string;
  dateStart: Date | null;
  dateEnd: Date | null;
  showCalendar: boolean;
  setHotels: (hotel: utils.Hotel[]) => void;
  setRooms: (rooms: utils.HotelRoom[]) => void;
  setHotelName: (name: string) => void;
  setDateStart: (date: Date | null) => void;
  setDateEnd: (date: Date | null) => void;
  setShowCalendar: (state: boolean) => void;
}

const HotelsSearchContext = createContext<SearchContextType | null>(null);

export const HotelsSearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hotels, setHotels] = useState<utils.Hotel[]>([]);
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [hotelName, setHotelName] = useState<string>("");
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const value: SearchContextType = {
    hotels,
    rooms,
    hotelName,
    dateStart,
    dateEnd,
    showCalendar,
    setHotels,
    setRooms,
    setHotelName,
    setDateStart,
    setDateEnd,
    setShowCalendar,
  };

  return (
    <HotelsSearchContext.Provider value={value}>
      {children}
    </HotelsSearchContext.Provider>
  );
};

export const useHotelsSearch = () => {
  const context = useContext(HotelsSearchContext);
  if (!context) {
    throw new Error(
      "useHotelsSearch must be used within a HotelsSearchProvider"
    );
  }
  return context;
};
