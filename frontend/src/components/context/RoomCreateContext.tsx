import React, { createContext, useContext, useCallback, useState } from "react";

import * as utils from "../../utils/utils";

interface RoomCreateContextType {
  onHandleSubmit: (room: utils.HotelRoom) => void;
  setOnHandleSubmit: (handler: (room: utils.HotelRoom) => void) => void;
}

const RoomCreateContext = createContext<RoomCreateContextType | null>(null);

export const RoomCreateProvider = ({
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

  const value: RoomCreateContextType = {
    onHandleSubmit,
    setOnHandleSubmit,
  };

  return (
    <RoomCreateContext.Provider value={value}>
      {children}
    </RoomCreateContext.Provider>
  );
};

export const useRoomCreate = () => {
  const context = useContext(RoomCreateContext);
  if (!context) {
    throw new Error("useRoomCreate must be used within a RoomCreateProvider");
  }
  return context;
};
