import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelsCatalog";
import RoomCard from "./hotels/hotel-rooms/RoomCard";
import HotelCard from "./hotels/HotelCard";
import HotelCreate from "./hotels/HotelCreate";
import RoomCreate from "./hotels/hotel-rooms/RoomCreate";
import { RoomsProvider } from "./context/RoomsContext";
import { SearchProvider } from "./context/SearchContext";
import { EditProvider } from "./context/EditContext";
import RoomEdit from "./hotels/hotel-rooms/RoomEdit";
import HotelEdit from "./hotels/HotelEdit";

//!TODO
const Main = () => {
  return (
    <section className="container-main">
      <RoomsProvider>
        <SearchProvider>
          <EditProvider>
            <Routes>
              <Route path="/" element={<HotelCatalog />} />
              <Route path="/search" element={<HotelCatalog />} />
              <Route path="/room/:id" element={<RoomCard />} />
              <Route path="/room-edit/:id" element={<RoomEdit />} />
              <Route path="/hotel/:id" element={<HotelCard />} />
              <Route path="/hotel/edit/" element={<HotelEdit />} />
              <Route path="/hotel/create/" element={<HotelEdit />} />
              <Route path="/hotel-room-create/" element={<RoomCreate />} />
              <Route
                path="/hotel-room-reservation/"
                element={<RoomCard/>}
              />
            </Routes>
          </EditProvider>
        </SearchProvider>
      </RoomsProvider>
    </section>
  );
};

export default Main;
