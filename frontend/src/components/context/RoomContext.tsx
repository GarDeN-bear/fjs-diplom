import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

interface RoomContextType {
  hotelRooms: utils.CreateHotelRoomForm[];
  addRoom: (room: utils.CreateHotelRoomForm) => void;
  clearRooms: () => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotelRooms, setRooms] = useState<utils.CreateHotelRoomForm[]>([]);

  const addRoom = (room: utils.CreateHotelRoomForm) => {
    setRooms((prev) => [...prev, room]);
  };

  const clearRooms = () => {
    setRooms([]);
  };

  const value: RoomContextType = {
    hotelRooms,
    addRoom,
    clearRooms,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
};
