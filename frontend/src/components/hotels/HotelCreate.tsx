import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../utils/utils";
import { useRooms } from "../context/RoomContext";

const HotelCreate = () => {
  const { hotelRooms } = useRooms();
  const [formData, setFormData] = useState<utils.CreateHotelForm>({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendHotelData = async (): Promise<string | undefined> => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotels/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при создании отеля");
      }

      const result = await response.json();
      console.log("Отель создан:", result);
      return result._id;
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendHotelRoomsData = async (hotelId: string) => {
    try {
      hotelRooms.forEach(async (room) => {
        room.hotel = hotelId;
        const response = await fetch(
          `${utils.VITE_BACKEND_URL}/api/admin/hotel-rooms/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(room),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при создании комнаты отеля");
        }
        const result = await response.json();
        console.log("Комната создана:", result);
      });
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Ошибка:", error);
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const navigateToHotelRoomCreate = () => {
    console.log("navigate");
    navigate("/hotel-room-create");
  };

  return (
    <section className="hotel-create">
      <h1>Добавление гостиницы</h1>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <button onClick={navigateToHotelRoomCreate}>Добавить комнату</button>
          <form onSubmit={handleSubmit} className="hotel-create-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Название отеля
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
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
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter detailed hotel description"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Сохранить
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
};

export default HotelCreate;
