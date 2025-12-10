import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelsCatalog";
import HotelCard from "./hotels/HotelCard";
import { HotelsSearchProvider } from "./context/HotelsSearchContext";
import RoomEdit from "./hotels/hotel-rooms/RoomEdit";
import HotelEdit from "./hotels/HotelEdit";
import {
  HotelCardMode,
  HotelsProvider,
  RoomCardMode,
} from "./context/HotelsContext";
import RoomCard from "./hotels/hotel-rooms/RoomCard";
import { HotelCreateProvider } from "./context/HotelCreateContext";
import RoomCreate from "./hotels/hotel-rooms/RoomCreate";
import { RoomCreateProvider } from "./context/RoomCreateContext";
import { HotelEditProvider } from "./context/HotelEditContext";
import { RoomEditProvider } from "./context/RoomEditContext";
import HotelCreate from "./hotels/HotelCreate";
import HotelsSearch from "./hotels/HotelsSearch";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HotelsProvider>
      <HotelsSearchProvider>
        <HotelEditProvider>
          <RoomEditProvider>
            <HotelCreateProvider>
              <RoomCreateProvider>
                <HotelsProvider>{children}</HotelsProvider>
              </RoomCreateProvider>
            </HotelCreateProvider>
          </RoomEditProvider>
        </HotelEditProvider>
      </HotelsSearchProvider>
    </HotelsProvider>
  );
};

//!TODO
const Main = () => {
  return (
    <section className="container-main">
      <AppProviders>
        <Routes>
          <Route path="/" element={<HotelCatalog />} />
          <Route path="/search" element={<HotelsSearch />} />
          <Route path="/room/edit/:id" element={<RoomEdit />} />
          <Route path="/room/create" element={<RoomCreate />} />
          <Route
            path="/hotel/:id"
            element={<HotelCard mode={HotelCardMode.Common} />}
          />
          <Route
            path="/room/:id"
            element={<RoomCard mode={RoomCardMode.Common} />}
          />
          <Route path="/hotel/edit/:id" element={<HotelEdit />} />
          <Route path="/hotel/create" element={<HotelCreate />} />
        </Routes>
      </AppProviders>
    </section>
  );
};

export default Main;
