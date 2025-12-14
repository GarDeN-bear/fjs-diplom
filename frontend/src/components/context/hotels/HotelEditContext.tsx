import React, { createContext, useContext, useState } from "react";

import * as utils from "../../../utils/utils";

export enum ActionMode {
  Edit,
  Create,
  Remove,
  None,
}

interface HotelEditContextType {
  hotel: utils.Hotel;
  rooms: { room: utils.HotelRoom; mode: ActionMode }[];
  setHotel: (hotel: utils.Hotel) => void;
  setRooms: (room: { room: utils.HotelRoom; mode: ActionMode }[]) => void;
  updateRoom: (room: utils.HotelRoom) => void;
  removeRoom: (room: utils.HotelRoom, isEditMode?: boolean) => void;
}

const HotelEditContext = createContext<HotelEditContextType | null>(null);

export const HotelEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hotel, setHotel] = useState<utils.Hotel>(utils.emptyHotel);
  const [rooms, setRooms] = useState<
    { room: utils.HotelRoom; mode: ActionMode }[]
  >([]);

  const updateRoom = (room: utils.HotelRoom) => {
    setRooms((prev) =>
      prev.map((prevRoom) =>
        prevRoom.room._id === room._id
          ? { room: room, mode: ActionMode.Edit }
          : { room: prevRoom.room, mode: prevRoom.mode }
      )
    );
  };

  const removeRoom = (room: utils.HotelRoom, isEditRoom?: boolean) => {
    if (isEditRoom) {
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

  const value: HotelEditContextType = {
    hotel,
    rooms,
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
