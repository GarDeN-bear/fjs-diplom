import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";

import * as utils from "../../utils/utils";

const HotelCreate = () => {
  const [formData, setFormData] = useState<utils.CreateHotelForm>({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  const handleChange = async (
    field: keyof utils.CreateHotelForm,
    value: string
  ) => {};

  return (
    <section className="hotel-create">
      <h1>Добавление гостиницы</h1>
      <form onSubmit={handleSubmit} className="hotel-create-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Название отеля *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter hotel title (minimum 5 characters)"
          />
          <div className="character-count">{formData.title.length}/5</div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Описание *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter detailed hotel description (minimum 100 characters)"
            rows={6}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary"></button>
        </div>
      </form>
    </section>
  );
};

export default HotelCreate;
