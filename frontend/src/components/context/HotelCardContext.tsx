import React, { createContext, useContext, useState } from "react";
import * as utils from "../../utils/utils";

export enum HotelCardMode {
  Common,
  Catalog,
}
interface HotelCardContextType {
  mode: HotelCardMode;
  hotel: utils.Hotel | null;
  setHotel: (hotel: utils.Hotel) => void;
  setMode: (mode: HotelCardMode) => void;
}

const HotelCardContext = createContext<HotelCardContextType | null>(null);

export const HotelCardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<HotelCardMode>(HotelCardMode.Common);
  const [hotel, setHotel] = useState<utils.Hotel | null>(null);

  const value: HotelCardContextType = {
    mode,
    hotel,
    setMode,
    setHotel,
  };

  return (
    <HotelCardContext.Provider value={value}>
      {children}
    </HotelCardContext.Provider>
  );
};

export const useHotelCard = () => {
  const context = useContext(HotelCardContext);
  if (!context) {
    throw new Error("useHotelCard must be used within a HotelCardProvider");
  }
  return context;
};
