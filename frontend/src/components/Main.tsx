import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelCatalog";
import RoomCard from "./hotels/hotel-rooms/RoomCard";
import HotelCreate from "./hotels/HotelCreate";

//!TODO
const Main = () => {
  return (
    <div className="container-main">
      <Routes>
        <Route path="/" element={<HotelCatalog />} />
        <Route path="/room/:id" element={<RoomCard roomId=":id" />} />
        <Route path="/hotel-create/" element={<HotelCreate />} />
      </Routes>
    </div>
  );
};

export default Main;
