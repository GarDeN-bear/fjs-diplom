import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelsCatalog";
import HotelCard from "./hotels/HotelCard";
import { SearchProvider } from "./context/SearchContext";
import RoomEdit from "./hotels/hotel-rooms/RoomEdit";
import HotelEdit from "./hotels/HotelEdit";
import { HotelCardProvider } from "./context/HotelCardContext";
import { RoomCardProvider } from "./context/RoomCardContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HotelCardProvider>
      <RoomCardProvider>
        <SearchProvider>{children}</SearchProvider>
      </RoomCardProvider>
    </HotelCardProvider>
  );
};

//!TODO
const Main = () => {
  return (
    <section className="container-main">
      <AppProviders>
        <Routes>
          <Route path="/" element={<HotelCatalog />} />
          <Route path="/search" element={<HotelCatalog />} />
          <Route path="/room/edit/:id" element={<RoomEdit />} />
          <Route path="/room/create" element={<RoomEdit />} />
          <Route path="/hotel/:id" element={<HotelCard />} />
          <Route path="/hotel/edit/" element={<HotelEdit />} />
          <Route path="/hotel/create/" element={<HotelEdit />} />
        </Routes>
      </AppProviders>
    </section>
  );
};

export default Main;
