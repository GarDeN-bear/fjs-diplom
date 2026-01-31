import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as utils from "../../utils/utils";
import RoomCard from "./hotel-rooms/RoomCard";

import { HotelCardMode, RoomCardMode } from "../context/hotels/HotelsContext";
import { useHotelsSearch } from "../context/hotels/HotelsSearchContext";
import { useAuth } from "../context/auth/AuthContext";

interface HotelCardPrompt {
  mode: HotelCardMode;
  hotelData?: utils.Hotel;
}

const HotelCard = ({ mode, hotelData }: HotelCardPrompt) => {
  const hotelId = useParams().id;
  const [hotel, setHotel] = useState<utils.Hotel>(utils.emptyHotel);
  const [rooms, setRooms] = useState<utils.HotelRoom[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const { dateStart, dateEnd, setHotelName } = useHotelsSearch();
  const navigate = useNavigate();

  useEffect(() => {
    let id: string | undefined = hotelId;

    switch (mode) {
      case HotelCardMode.Catalog:
        if (!hotelData) return;

        setHotel(hotelData);
        id = hotelData?._id;
        break;
      default:
        fetchHotel(id).finally(() => setLoading(false));
        break;
    }

    fetchRooms(id).finally(() => setLoading(false));
  }, [hotelData, hotelId]);

  const fetchHotel = async (id?: string) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/common/hotels/${id}`,
      );
      const data: utils.Hotel = await response.json();

      setHotel(data);
      setHotelName(data.title);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const fetchRooms = async (id?: string) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotel-rooms?limit=${utils.limit.toString()}&offset=${utils.offset.toString()}&hotel=${id}`,
      );
      const data: utils.HotelRoom[] = await response.json();
      let flag: boolean = false;
      for (const element of data) {
        if (element.isEnabled) {
          flag = true;
          break;
        }
      }
      setIsEnabled(flag);
      setRooms(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const handleOnReservationBtn = () => {
    navigate(`/search`);
  };

  const hotelCardCatalogView = () => {
    return (
      <>
        <RoomCard mode={RoomCardMode.HotelCatalog} roomData={rooms.at(0)} />
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
        <p className="container-description">{hotel?.description}</p>
        <div className="rooms-list">
          {rooms.map((room, index) => (
            <div key={index} className="room-card">
              <RoomCard mode={RoomCardMode.Hotel} roomData={room} />
            </div>
          ))}
        </div>
        <div className="form-actions">
          {(!dateStart || !dateEnd) && (
            <button
              className="btn btn-primary"
              onClick={() => handleOnReservationBtn()}
              disabled={!isEnabled}
            >
              {isEnabled ? "Забронировать" : "Не доступен"}
            </button>
          )}
          {user.role === utils.Role.Admin && (
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(`/hotel/edit/${hotel._id}`);
              }}
            >
              Редактировать
            </button>
          )}
        </div>
      </>
    );
  };

  const showHotelCard = () => {
    return mode === HotelCardMode.Catalog
      ? hotelCardCatalogView()
      : hotelCardCommonView();
  };

  if (loading) return <div>Загрузка...</div>;

  return showHotelCard();
};

export default HotelCard;
