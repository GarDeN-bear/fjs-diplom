import React, { createContext, useContext, useState } from "react";

import * as utils from "../../../utils/utils";

interface HotelCreateContextType {
  hotel: utils.Hotel;
  rooms: utils.HotelRoom[];
  setHotel: (hotel: utils.Hotel) => void;
  setRooms: (room: utils.HotelRoom[]) => void;
}

const HotelCreateContext = createContext<HotelCreateContextType | null>(null);

export const HotelCreateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hotel, setHotel] = useState<utils.Hotel>(utils.emptyHotel);
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);

  const value: HotelCreateContextType = {
    hotel,
    rooms,
    setHotel,
    setRooms,
  };

  return (
    <HotelCreateContext.Provider value={value}>
      {children}
    </HotelCreateContext.Provider>
  );
};

export const useHotelCreate = () => {
  const context = useContext(HotelCreateContext);
  if (!context) {
    throw new Error("useHotelCreate must be used within a HotelCreateProvider");
  }
  return context;
};
