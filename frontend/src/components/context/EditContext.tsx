import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

export enum EditMode {
  Edit,
  Create,
  None,
}

interface EditContextType {
  hotelMode: EditMode;
  roomMode: EditMode;
  hotel: utils.Hotel | null;
  rooms: { room: utils.HotelRoom; isNew: boolean }[];
  roomToEdit: utils.HotelRoom | null;
  setHotelMode: (mode: EditMode) => void;
  setRoomMode: (mode: EditMode) => void;
  setHotel: (hotel: utils.Hotel | null) => void;
  setRooms: (room: { room: utils.HotelRoom; isNew: boolean }[]) => void;
  updateRoom: (room: utils.HotelRoom) => void;
  removeRoom: (room: utils.HotelRoom) => void;
  setRoomToEdit: (room: utils.HotelRoom) => void;
}

const EditContext = createContext<EditContextType | null>(null);

export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotel, setHotel] = useState<utils.Hotel | null>(null);
  const [rooms, setRooms] = useState<
    { room: utils.HotelRoom; isNew: boolean }[]
  >([]);
  const [hotelMode, setHotelMode] = useState<EditMode>(EditMode.None);
  const [roomMode, setRoomMode] = useState<EditMode>(EditMode.None);
  const [roomToEdit, setRoomToEdit] = useState<utils.HotelRoom | null>(null);

  const updateRoom = (room: utils.HotelRoom) => {
    setRooms((prev) =>
      prev.map((prevRoom) =>
        prevRoom.room._id === room._id
          ? { room: room, isNew: prevRoom.isNew }
          : { room: prevRoom.room, isNew: prevRoom.isNew }
      )
    );
  };

  const removeRoom = (room: utils.HotelRoom) => {
    setRooms((prev) =>
      prev.filter((prevRoom) => prevRoom.room._id !== room._id)
    );
  };

  const value: EditContextType = {
    hotelMode,
    roomMode,
    hotel,
    rooms,
    roomToEdit,
    setHotelMode,
    setRoomMode,
    setHotel,
    setRooms,
    updateRoom,
    removeRoom,
    setRoomToEdit,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEdit = () => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error("useEdit must be used within a EditProvider");
  }
  return context;
};
