import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

interface HotelEditContextType {
  hotel: utils.Hotel | null;
  rooms: utils.HotelRoom[];
  updatedRoom: utils.HotelRoom | null;
  setHotel: (hotel: utils.Hotel) => void;
  setRooms: (room: utils.HotelRoom[]) => void;
  updateRoom: (room: utils.HotelRoom | null) => void;
  removeRoom: (room: utils.HotelRoom) => void;
}

const HotelEditContext = createContext<HotelEditContextType | null>(null);

export const HotelEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hotel, setHotel] = useState<utils.Hotel | null>(null);
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);

  const updateRoom = (room: utils.HotelRoom | null) => {
    if (!room) {
      return;
    }

    setRooms((prev) =>
      prev.map((prevRoom) => (prevRoom.id === room.id ? room : prevRoom))
    );
  };

  const removeRoom = (room: utils.HotelRoom) => {
    setRooms((prev) => prev.filter((prevRoom) => prevRoom.id !== room.id));
  };

  const value: HotelEditContextType = {
    hotel,
    rooms,
    updatedRoom,
    setHotel,
    setRooms,
    updateRoom,
    removeRoom,
  };

  return (
    <HotelEditContext.Provider value={value}>
      {children}
    </HotelEditContext.Provider>
  );
};

export const useHotelEdit = () => {
  const context = useContext(HotelEditContext);
  if (!context) {
    throw new Error("useHotelEdit must be used within a HotelEditProvider");
  }
  return context;
};
