import { useState, useEffect } from "react";
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const limit: number = 10;
const offset: number = 0;

interface Hotel {
  id: string;
  title: string;
}

interface HotelRoom {
  id: string;
  description: string;
  images: string[];
  hotel: Hotel;
}

const HotelRoomsCatalog = (hotelId: string = "0") => {
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms().finally(() => setLoading(false));
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/common/hotel-rooms?limit=${limit.toString()}&offset=${offset.toString()}&ID=${hotelId}`
      );
      const data: HotelRoom[] = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <section className="catalog">
      <h1>Номера</h1>
      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h3>{room.hotel.title}</h3>
            <p>{room.description}</p>
            {room.images.length > 0 && (
              <img src={room.images[0]} alt="Номер" width="200" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HotelRoomsCatalog;
