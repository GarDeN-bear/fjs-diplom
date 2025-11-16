import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../../../utils/utils";
import { useRooms } from "../../context/RoomContext";

const HotelRoomCreate = () => {
  const [formData, setFormData] = useState<utils.CreateHotelRoomForm>({
    hotel: "",
    description: "",
    images: null,
    isEnabled: false,
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { addRoom } = useRooms();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormData(formData);
    if (addRoom) addRoom(formData);
    navigate("/hotel-create");
  };

  const handleChange = async (
    field: keyof utils.CreateHotelRoomForm,
    value: string | FileList | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter detailed hotel description"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Добавить
            </button>
          </div>
          <button className="btn btn-primary">Отменить</button>
        </form>
      )}
    </section>
  );
};

export default HotelRoomCreate;
