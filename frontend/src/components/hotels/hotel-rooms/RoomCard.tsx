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
    if (!hotelId && !roomId) {
      setLoading(false);
      return;
    }

    if (hotelId) {
      fetchRooms().finally(() => setLoading(false));
    } else if (roomId) {
      fetchRoom().finally(() => setLoading(false));
    }
  }, [hotelId, roomId]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotel-rooms?limit=${utils.limit.toString()}&offset=${utils.offset.toString()}&hotel=${hotelId}`
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

  return (
    <section className="rooms-card">
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="rooms-list">
          {room?.id ? (
            <div key={`room-${room.id}`} className="room-card">
              <div className="room-images">
                {room.images.map((image, index) => (
                  <img
                    key={`room-${room.id}-image-${image}`}
                    src={`${utils.VITE_BACKEND_URL}/public/${image}`}
                    alt={`Комната ${index + 1}`}
                  />
                ))}
              </div>
              <p>{room.description}</p>
            </div>
          ) : (
            rooms.map((roomItem) => (
              <div key={`room-${roomItem.id}`} className="room-card">
                {roomId ? (
                  <p>{roomItem.description}</p>
                ) : (
                  <div className="room-image">
                    {roomItem.images.length > 0 && (
                      <img
                        key={`room-${roomItem.id}-image-${roomItem.images[0]}`}
                        src={`${utils.VITE_BACKEND_URL}/public/${roomItem.images[0]}`}
                        alt="Комната"
                        width="200"
                      />
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default RoomCard;
