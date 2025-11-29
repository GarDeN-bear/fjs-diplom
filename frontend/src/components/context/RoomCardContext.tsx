import React, { createContext, useContext, useState } from "react";

export enum RoomCardMode {
  Common,
  Catalog,
  HotelCatalog,
  HotelEdit,
}
interface RoomCardContextType {
  mode: RoomCardMode;
  setMode: (mode: RoomCardMode) => void;
}

const RoomCardContext = createContext<RoomCardContextType | null>(null);

export const RoomCardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<RoomCardMode>(RoomCardMode.Common);

  const value: RoomCardContextType = {
    mode,
    setMode,
  };

  return (
    <RoomCardContext.Provider value={value}>
      {children}
    </RoomCardContext.Provider>
  );
};

export const useRoomCard = () => {
  const context = useContext(RoomCardContext);
  if (!context) {
    throw new Error("useRoomCard must be used within a RoomCardProvider");
  }
  return context;
};
