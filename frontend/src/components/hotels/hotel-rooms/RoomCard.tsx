import { useState, useEffect, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as utils from "../../../utils/utils";
import { RoomCardMode } from "../../context/HotelsContext";
import { useSearch } from "../../context/HotelsSearchContext";
interface RoomCardProps {
  mode: RoomCardMode;
  roomData?: utils.HotelRoom;
  roomCardAddView?: (room: utils.HotelRoom) => ReactNode;
}

const RoomCard = ({ mode, roomData, roomCardAddView }: RoomCardProps) => {
  const roomId = useParams().id;
  const [room, setRoom] = useState<utils.HotelRoom>(utils.emptyRoom);
  const [loading, setLoading] = useState(true);

  const { checkInDate, departureDate } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    let id: string | undefined = roomId;

    switch (mode) {
      case RoomCardMode.Hotel:
      case RoomCardMode.HotelCatalog:
      case RoomCardMode.Create:
        if (roomData) setRoom(roomData);
        setLoading(false);
        break;
      default:
        fetchRoom(id).finally(() => setLoading(false));
        break;
    }
  }, [roomData]);

  const fetchRoom = async (id?: string) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/common/hotel-rooms/${id}`
      );

      const data: utils.HotelRoom = await response.json();
      setRoom(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const sendCreateReservationData = async () => {
    if (!roomId || !checkInDate || !departureDate) {
      return;
    }
    try {
      const reservation: utils.CreateReservation = {
        userId: "",
        hotelId: "",
        roomId: "",
        dateStart: checkInDate,
        dateEnd: departureDate,
      };

      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/client/reservations/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservation),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при бронировании комнаты отеля: ${error}`);
      }

      const result = await response.json();
      console.log("Комната забронированя с файлами:", result);
    } catch (error) {
      throw new Error(`Ошибка при бронировании комнаты отеля: ${error}`);
    }
  };

  const handleOnReservationBtn = () => {
    sendCreateReservationData();
    navigate("/");
  };

  const roomCardCommonView = () => {
    return (
      <>
        {room.images.map((image, index) => (
          <div key={index} className="room-image">
            <img src={utils.getImageUrl(image)} alt={`Комната ${index + 1}`} />
            <div className="form-actions">
              {/* <button
                className="btn btn-primary"
                onClick={() => handleOnReservationBtn()}
              >
                Забронировать
              </button> */}
            </div>
            {roomCardAddView && roomCardAddView(room)}
          </div>
        ))}
        <div className="room-card-description">
          <p>{room.description}</p>
        </div>
      </>
    );
  };

  const roomCardHotelView = () => {
    return (
      <>
        <div className="room-image">
          {room.images.length > 0 && (
            <img src={utils.getImageUrl(room.images[0])} alt="Комната" />
          )}
          {roomCardAddView && roomCardAddView(room)}
        </div>
        {mode !== RoomCardMode.HotelCatalog && (
          <div className="room-card-description">
            <p>{room.description}</p>
          </div>
        )}
      </>
    );
  };

  const showRoomCard = () => {
    switch (mode) {
      case RoomCardMode.Hotel:
      case RoomCardMode.HotelCatalog:
        return roomCardHotelView();
      default:
        return roomCardCommonView();
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return showRoomCard();
};

export default RoomCard;
