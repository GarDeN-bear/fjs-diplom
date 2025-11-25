import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

interface RoomsContextType {
  hotelRooms: utils.CreateHotelRoomForm[];
  addRoom: (room: utils.CreateHotelRoomForm) => void;
  addRooms: (rooms: utils.CreateHotelRoomForm[]) => void;
  removeRoom: (id: number) => void;
  clearRooms: () => void;
}

const RoomsContext = createContext<RoomsContextType | null>(null);

export const RoomsProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotelRooms, setRooms] = useState<utils.CreateHotelRoomForm[]>([]);

  const addRoom = (room: utils.CreateHotelRoomForm) => {
    setRooms((prev) => [...prev, room]);
  };

  const addRooms = (rooms: utils.CreateHotelRoomForm[]) => {
    setRooms(rooms);
  };

  const clearRooms = () => {
    setRooms([]);
  };

  const removeRoom = (id: number) => {};

  const value: RoomsContextType = {
    hotelRooms,
    addRoom,
    addRooms,
    removeRoom,
    clearRooms,
  };

  return (
    <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomsProvider");
  }
  return context;
};
