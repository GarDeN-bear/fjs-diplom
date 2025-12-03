import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { EditMode, useEdit } from "../../context/EditContext";
import { useRoomCard, RoomCardMode } from "../../context/RoomCardContext";

interface RoomCardProps {
  hotelId?: string;
  roomData?: utils.HotelRoom;
  showEditView?: boolean;
}

const RoomCard = ({
  hotelId = "",
  roomData = utils.emptyRoom,
  showEditView = false,
}: RoomCardProps) => {
  const roomId = useParams().id ?? null; //!TODO Проверить
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [room, setRoom] = useState<utils.HotelRoom>();
  const [loading, setLoading] = useState(true);

  const { hotelMode, removeRoom, setRoomToEdit, setHotelClear, setRoomMode } =
    useEdit();

  const { mode } = useRoomCard();

  const navigate = useNavigate();

  useEffect(() => {
    switch (mode) {
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
      case RoomCardMode.Hotel:
        if (roomData) {
          setRoom(roomData);
          setLoading(false);
        }
        break;
      default:
        setLoading(false);
        break;
    }
  }, [roomData]);

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
        {room?.images &&
          room.images.map((image, index) => (
            <div key={index} className="room-image">
              <img
                src={utils.getImageUrl(image)}
                alt={`Комната ${index + 1}`}
              />
              {showEditView && (
                <div className="room-image-btns">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setRoomToEdit(room);
                      setRoomMode(EditMode.Edit);
                      setHotelClear(false);
                      navigate(`/room/edit/${room?._id}`);
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </button>

                  <button
                    className="btn-edit btn-remove"
                    onClick={() => removeRoom(room)}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        <div className="room-card-description">
          <p>{room?.description}</p>
        </div>
      </>
    );
  };

  const roomCardHotelView = (room: utils.HotelRoom | null) => {
    return (
      <>
        <div className="room-image">
          {room?.images && room.images.length > 0 && (
            <img src={utils.getImageUrl(room.images[0])} alt="Комната" />
          )}
          {room && showEditView && (
            <div className="room-image-btns">
              {hotelMode === EditMode.Edit && (
                <button
                  className="btn-edit"
                  onClick={() => {
                    setRoomToEdit(room);
                    setRoomMode(EditMode.Edit);
                    navigate(`/room/edit/${room?._id}`);
                  }}
                  title="Редактировать"
                >
                  ✏️
                </button>
              )}

              <button
                className="btn-edit btn-remove"
                onClick={() => removeRoom(room)}
                title="Удалить"
              >
                ×
              </button>
            </div>
          )}
        </div>
        {mode !== RoomCardMode.HotelCatalog && (
          <div className="room-card-description">
            <p>{room?.description}</p>
          </div>
        )}
      </>
    );
  };

  const showRoomCard = () => {
    switch (mode) {
      case RoomCardMode.Common:
        if (room) return roomCardCommonView(room);
        break;
      case RoomCardMode.Hotel:
        if (room) return roomCardHotelView(room);
        break;
      case RoomCardMode.HotelCatalog:
        return roomCardHotelCatalogView();
      case RoomCardMode.Catalog:
        break;
    }
  };

  return <> {loading ? <div>Загрузка...</div> : showRoomCard()}</>;
};

export default RoomCard;
