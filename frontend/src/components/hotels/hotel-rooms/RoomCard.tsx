import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { useEdit } from "../../context/EditContext";
import { useRoomCard, RoomCardMode } from "../../context/RoomCardContext";

interface RoomCardProps {
  hotelId?: string | null;
  roomData?: utils.HotelRoom | null;
  showEditView?: boolean;
}

const RoomCard = ({
  hotelId = null,
  roomData = null,
  showEditView = false,
}: RoomCardProps) => {
  const roomId = useParams().id ?? null; //!TODO Проверить
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [room, setRoom] = useState<utils.HotelRoom>();
  const [loading, setLoading] = useState(true);

  const { removeRoom, setRoomToEdit } = useEdit();
  const { mode, setMode } = useRoomCard();

  const navigate = useNavigate();

  useEffect(() => {
    let currentMode: RoomCardMode;

    if (hotelId) {
      currentMode = RoomCardMode.HotelCatalog;
    } else if (roomData || roomId) {
      currentMode = RoomCardMode.Common;
    } else if (showEditView) {
      currentMode = RoomCardMode.HotelEdit;
    } else {
      currentMode = RoomCardMode.Catalog;
    }

    setMode(currentMode);

    switch (currentMode) {
      case RoomCardMode.HotelCatalog:
        fetchRooms().finally(() => setLoading(false));
        break;
      case RoomCardMode.Common:
        if (roomData) {
          setRoom(roomData);
          setLoading(false);
        } else {
          fetchRoom().finally(() => setLoading(false));
        }

        break;
      default:
        setLoading(false);
        break;
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

  const roomCardHotelCatalogView = () => {
    const room: utils.HotelRoom | null = rooms.at(0) ?? null;
    return <>{roomCardHotelView(room)}</>;
  };

  const roomCardCommonView = (room: utils.HotelRoom | null) => {
    return (
      <>
        <div className="room-images">
          {room?.images.map((image, index) => (
            <img
              key={index}
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
                      navigate(`/room/edit/${room?._id}`);
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
    switch (mode) {
      case RoomCardMode.Common:
        if (room) return roomCardCommonView(room);
        break;
      case RoomCardMode.HotelCatalog:
        return roomCardHotelCatalogView();
      case RoomCardMode.Catalog:
        break;
      case RoomCardMode.HotelEdit:
        if (roomData) return roomCardCommonView(roomData);
        break;
    }
  };

  return <> {loading ? <div>Загрузка...</div> : showRoomCard()}</>;
};

export default RoomCard;
