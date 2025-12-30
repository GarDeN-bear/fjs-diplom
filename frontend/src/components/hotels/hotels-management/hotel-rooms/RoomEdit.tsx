import { useEffect, type FormEvent } from "react";

import * as utils from "../../../../utils/utils";
import { useRoomEdit } from "../../../context/hotels/RoomEditContext";
import RoomCard from "../../hotel-rooms/RoomCard";
import { useNavigate } from "react-router-dom";
import { RoomCardMode, useHotels } from "../../../context/hotels/HotelsContext";
import { useHotelEdit } from "../../../context/hotels/HotelEditContext";

const RoomEdit = () => {
  const { room, setRoom, onHandleSubmit } = useRoomEdit();
  const { hotel } = useHotelEdit();
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

  const showEditView = () => {
    if (!room) return;

    return (
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onHandleSubmit(room);
        }}
        className="common-form"
      >
        <div className="form-group">
          <label htmlFor="images" className="form-label">
            Изображения
          </label>
          <div className="room-cards">
            <RoomCard mode={RoomCardMode.Edit} roomData={room} />
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
            Обновить
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              navigate(`/hotel/edit/${hotel._id}`);
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
      <h1 className="container-main-title">Редактирование номера</h1>
      {showEditView()}
    </section>
  );
};

export default RoomEdit;
