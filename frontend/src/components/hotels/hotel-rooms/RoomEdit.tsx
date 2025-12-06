import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { ActionMode, EditMode, useEdit } from "../../context/EditContext";
import RoomCard from "./RoomCard";
import { useRoomCard, RoomCardMode } from "../../context/RoomCardContext";

const RoomEdit = () => {
  const { rooms, roomToEdit,hotelMode, roomMode, setHotelClear, setRooms, updateRoom } =
    useEdit();

  const { setMode } = useRoomCard();

  const [room, setRoom] = useState<utils.HotelRoom>();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (roomMode === EditMode.None) {
      navigate("/");
    }
    setMode(RoomCardMode.Common);
    if (roomMode !== EditMode.Edit) setRoom(utils.emptyRoom);
      const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToTop);
  });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (roomMode === EditMode.Edit) {
      if (roomToEdit) updateRoom(roomToEdit);
      navigate("/hotel/edit/");
    } else {
      if (room) rooms.push({ room: room, mode: ActionMode.Create });
      setRooms(rooms);
      setHotelClear(false);
      navigate("/hotel/create/");
    }
  };

  const handleChange = async (
    field: keyof utils.HotelRoom,
    value: string | FileList | null
  ) => {
    if (roomMode === EditMode.Create) {
      if (room) {
        if (field === "images" && value instanceof FileList) {
          setRoom({ ...room, [field]: Array.from(value) });
        } else {
          setRoom({ ...room, [field]: value });
        }
      }
    } else if (roomMode === EditMode.Edit) {
      if (field === "images" && value instanceof FileList) {
        updateRoom({
          ...roomToEdit,
          [field]: Array.from(value),
        });
      } else {
        updateRoom({
          ...roomToEdit,
          [field]: value,
        });
      }
    }
  };

  const showTitleView = () => {
    return roomMode === EditMode.Create ? (
      <h1 className="container-main-title">Добавление номера</h1>
    ) : (
      <h1 className="container-main-title">Редактирование номера</h1>
    );
  };

  const showEditView = () => {
    return (
      <form onSubmit={handleSubmit} className="hotel-create-form">
        <div className="form-group">
          <label htmlFor="images" className="form-label">
            Изображения
          </label>
          <div className="room-cards">
            {roomMode === EditMode.Edit
              ? roomToEdit && <RoomCard roomData={roomToEdit} />
              : room && <RoomCard roomData={room} />}
          </div>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              handleChange("images", e.target.files);
            }}
            required={
              roomMode === EditMode.Edit
                ? roomToEdit.images.length === 0
                : room?.images.length === 0
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Описание комнаты
          </label>
          <textarea
            id="description"
            value={
              roomMode === EditMode.Create
                ? room?.description
                : roomToEdit?.description
            }
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Введите описание комнаты"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {roomMode === EditMode.Create ? "Добавить" : "Обновить"}
          </button>
          <button
          type="button"
            className="btn btn-secondary"
            onClick={() => {
              setRoom(utils.emptyRoom)
    setHotelClear(false);

            {hotelMode === EditMode.Create ? navigate("/hotel/create") : navigate("/hotel/edit")}

              }}
          >
            Отменить
          </button>
        </div>
      </form>
    );
  };

  return (
    <section className="hotel-create">
      {showTitleView()}
      {loading ? <div>Загрузка...</div> : showEditView()}
    </section>
  );
};

export default RoomEdit;
