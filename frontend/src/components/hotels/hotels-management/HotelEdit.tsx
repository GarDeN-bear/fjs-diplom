import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import * as utils from "../../../utils/utils";
import {
  useHotelEdit,
  ActionMode,
} from "../../context/hotels/HotelEditContext";
import RoomCard from "../../hotels/hotel-rooms/RoomCard";
import { RoomCardMode, useHotels } from "../../context/hotels/HotelsContext";
import { useRoomCreate } from "../../context/hotels/RoomCreateContext";
import { useRoomEdit } from "../../context/hotels/RoomEditContext";

const HotelEdit = () => {
  const id: string | undefined = useParams().id;
  const { hotel, rooms, setHotel, setRooms, updateRoom, removeRoom } =
    useHotelEdit();
  const { setOnHandleSubmit: setOnHandleSubmitRoomCreate } = useRoomCreate();
  const { setRoom, setOnHandleSubmit: setOnHandleSubmitRoomEdit } =
    useRoomEdit();
  const { returnToMain } = useHotels();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!id) navigate("/");
    if (location.state?.skipRefresh) return;

    fetchHotel(id).finally(() => setLoading(false));
    fetchRooms(id).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    utils.scrollToTop();
  }, [rooms]);

  useEffect(() => {
    if (returnToMain) navigate("/");

    setOnHandleSubmitRoomCreate(handleRoomCreateSubmit);
    setOnHandleSubmitRoomEdit(handleRoomEditSubmit);
  }, [rooms]);

  const handleRoomCreateSubmit = useCallback(
    async (room: utils.HotelRoom) => {
      setLoading(true);
      setRooms([...rooms, { room: room, mode: ActionMode.Create }]);
      navigate(`/hotel/edit/${id}`, { state: { skipRefresh: true } });
    },
    [rooms]
  );

  const handleRoomEditSubmit = useCallback(async (room: utils.HotelRoom) => {
    setLoading(true);
    updateRoom(room);
    navigate(`/hotel/edit/${id}`, { state: { skipRefresh: true } });
  }, []);

  const fetchHotel = async (id?: string) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/common/hotels/${id}`
      );
      const data: utils.Hotel = await response.json();

      setHotel(data);
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
        }/api/common/hotel-rooms?limit=${utils.limit.toString()}&offset=${utils.offset.toString()}&hotel=${id}`
      );
      const data: utils.HotelRoom[] = await response.json();

      setRooms(data.map((room) => ({ room, mode: ActionMode.None })));
    } catch (error) {
      console.error("Ошибка: ", error);
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

  const sendRemoveHotelData = async () => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotels/${hotel._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при удалении отеля": ${error}`);
      }

      console.log("Отель удален");
    } catch (error) {
      throw new Error(`Ошибка при удалении отеля": ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendRoomsData = async () => {
    try {
      await Promise.all(
        rooms.map(async (room) => {
          const formData = new FormData();

          formData.append("hotel", hotel._id);
          formData.append("description", room.room.description || "");
          formData.append("isEnabled", "true");
          if (room.room.images && room.room.images.length > 0) {
            Array.from(room.room.images)
              .filter((img) => img instanceof File)
              .forEach((file) => {
                formData.append("images", file);
              });
            let existingImages: string[] = [];
            Array.from(room.room.images)
              .filter((img) => typeof img === "string")
              .forEach((file) => {
                existingImages.push(file);
              });
            formData.append("images", JSON.stringify(existingImages));
          }
          switch (room.mode) {
            case ActionMode.Create:
              sendCreateRoomData(formData);
              break;
            case ActionMode.Edit:
              sendEditRoomData(formData, room.room);
              break;
            case ActionMode.Remove:
              sendRemoveRoomData(room.room);
              break;
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

  const sendRemoveRoomData = async (room: utils.HotelRoom) => {
    try {
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/admin/hotel-rooms/${room._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при удалении комнаты отеля: ${error}`);
      }

      console.log("Комната удалена с файлами");
    } catch (error) {
      throw new Error(`Ошибка при удалении комнаты отеля: ${error}`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (rooms.filter((room) => room.mode !== ActionMode.Remove).length > 0) {
      await sendEditHotelData();
    } else {
      await sendRemoveHotelData();
    }
    await sendRoomsData();
    navigate("/");
  };

  const handleChange = (field: keyof utils.Hotel, value: string) => {
    setHotel({
      ...hotel,
      [field]: value,
    });
  };

  const setRoomCardView = (room: {
    room: utils.HotelRoom;
    mode: ActionMode;
  }) => {
    switch (room.mode) {
      case ActionMode.Edit:
      case ActionMode.None:
        return (
          <RoomCard
            mode={RoomCardMode.Hotel}
            roomData={room.room}
            roomCardAddView={roomCardAddEditView}
          />
        );
      case ActionMode.Create:
        return (
          <RoomCard
            mode={RoomCardMode.Hotel}
            roomData={room.room}
            roomCardAddView={roomCardAddCreateView}
          />
        );
      default:
        return <></>;
    }
  };
  const showRoomsView = () => {
    return (
      <div className="rooms-list">
        {rooms.length > 0 &&
          rooms.map((room, index) => (
            <div key={index} className="room-card">
              {setRoomCardView(room)}
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

  const roomCardAddEditView = (room: utils.HotelRoom) => {
    return (
      <>
        <div className="room-image-btns">
          <button
            className="btn-edit"
            onClick={() => {
              setRoom(room);
              navigate(`/room/edit/${room._id}`);
            }}
            title="Редактировать"
          >
            ✏️
          </button>

          <button
            className="btn-edit btn-remove"
            onClick={() => removeRoom(room, true)}
            title="Удалить"
          >
            ×
          </button>
        </div>
      </>
    );
  };

  const roomCardAddCreateView = (room: utils.HotelRoom) => {
    return (
      <>
        <div className="room-image-btns">
          <button
            className="btn-edit btn-remove"
            onClick={() => removeRoom(room)}
            title="Удалить"
          >
            ×
          </button>
        </div>
      </>
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
            readOnly
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Отменить
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <section className="hotel-create">
      <h1 className="container-main-title">Редактирование гостиницы</h1>
      <div className="hotel-create-rooms">
        {showRoomsView()}
        {showHotelFormView()}
      </div>
    </section>
  );
};

export default HotelEdit;
