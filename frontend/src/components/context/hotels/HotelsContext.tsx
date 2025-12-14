import React, { createContext, useContext, useState } from "react";

import * as utils from "../../../utils/utils";

export enum HotelCardMode {
  Common,
  Catalog,
  None,
}

export enum RoomCardMode {
  Common,
  Create,
  Hotel,
  HotelCatalog,
  None,
}

interface HotelsContextType {
  returnToMain: boolean;
  hotels: utils.Hotel[];
  rooms: utils.HotelRoom[];
  setHotels: (hotel: utils.Hotel[]) => void;
  setRooms: (rooms: utils.HotelRoom[]) => void;
  setReturnToMain: (flag: boolean) => void;
}

const HotelsContext = createContext<HotelsContextType | null>(null);

export const HotelsProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotels, setHotels] = useState<utils.Hotel[]>([]);
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [returnToMain, setReturnToMain] = useState<boolean>(true);

  const value: HotelsContextType = {
    hotels,
    rooms,
    returnToMain,
    setHotels,
    setRooms,
    setReturnToMain,
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
