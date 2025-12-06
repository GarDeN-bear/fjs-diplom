import React, { createContext, useContext, useState } from "react";

import * as utils from "../../utils/utils";

export enum EditMode {
  Edit,
  Create,
  None,
}

export enum ActionMode {
  Edit,
  Create,
  Remove,
  None,
}

interface EditContextType {
  hotelMode: EditMode;
  roomMode: EditMode;
  hotel: utils.Hotel;
  hotelClear: boolean;
  //TODO уйти от флага (использовать File как идентификаторов новости)
  rooms: { room: utils.HotelRoom; mode: ActionMode }[];
  roomToEdit: utils.HotelRoom;
  roomsToRemove: utils.HotelRoom[];
  setHotelMode: (mode: EditMode) => void;
  setRoomMode: (mode: EditMode) => void;
  setHotel: (hotel: utils.Hotel) => void;
  setHotelClear: (hotelClear: boolean) => void;
  setRooms: (room: { room: utils.HotelRoom; mode: ActionMode }[]) => void;
  updateRoom: (room: utils.HotelRoom) => void;
  removeRoom: (room: utils.HotelRoom, isEditMode?: boolean) => void;
  setRoomToEdit: (room: utils.HotelRoom) => void;
  setRoomsToRemove: (rooms: utils.HotelRoom[]) => void;
}

const EditContext = createContext<EditContextType | null>(null);

export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotel, setHotel] = useState<utils.Hotel>(utils.emptyHotel);
  const [rooms, setRooms] = useState<
    { room: utils.HotelRoom; mode: ActionMode }[]
  >([]);
  const [hotelMode, setHotelMode] = useState<EditMode>(EditMode.None);
  const [hotelClear, setHotelClear] = useState<boolean>(true);
  const [roomMode, setRoomMode] = useState<EditMode>(EditMode.None);
  const [roomToEdit, setRoomToEdit] = useState<utils.HotelRoom>(
    utils.emptyRoom
  );

  const updateRoom = (room: utils.HotelRoom) => {
    setRooms((prev) =>
      prev.map((prevRoom) =>
        prevRoom.room._id === room._id
          ? { room: room, mode: prevRoom.mode }
          : { room: prevRoom.room, mode: prevRoom.mode }
      )
    );
    setRoomToEdit(room);
  };

  const removeRoom = (room: utils.HotelRoom, isEditMode?: boolean) => {
    if (isEditMode) {
      setRooms(
        rooms.map((prevRoom) =>
          prevRoom.room._id === room._id
            ? { ...prevRoom, mode: ActionMode.Remove }
            : prevRoom
        )
      );
    } else {
      setRooms(rooms.filter((prevRoom) => prevRoom.room !== room));
    }
  };

  const value: EditContextType = {
    hotelMode,
    roomMode,
    hotel,
    hotelClear,
    rooms,
    roomToEdit,
    setHotelMode,
    setRoomMode,
    setHotel,
    setHotelClear,
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
