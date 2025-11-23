import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../utils/utils";
import { useRooms } from "../context/RoomContext";

const HotelCreate = () => {
  const { hotelRooms, clearRooms } = useRooms();
  const [hotel, setHotel] = useState<utils.CreateHotelForm>({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendHotelData = async (): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append("title", hotel.title || "");
      formData.append("description", hotel.description || "");

      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotels/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hotel),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при создании отеля": ${error}`);
      }

      const result = await response.json();
      console.log("Отель создан:", result);
      return result._id;
    } catch (error) {
      throw new Error(`Ошибка при создании отеля": ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendHotelRoomsData = async (hotelId: string) => {
    try {
      await Promise.all(
        hotelRooms.map(async (room) => {
          const formData = new FormData();

          formData.append("hotel", hotelId);
          formData.append("description", room.description || "");
          formData.append("isEnabled", room.isEnabled?.toString() || "false");

          if (room.images && room.images.length > 0) {
            Array.from(room.images).forEach((file) => {
              formData.append("images", file);
            });
          }

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
          return result;
        })
      );
      setHotel({ title: "", description: "" });
      clearRooms();
    } catch (error) {
      throw new Error(`Ошибка при создании комнаты отеля: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const hotelId: string | undefined = await sendHotelData();
    if (hotelId != undefined) sendHotelRoomsData(hotelId);
  };

  const handleChange = async (
    field: keyof utils.CreateHotelForm,
    value: string
  ) => {
    setHotel((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const navigateToHotelRoomCreate = () => {
    navigate("/hotel-room-create");
  };

  return (
    <section className="hotel-create">
      <h1 className="container-main-title">Добавление гостиницы</h1>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="hotel-create-card">
          <button onClick={navigateToHotelRoomCreate}>Добавить комнату</button>
          <form onSubmit={handleSubmit} className="hotel-create-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Название отеля
              </label>
              <input
                type="text"
                id="title"
                value={hotel.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter hotel title"
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
                placeholder="Enter detailed hotel description"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Сохранить
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                Отменить
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default HotelCreate;
