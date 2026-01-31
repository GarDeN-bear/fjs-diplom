import { useEffect, useCallback, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../../utils/utils";
import RoomCard from "../hotel-rooms/RoomCard";
import { useHotelCreate } from "../../context/hotels/HotelCreateContext";
import { RoomCardMode, useHotels } from "../../context/hotels/HotelsContext";
import { useRoomCreate } from "../../context/hotels/RoomCreateContext";

const HotelCreate = () => {
  const [loading, setLoading] = useState(false);
  const { hotel, rooms, setHotel, setRooms } = useHotelCreate();
  const { setOnHandleSubmit } = useRoomCreate();
  const { returnToMain } = useHotels();

  const navigate = useNavigate();

  const handleRoomCreateSubmit = useCallback(async (room: utils.HotelRoom) => {
    setLoading(true);
    setRooms([...rooms, room]);
    navigate("/hotel/create");
  }, []);

  useEffect(() => {
    if (returnToMain) navigate("/");

    setOnHandleSubmit(handleRoomCreateSubmit);
  }, []);

  useEffect(() => {
    utils.scrollToTop();
  }, [rooms]);

  const sendCreateHotelData = async (): Promise<string> => {
    try {
      const { _id, ...hotelWithoutId } = hotel;

      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotels/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hotelWithoutId),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при создании отеля": ${error}`);
      }

      const data = await response.json();
      console.log("Отель создан:", data);
      return data._id;
    } catch (error) {
      throw new Error(`Ошибка при создании отеля": ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendRoomsData = async (hotelId: string) => {
    try {
      await Promise.all(
        rooms.map(async (room) => {
          const formData = new FormData();

          formData.append("hotel", hotelId);
          formData.append("description", room.description || "");
          formData.append("isEnabled", "true");
          if (room.images && room.images.length > 0) {
            Array.from(room.images)
              .filter((img) => img instanceof File)
              .forEach((file) => {
                formData.append("images", file);
              });
          }
          sendCreateRoomData(formData);
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const sendCreateRoomData = async (formData: FormData) => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotel-rooms/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при создании комнаты отеля: ${error}`);
      }

      const result = await response.json();
      console.log("Комната создана с файлами:", result);
    } catch (error) {
      throw new Error(`Ошибка при создании комнаты отеля: ${error}`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let hotelId = await sendCreateHotelData();
    await sendRoomsData(hotelId);
    setHotel(utils.emptyHotel);
    setRooms([]);
    navigate("/");
  };

  const handleChange = (field: keyof utils.Hotel, value: string) => {
    setHotel({
      ...hotel,
      [field]: value,
    });
  };

  const showRoomsView = () => {
    return (
      <div className="rooms-list">
        {rooms.length > 0 &&
          rooms.map((room, index) => (
            <div key={index} className="room-card">
              {
                <RoomCard
                  mode={RoomCardMode.Hotel}
                  roomData={room}
                  roomCardAddView={roomCardAddView}
                />
              }
            </div>
          ))}
        <div className="room-card">
          <button
            className="btn-room-image"
            onClick={() => {
              navigate("/room/create");
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const showHotelFormView = () => {
    return (
      <form onSubmit={handleSubmit} className="common-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Название отеля
          </label>
          <input
            type="text"
            id="title"
            value={hotel.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Введите название"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Описание отеля
          </label>
          <textarea
            id="description"
            value={hotel.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Введите описание"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Сохранить
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Отменить
          </button>
        </div>
      </form>
    );
  };

  const roomCardAddView = (room: utils.HotelRoom) => {
    return (
      <>
        <div className="room-image-btns">
          <button
            className="btn-edit btn-remove"
            onClick={() => setRooms(rooms.filter((el) => el !== room))}
            title="Удалить"
          >
            ×
          </button>
        </div>
      </>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <section className="hotel-create">
      <h1 className="container-main-title">Добавление гостиницы</h1>
      <div className="hotel-create-rooms">
        {showRoomsView()}
        {showHotelFormView()}
      </div>
    </section>
  );
};

export default HotelCreate;
