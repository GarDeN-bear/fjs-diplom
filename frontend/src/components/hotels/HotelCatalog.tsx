import { useState, useEffect } from "react";

import * as utils from "../../utils/utils";
import RoomCard from "./hotel-rooms/RoomCard";
import { Link } from "react-router-dom";

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
        <div className="hotels-list">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="hotel-card">
              <RoomCard hotelId={hotel._id} />
              <div className="hotel-card-description">
                <h3>{hotel.title}</h3>
                <p>{hotel.description}</p>
                <Link to={`/room/${hotel._id}`}>
                  <button>Подробнее</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HotelCatalog;
