import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../utils/utils";
import { useEdit, EditMode } from "../context/EditContext";
import { useRoomCard, RoomCardMode } from "../context/RoomCardContext";
import RoomCard from "./hotel-rooms/RoomCard";

const HotelEdit = () => {
  const {
    hotel,
    hotelClear,
    setHotelClear,
    rooms,
    hotelMode,
    setHotel,
    setRooms,
    setRoomMode,
  } = useEdit();

  const { setMode } = useRoomCard();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (hotelMode === EditMode.Create) {
      if (hotelClear) {
        setHotel(utils.emptyHotel);
        setRooms([]);
      }
    } else if (hotelMode === EditMode.None) {
      navigate("/");
    }
    setMode(RoomCardMode.Hotel);
    setHotelClear(true);
  }, [hotelMode]);

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
      setHotel(data);
      console.log("Отель создан:", data);
      return data._id;
    } catch (error) {
      throw new Error(`Ошибка при создании отеля": ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendEditHotelData = async () => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotels/${hotel._id}`,
        {
          method: "PUT",
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
    } catch (error) {
      throw new Error(`Ошибка при обновлении отеля": ${error}`);
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
          formData.append("description", room.room.description || "");
          formData.append("isEnabled", "false"); //!TODO
          if (room.room.images && room.room.images.length > 0) {
            Array.from(room.room.images).filter(img => img instanceof File).forEach((file) => {
              formData.append("images", file);
            });
            let existingImages: string[] = [];
            Array.from(room.room.images).filter(img => typeof img === 'string').forEach((file) => {
              existingImages.push(file);
            });
            formData.append("images", JSON.stringify(existingImages));
          }
          if (room.isNew) {
            sendCreateRoomData(formData);
          } else {
            sendEditRoomData(formData, room.room);
          }
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const sendEditRoomData = async (
    formData: FormData,
    room: utils.HotelRoom
  ) => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotel-rooms/${room._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при обновлении комнаты отеля: ${error}`);
      }

      const result = await response.json();
      console.log("Комната обновлена с файлами:", result);
    } catch (error) {
      throw new Error(`Ошибка при обновлении комнаты отеля: ${error}`);
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

    let hotelId = hotel._id;
    switch (hotelMode) {
      case EditMode.Create:
        hotelId = await sendCreateHotelData();
        break;
      default:
        await sendEditHotelData();
        break;
    }
    await sendRoomsData(hotelId);
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
              <RoomCard key={index} roomData={room.room} showEditView={true} />
            </div>
          ))}
        <div className="room-card">
          <button
            className="btn-room-image"
            onClick={() => {
              setRoomMode(EditMode.Create);
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
            placeholder="Введите название"
            readOnly={hotelMode === EditMode.Edit}
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

  const showTitleView = () => {
    return hotelMode == EditMode.Edit ? (
      <h1 className="container-main-title">Редактирование гостиницы</h1>
    ) : (
      <h1 className="container-main-title">Добавление гостиницы</h1>
    );
  };

  return (
    <section className="hotel-create">
      {showTitleView()}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="hotel-create-rooms">
          {showRoomsView()}
          {showHotelFormView()}
        </div>
      )}
    </section>
  );
};

export default HotelEdit;
