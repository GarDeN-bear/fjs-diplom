import { useState, useEffect } from "react";
import { data, useNavigate, useParams } from "react-router-dom";

import * as utils from "../../utils/utils";
import { useEdit } from "../context/EditContext";
import RoomCard from "./hotel-rooms/RoomCard";

interface HotelCardPrompt {
  hotelData?: utils.Hotel | null;
}

const HotelCard = ({ hotelData }: HotelCardPrompt) => {
  const hotelId = useParams().id;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { hotel, rooms, setHotel, setRooms } = useEdit();

  useEffect(() => {
    if (hotelId) {
      fetchHotel().finally(() => setLoading(false));
      fetchRooms().finally(() => setLoading(false));
    }
  }, []);

  const fetchHotel = async () => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/common/hotels/${hotelId}`
      );
      const data: utils.Hotel = await response.json();

      setHotel(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotel-rooms?limit=${utils.limit.toString()}&offset=${utils.offset.toString()}&hotel=${hotelId}`
      );
      const data: utils.HotelRoom[] = await response.json();

      const fetchedRooms: { room: utils.HotelRoom; isNew: boolean }[] =
        Array.from(data).map((room) => ({ room: room, isNew: false }));

      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const handleOnReservationBtn = (title?: string) => {
    navigate(`/reservation`);
  };

  const hotelCardCatalogView = () => {
    return (
      <>
        <RoomCard hotelId={hotelData?.id} />
        <div className="hotel-card-description">
          <h3>{hotelData?.title}</h3>
          <p>{hotelData?.description}</p>
          <button onClick={() => navigate(`/hotel/${hotelData?.id}`)}>
            Подробнее
          </button>
        </div>
      </>
    );
  };

  const hotelCardCommonView = () => {
    return (
      <>
        <h1 className="container-main-title">{hotel?.title}</h1>
        <p>{hotel?.description}</p>
        <div className="room-cards">
          {rooms.map((room) => (
            <RoomCard roomData={room.room} />
          ))}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleOnReservationBtn(hotel?.title)}
        >
          Забронировать
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/hotel/edit/")}
        >
          Редактировать
        </button>
      </>
    );
  };

  const showHotelCard = () => {
    return hotelId ? hotelCardCommonView() : hotelCardCatalogView();
  };

  return (
    <div className={"hotel-card" + hotelId ? "" : "-catalog"}>
      {loading ? <div>Загрузка...</div> : showHotelCard()}
    </div>
  );
};

export default HotelCard;
