import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

export enum HotelsMode {
  Common,
  Search,
  None,
}

interface HotelsContextType {
  mode: HotelsMode;
  hotels: utils.Hotel[];
  rooms: utils.HotelRoom[];
  setHotels: (hotel: utils.Hotel[]) => void;
  setRooms: (rooms: utils.HotelRoom[]) => void;
  setMode: (mode: HotelsMode) => void;
}

const HotelsContext = createContext<HotelsContextType | null>(null);

export const HotelsProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotels, setHotels] = useState<utils.Hotel[]>([]);
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [mode, setMode] = useState<HotelsMode>(HotelsMode.None);

  const value: HotelsContextType = {
    mode,
    hotels,
    rooms,
    setMode,
    setHotels,
    setRooms,
  };

  return (
    <HotelsContext.Provider value={value}>{children}</HotelsContext.Provider>
  );
};

export const useHotels = () => {
  const context = useContext(HotelsContext);
  if (!context) {
    throw new Error("useHotels must be used within a HotelsProvider");
  }
  return context;
};
