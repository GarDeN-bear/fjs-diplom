import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelCatalog";
import RoomCard from "./hotels/hotel-rooms/RoomCard";
import HotelCard from "./hotels/HotelCard";
import HotelCreate from "./hotels/HotelCreate";
import HotelRoomCreate from "./hotels/hotel-rooms/HotelRoomCreate";
import { RoomsProvider } from "./context/RoomsContext";
import { SearchProvider } from "./context/SearchContext";
import { HotelEditProvider } from "./context/HotelEditContext";
import RoomEdit from "./hotels/hotel-rooms/RoomEdit";
import HotelEdit from "./hotels/HotelEdit";

//!TODO
const Main = () => {
  return (
    <div className="container-main">
      <RoomsProvider>
        <SearchProvider>
          <HotelEditProvider>
          <Routes>
            <Route path="/" element={<HotelCatalog />} />
            <Route path="/search" element={<HotelCatalog search={true} />} />
            <Route path="/room/:id" element={<RoomCard />} />
            <Route path="/room-edit/:id" element={<RoomEdit />} />
            <Route path="/hotel/:id" element={<HotelCard />} />
            <Route path="/hotel-edit/" element={<HotelEdit />} />
            <Route path="/hotel-create/" element={<HotelCreate />} />
            <Route path="/hotel-room-create/" element={<HotelRoomCreate />} />
          </Routes>
          </HotelEditProvider>
        </SearchProvider>
      </RoomsProvider>
    </div>
  );
};

export default Main;
