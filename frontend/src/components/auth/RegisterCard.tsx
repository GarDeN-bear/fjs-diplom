import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { emptyRegisterUser, type RegisterUser } from "../../utils/utils";
import { useHotels } from "../context/hotels/HotelsContext";

const RegisterCard = () => {
  const [user, setUser] = useState<RegisterUser>(emptyRegisterUser);

  const { returnToMain } = useHotels();

  const navigate = useNavigate();

  useEffect(() => {
    if (returnToMain) navigate("/");
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendRegisterData();
  };

  const sendRegisterData = () => {
    console.log(user);
  };

  const handleChange = (field: keyof RegisterUser, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const showFormView = () => {
    return (
      <form onSubmit={handleSubmit} className="common-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            e-mail
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Введите почту"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Имя
          </label>
          <input
            id="name"
            type="text"
            value={user.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Введите имя"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone" className="form-label">
            Телефон
          </label>
          <input
            id="contactPhone"
            type="text"
            value={user.contactPhone}
            onChange={(e) => handleChange("contactPhone", e.target.value)}
            placeholder="Введите телефон"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Роль</label>
          <div className="radio-group">
            <label>
              <input
                className="role-radio"
                type="radio"
                name="role"
                value="client"
                checked={user.role === "client"}
                onChange={(e) => handleChange("role", e.target.value)}
              />
              Клиент
            </label>
            <label>
              <input
                className="role-radio"
                type="radio"
                name="role"
                value="admin"
                checked={user.role === "admin"}
                onChange={(e) => handleChange("role", e.target.value)}
              />
              Администратор
            </label>
            <label>
              <input
                className="role-radio"
                type="radio"
                name="role"
                value="manager"
                checked={user.role === "manager"}
                onChange={(e) => handleChange("role", e.target.value)}
              />
              Менеджер
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Регистрация
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="auth-card">
      <h1 className="container-main-title">Регистрация</h1>
      {showFormView()}
    </div>
  );
};

export default RegisterCard;
