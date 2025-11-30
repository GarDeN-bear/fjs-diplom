import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as utils from "../../utils/utils";
import { EditMode, useEdit } from "../context/EditContext";
import RoomCard from "./hotel-rooms/RoomCard";

import { HotelCardMode, useHotelCard } from "../context/HotelCardContext";

interface HotelCardPrompt {
  hotelData?: utils.Hotel | null;
}

const HotelCard = ({ hotelData = null }: HotelCardPrompt) => {
  const hotelId = useParams().id ?? null;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const {
    hotel,
    rooms,
    setHotel,
    setRooms,
    setHotelMode: setEditMode,
  } = useEdit();
  const { mode, setMode } = useHotelCard();

  useEffect(() => {
    let currentMode: HotelCardMode;

    if (hotelData) {
      currentMode = HotelCardMode.Catalog;
    } else if (hotelId) {
      currentMode = HotelCardMode.Common;
    } else {
      setLoading(false);
      return;
    }
    setMode(currentMode);
    switch (currentMode) {
      case HotelCardMode.Common:
        fetchHotel().finally(() => setLoading(false));
        fetchRooms().finally(() => setLoading(false));
        break;
      default:
        setLoading(false);
        break;
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
        <RoomCard hotelId={hotelData?._id} />
        <div className="hotel-card-description">
          <h3>{hotelData?.title}</h3>
          <p>{hotelData?.description}</p>
          <button
            onClick={() => {
              navigate(`/hotel/${hotelData?._id}`);
            }}
          >
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
          {rooms.map((room, index) => (
            <div key={index} className="room-card">
              <RoomCard roomData={room.room} />
            </div>
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
          onClick={() => {
            setEditMode(EditMode.Edit);
            navigate("/hotel/edit/");
          }}
        >
          Редактировать
        </button>
      </>
    );
  };

  const showHotelCard = () => {
    return mode === HotelCardMode.Common
      ? hotelCardCommonView()
      : hotelCardCatalogView();
  };

  return <>{loading ? <div>Загрузка...</div> : showHotelCard()}</>;
};

export default HotelCard;
