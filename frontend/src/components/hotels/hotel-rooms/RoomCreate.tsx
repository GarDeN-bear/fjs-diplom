import { useEffect, useState, type FormEvent } from "react";

import * as utils from "../../../utils/utils";
import RoomCard from "./RoomCard";
import { RoomCardMode, useHotels } from "../../context/HotelsContext";
import { useRoomCreate } from "../../context/RoomCreateContext";
import { useNavigate } from "react-router-dom";

const RoomCreate = () => {
  const [room, setRoom] = useState<utils.HotelRoom>(utils.emptyRoom);

  const { onHandleSubmit } = useRoomCreate();
  const { returnToMain } = useHotels();

  const navigate = useNavigate();

  useEffect(() => {
    if (returnToMain) navigate("/");

    utils.scrollToTop();
  }, [room.images]);

  const handleChange = async (
    field: keyof utils.HotelRoom,
    value: string | FileList | null
  ) => {
    if (room) {
      if (field === "images" && value instanceof FileList) {
        setRoom({ ...room, [field]: Array.from(value) });
      } else {
        setRoom({ ...room, [field]: value });
      }
    }
  };

  const showRoomCreateView = () => {
    if (!room) return;

    return (
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onHandleSubmit(room);
        }}
        className="hotel-create-form"
      >
        <div className="form-group">
          <label htmlFor="images" className="form-label">
            Изображения
          </label>
          <div className="room-cards">
            <RoomCard mode={RoomCardMode.Create} roomData={room} />
          </div>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              handleChange("images", e.target.files);
            }}
            required={room.images.length === 0}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Описание комнаты
          </label>
          <textarea
            id="description"
            value={room.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Введите описание комнаты"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Добавить
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              useNavigate()("/");
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
      <h1 className="container-main-title">Добавление номера</h1>
      {showRoomCreateView()}
    </section>
  );
};

export default RoomCreate;
