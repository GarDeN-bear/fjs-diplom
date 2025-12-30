import { useNavigate } from "react-router-dom";

import * as utils from "../../utils/utils";

import { useAuth } from "../context/auth/AuthContext";
import { useEffect, useState } from "react";

interface ReservationCardPrompt {
  reservationData: utils.Reservation;
  onRemove: (id?: string) => void;
}

const ReservationCard = ({
  reservationData,
  onRemove,
}: ReservationCardPrompt) => {
  const [user, setUser] = useState<utils.User>(utils.emptyUser);
  const [hotel, setHotel] = useState<utils.Hotel>(utils.emptyHotel);
  const [room, setRoom] = useState<utils.HotelRoom>(utils.emptyRoom);
  const [loading, setLoading] = useState(true);

  const { user: userAuth } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    fetchReservationData().finally(() => setLoading(false));
  }, []);

  const fetchReservationData = async () => {
    try {
      if (userAuth.role === utils.Role.Client) {
        setUser(userAuth);
      } else {
        await fetchUserData();
      }
      await fetchHotelData();
      await fetchRoomData();
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/manager/users/${reservationData.userId}`,
        {
          credentials: "include",
        }
      );
      const data: utils.User = await response.json();
      console.log(data);

      setUser(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const fetchHotelData = async () => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/common/hotels/${reservationData.hotelId}`,
        {
          credentials: "include",
        }
      );
      const data: utils.Hotel = await response.json();

      setHotel(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const fetchRoomData = async () => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/common/hotel-rooms/${reservationData.roomId}`,
        {
          credentials: "include",
        }
      );
      const data: utils.HotelRoom = await response.json();

      setRoom(data);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const showReservationCard = () => {
    return (
      <>
        <div className="container-description">
          <p>Имя: {user.name}</p>
          <p>Отель: {hotel.title}</p>
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                onRemove(reservationData._id);
                navigate(`/reservations/${user._id}`);
              }}
            >
              Отменить
            </button>
          </div>
        </div>
      </>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return showReservationCard();
};

export default ReservationCard;
