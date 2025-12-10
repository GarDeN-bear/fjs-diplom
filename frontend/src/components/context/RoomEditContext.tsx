import React, { createContext, useCallback, useContext, useState } from "react";

import * as utils from "../../utils/utils";

interface RoomEditContextType {
  room: utils.HotelRoom;
  setRoom: (room: utils.HotelRoom) => void;
  onHandleSubmit: (room: utils.HotelRoom) => void;
  setOnHandleSubmit: (handler: (room: utils.HotelRoom) => void) => void;
}

const RoomEditContext = createContext<RoomEditContextType | null>(null);

export const RoomEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onHandleSubmit, setOnHandleSubmitInternal] = useState<
    (room: utils.HotelRoom) => void
  >(() => {});

  const setOnHandleSubmit = useCallback(
    (handler: (room: utils.HotelRoom) => void) => {
      setOnHandleSubmitInternal(() => handler);
    },
    []
  );

  const [room, setRoom] = useState<utils.HotelRoom>(utils.emptyRoom);

  const value: RoomEditContextType = {
    room,
    setRoom,
    onHandleSubmit,
    setOnHandleSubmit,
  };

  return (
    <RoomEditContext.Provider value={value}>
      {children}
    </RoomEditContext.Provider>
  );
};

export const useRoomEdit = () => {
  const context = useContext(RoomEditContext);
  if (!context) {
    throw new Error("useRoomEdit must be used within a RoomEditProvider");
  }
  return context;
};
