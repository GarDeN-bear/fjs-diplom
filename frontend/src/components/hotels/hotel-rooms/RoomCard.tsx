import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import * as utils from "../../../utils/utils";

interface RoomCardProps {
  hotelId?: string;
  roomId?: string;
}

const RoomCard = ({ hotelId, roomId }: RoomCardProps) => {
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [room, setRoom] = useState<utils.HotelRoom>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelId) {
      fetchRooms().finally(() => setLoading(false));
    } else {
      fetchRoom().finally(() => setLoading(false));
    }
  }, [hotelId, roomId]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotel-rooms?limit=${utils.limit.toString()}&offset=${utils.offset.toString()}&hotel=${{
          hotelId,
        }}`
      );
      const data: utils.HotelRoom[] = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const fetchRoom = async () => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/common/hotel-rooms/${roomId}`
      );
      const data: utils.HotelRoom = await response.json();
      setRoom(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <section className="rooms-card">
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="rooms-list">
          {room?.id} ? (
          {room?.images.map((imag) => (
            <div key={room.id} className="room-card">
              <img src={imag} alt="Комната" width="200" />
            </div>
          ))}
          <p>{room?.description}</p>) : (
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              {roomId} ? (<p>{room.description}</p>)
              {room.images.length > 0 && (
                <Link to={`/room/${room.id}`}>
                  <img src={room.images[0]} alt="Комната" width="200" />
                </Link>
              )}
            </div>
          ))}
          )
        </div>
      )}
    </section>
  );
};

export default RoomCard;
