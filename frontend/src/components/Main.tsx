import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelCatalog";
import RoomCard from "./hotels/hotel-rooms/RoomCard";
import HotelCreate from "./hotels/HotelCreate";
import HotelRoomCreate from "./hotels/hotel-rooms/HotelRoomCreate";
import { RoomProvider } from "./context/RoomContext";

//!TODO
const Main = () => {
  return (
    <div className="container-main">
      <RoomProvider>
        <Routes>
          <Route path="/" element={<HotelCatalog />} />
          <Route path="/search" element={<HotelCatalog search={true} />} />
          <Route path="/room/:id" element={<RoomCard roomId=":id" />} />
          <Route path="/hotel-create/" element={<HotelCreate />} />
          <Route path="/hotel-room-create/" element={<HotelRoomCreate />} />
        </Routes>
      </RoomProvider>
    </div>
  );
};

export default Main;
