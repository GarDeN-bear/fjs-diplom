import { Route, Routes } from "react-router-dom";
import HotelCatalog from "./hotels/HotelCatalog";

//!TODO
const Main = () => {
  return (
    <div className="container-main">
      <Routes>
        <Route path="/" element={<HotelCatalog />} />
      </Routes>
    </div>
  );
};

export default Main;
