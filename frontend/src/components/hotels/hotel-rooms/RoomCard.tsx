import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { useEdit } from "../../context/EditContext";

interface RoomCardProps {
  hotelId?: string;
  roomData?: utils.HotelRoom;
  showEditView?: boolean;
}

const RoomCard = ({
  hotelId,
  roomData,
  showEditView = false,
}: RoomCardProps) => {
  const roomId = useParams().id; //!TODO Проверить
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [room, setRoom] = useState<utils.HotelRoom>();
  const [loading, setLoading] = useState(true);

  const { removeRoom, setRoomToEdit } = useEdit();

  const navigate = useNavigate();

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
  }, []);

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

  const roomCardCatalogView = () => {
    return <>{rooms.map((room) => roomCardHotelView(room))}</>;
  };

  const roomCardCommonView = () => {
    return (
      <>
        <div className="room-images">
          {room?.images.map((image, index) => (
            <img
              key={`room-${room.id}-image-${image}`}
              src={`${utils.VITE_BACKEND_URL}/public/${image}`}
              alt={`Комната ${index + 1}`}
            />
          ))}
        </div>
        <p>{room?.description}</p>
      </>
    );
  };

  const roomCardHotelView = (room: utils.HotelRoom | null) => {
    return (
      <>
        <div className="room-image">
          {room?.images && room.images.length > 0 && (
            <>
              <img
                key={`room-${room.id}-image-${room.images[0]}`}
                src={`${utils.VITE_BACKEND_URL}/public/${room.images[0]}`}
                alt="Комната"
              />
              {"//TODO Перенести стили"}
              {showEditView && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    style={{
                      background: "rgba(0, 123, 255, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      setRoomToEdit(room);
                      navigate(`/room/edit/${room?.id}`);
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </button>

                  <button
                    style={{
                      background: "rgba(220, 53, 69, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                    onClick={() => removeRoom(room)}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  };

  const showRoomCard = () => {
    if (roomData) {
      return roomCardHotelView(roomData);
    } else {
      return room?.id ? roomCardCommonView() : roomCardCatalogView();
    }
  };

  return (
    <section className="room-card">
      {loading ? <div>Загрузка...</div> : showRoomCard()}
    </section>
  );
};

export default RoomCard;
