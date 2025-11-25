import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as utils from "../../utils/utils";
import { useHotelEdit } from "../context/HotelEditContext";

const HotelCard = () => {
  const hotelId = useParams().id;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const {hotel, rooms, setHotel, setRooms} = useHotelEdit();

  useEffect(() => {
    if (hotelId) {
      fetchRooms().finally(() => setLoading(false));
      fetchHotel().finally(() => setLoading(false));
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

  const fetchHotel = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotels/${hotelId}`
      );
      const data: utils.Hotel = await response.json();

      setHotel(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const handleOnEditBtn = () => {
    navigate("/hotel-edit/");
  }
  return (
    <section className="rooms-card">
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
        <h1 className="container-main-title">{hotel?.title}</h1>
        <p>{hotel?.description}</p>
        <div className="rooms-list">
          {rooms.map((roomItem) => (
            <div key={`room-${roomItem.id}`} className="room-card">
              <div className="room-image">
                {roomItem.images.length > 0 && (
                  <img
                    key={`room-${roomItem.id}-image-${roomItem.images[0]}`}
                    src={`${utils.VITE_BACKEND_URL}/public/${roomItem.images[0]}`}
                    alt="Комната"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={()=>handleOnEditBtn()}>Редактировать</button>
        </>
      )}
    </section>
  );
};

export default HotelCard;
