import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { EditMode, useEdit } from "../../context/EditContext";

const RoomEdit = () => {
  const { roomToEdit, mode, updateRoom } = useEdit();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    if (!roomToEdit) return;
    e.preventDefault();
    setLoading(true);
    updateRoom(roomToEdit);
    navigate("/hotel/edit/");
  };

  const handleChange = async (
    field: keyof utils.CreateHotelRoomForm,
    value: string | FileList | null
  ) => {
    if (roomToEdit) {
      updateRoom({
        ...roomToEdit,
        [field]: value,
      });
    }
  };

  const showTitleView = () => {
    return mode === EditMode.Create ? (
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
            value={roomToEdit?.description}
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
