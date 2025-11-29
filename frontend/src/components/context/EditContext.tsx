import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

export enum EditMode {
  Edit,
  Create,
}

interface EditContextType {
  mode: EditMode;
  hotel: utils.Hotel | null;
  rooms: { room: utils.HotelRoom; isNew: boolean }[];
  roomToEdit: utils.HotelRoom | null;
  setMode: (mode: EditMode) => void;
  setHotel: (hotel: utils.Hotel) => void;
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
  const [mode, setMode] = useState<EditMode>(EditMode.Edit);
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
    mode,
    hotel,
    rooms,
    roomToEdit,
    setMode,
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
