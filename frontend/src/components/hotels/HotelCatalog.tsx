import { useState, useEffect } from "react";

import * as utils from "../../utils/utils";
import RoomCard from "./hotel-rooms/RoomCard";

const HotelCatalog = () => {
  const [hotels, setHotels] = useState<utils.Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels().finally(() => setLoading(false));
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotels?limit=${utils.limit.toString()}&offset=${utils.offset.toString()}`
      );
      const data: utils.Hotel[] = await response.json();
      setHotels(data);
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  return (
    <section className="hotel-catalog">
      <h1>Все гостиницы</h1>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="rooms-list">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <h3>{hotel.title}</h3>
              <p>{hotel.description}</p>
              <RoomCard hotelId={hotel.id} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HotelCatalog;
