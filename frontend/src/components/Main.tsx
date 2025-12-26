import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelsCatalog";
import HotelCard from "./hotels/HotelCard";
import { HotelsSearchProvider } from "./context/hotels/HotelsSearchContext";
import RoomEdit from "./hotels/hotels-management/hotel-rooms/RoomEdit";
import HotelEdit from "./hotels/hotels-management/HotelEdit";
import {
  HotelCardMode,
  HotelsProvider,
  RoomCardMode,
} from "./context/hotels/HotelsContext";
import RoomCard from "./hotels/hotel-rooms/RoomCard";
import { HotelCreateProvider } from "./context/hotels/HotelCreateContext";
import RoomCreate from "./hotels/hotels-management/hotel-rooms/RoomCreate";
import { RoomCreateProvider } from "./context/hotels/RoomCreateContext";
import { HotelEditProvider } from "./context/hotels/HotelEditContext";
import { RoomEditProvider } from "./context/hotels/RoomEditContext";
import HotelCreate from "./hotels/hotels-management/HotelCreate";
import HotelsSearch from "./hotels/hotels-search/HotelsSearch";
import LoginCard from "./auth/LoginCard";
import RegisterCard from "./auth/RegisterCard";
import UserCard from "./auth/UserCard";
import { SocketProvider } from "./context/support/SupportContext";
import SupportCard from "./support/SupportCard";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HotelsProvider>
      <HotelsSearchProvider>
        <HotelEditProvider>
          <RoomEditProvider>
            <HotelCreateProvider>
              <RoomCreateProvider>
                <SocketProvider>
                  <HotelsProvider>{children}</HotelsProvider>
                </SocketProvider>
              </RoomCreateProvider>
            </HotelCreateProvider>
          </RoomEditProvider>
        </HotelEditProvider>
      </HotelsSearchProvider>
    </HotelsProvider>
  );
};

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
          <Route path="/auth/login" element={<LoginCard />} />
          <Route path="/auth/register" element={<RegisterCard />} />
          <Route path="/user" element={<UserCard />} />
          <Route path="/support" element={<SupportCard />} />
        </Routes>
      </AppProviders>
    </section>
  );
};

export default Main;
