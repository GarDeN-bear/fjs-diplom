import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { useHotelEdit } from "../../context/HotelEditContext";

const RoomEdit = () => {
  const { updatedRoom, updateRoom } = useHotelEdit();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    updateRoom(updatedRoom);
    navigate("/hotel/edit/");
  };

  const handleChange = async (
    field: keyof utils.CreateHotelRoomForm,
    value: string | FileList | null
  ) => {
    if (updatedRoom) {
      updateRoom({
        ...updatedRoom,
        [field]: value,
      });
    }
  };

  return (
    <section className="hotel-create">
      <h1>Добавление номера</h1>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <form onSubmit={handleSubmit} className="hotel-create-form">
          <div className="form-group">
            <label htmlFor="images" className="form-label">
              Изображения
            </label>
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
              value={updatedRoom?.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter detailed hotel description"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Добавить
            </button>
            <button className="btn btn-secondary">Отменить</button>
          </div>
        </form>
      )}
    </section>
  );
};

export default RoomEdit;
