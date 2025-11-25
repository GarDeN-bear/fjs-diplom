import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../utils/utils";
import { useHotelEdit } from "../context/HotelEditContext";

const HotelEdit = () => {
  const { hotel, rooms, setHotel, removeRoom, updateRoom } = useHotelEdit();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendHotelData = async (): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append("title", hotel?.title || "");
      formData.append("description", hotel?.description || "");

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
        throw new Error(`Ошибка при обновлении отеля": ${error}`);
      }

      const result = await response.json();
      console.log("Отель обновлен:", result);
      return result._id;
    } catch (error) {
      throw new Error(`Ошибка при обновлении отеля": ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendHotelRoomsData = async (hotelId: string) => {
    try {
      await Promise.all(
        rooms.map(async (room) => {
          const formData = new FormData();

          formData.append("hotel", hotelId);
          formData.append("description", room.description || "");
          //TODO
          formData.append(
            "isEnabled",
            /*room.isEnabled?.toString() || */ "false"
          );

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

  const handleChange = (field: keyof utils.CreateHotelForm, value: string) => {
    if (hotel) {
      setHotel({
        ...hotel,
        [field]: value,
      });
    }
  };

  const handleOnUpdateRoom = (room: utils.HotelRoom) => {
     updateRoom(room); 
     navigate(`/room-edit/${room.id}`);
  }

  return (
    <section className="hotel-create">
      <h1 className="container-main-title">Добавление гостиницы</h1>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="hotel-create-rooms">
          {rooms.length > 0 && (
            <div className="rooms-preview">
              <div className="rooms-grid">
                {rooms.map((room, index) => (
                  <div key={index} className="room-preview-card">
                    {room.images && room.images.length > 0 && (
                      <div className="room-images">
                        <div className="images-grid">
                          {Array.from(room.images).map((file, imgIndex) => (
                            <div key={imgIndex} className="image-preview">
                              <img
                                src={file}
                                alt={`Комната ${index + 1} - изображение ${
                                  imgIndex + 1
                                }`}
                                className="preview-image"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button onClick={() => removeRoom(room)}>
                      Удалить комнату
                    </button>
                    <button onClick={() => handleOnUpdateRoom(room)}>
                      Обновить комнату
                    </button>
                  </div>
                ))}
                <button onClick={()=> navigate("/hotel-room-create/")}>
                  Добавить комнату
                </button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="hotel-create-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Название отеля
              </label>
              <input
                type="text"
                id="title"
                value={hotel?.title}
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
                value={hotel?.description}
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

export default HotelEdit;
