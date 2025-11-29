import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelsCatalog";
import RoomCard from "./hotels/hotel-rooms/RoomCard";
import HotelCard from "./hotels/HotelCard";
import { SearchProvider } from "./context/SearchContext";
import RoomEdit from "./hotels/hotel-rooms/RoomEdit";
import HotelEdit from "./hotels/HotelEdit";
import { HotelCardProvider } from "./context/HotelCardContext";
import { RoomCardProvider } from "./context/RoomCardContext";

//!TODO
const Main = () => {
  return (
    <section className="container-main">
      <HotelCardProvider>
        <RoomCardProvider>
          <SearchProvider>
            <Routes>
              <Route path="/" element={<HotelCatalog />} />
              <Route path="/search" element={<HotelCatalog />} />
              <Route path="/room/:id" element={<RoomCard />} />
              <Route path="/room-edit/:id" element={<RoomEdit />} />
              <Route path="/hotel/:id" element={<HotelCard />} />
              <Route path="/hotel/edit/" element={<HotelEdit />} />
              <Route path="/hotel/create/" element={<HotelEdit />} />
              <Route path="/hotel-room-reservation/" element={<RoomCard />} />
            </Routes>
          </SearchProvider>
        </RoomCardProvider>
      </HotelCardProvider>
    </section>
  );
};

export default Main;
