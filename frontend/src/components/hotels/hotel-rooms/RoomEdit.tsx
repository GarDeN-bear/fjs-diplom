import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { EditMode, useEdit } from "../../context/EditContext";
import RoomCard from "./RoomCard";

const RoomEdit = () => {
  const { rooms, roomToEdit, roomMode, setRooms, updateRoom } = useEdit();
  const [room, setRoom] = useState<utils.HotelRoom | null>(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (roomMode === EditMode.None) {
      navigate("/");
    }
    setRoom({ _id: "", description: "", images: [], hotel: "" });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (roomMode === EditMode.Edit) {
      if (roomToEdit) updateRoom(roomToEdit);
    } else {
      if (room) rooms.push({ room: room, isNew: true });
      setRooms(rooms);
    }
    navigate("/hotel/edit/");
  };

  const handleChange = async (
    field: keyof utils.CreateHotelRoomForm,
    value: string | FileList | null
  ) => {
    let processedValue: string | FileList | string[] | null = value;

    if (field === "images" && value instanceof FileList) {
      // processedValue = await fileListToUrls(value);
    }
    if (roomMode === EditMode.Create) {
      if (room) {
        setRoom({ ...room, [field]: processedValue });
      }
    } else if (roomToEdit) {
      updateRoom({
        ...roomToEdit,
        [field]: processedValue,
      });
    }
    console.log(roomMode, room);
  };

  const showTitleView = () => {
    return roomMode === EditMode.Create ? (
      <h1>Добавление номера</h1>
    ) : (
      <h1>Редактирование номера</h1>
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
            {roomMode === EditMode.Create
              ? room && <RoomCard roomData={room} />
              : roomToEdit && <RoomCard roomData={roomToEdit} />}
          </div>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              handleChange("images", e.target.files);
            }}
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
            Добавить
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("hotel/edit")}
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
