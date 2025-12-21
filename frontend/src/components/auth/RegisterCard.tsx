import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  emptyUser,
  Role,
  VITE_BACKEND_URL,
  type User,
  type UserResponce,
} from "../../utils/utils";
import { useHotels } from "../context/hotels/HotelsContext";
import { useAuth } from "../context/auth/AuthContext";

const RegisterCard = () => {
  const [user, setUser] = useState<User>(emptyUser);
  const [message, setMessage] = useState<string>("");

  const { returnToMain } = useHotels();

  const { login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (returnToMain) navigate("/");
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendRegisterData();
  };

  const sendRegisterData = async () => {
    try {
      const { role, _id, ...userWithoutRoleAndId } = user;
      setMessage("");
      const url: string = `${VITE_BACKEND_URL}/api/${
        user.role === Role.Admin ? "admin/users" : "client/register"
      }`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userWithoutRoleAndId),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.message);
        throw new Error(`Ошибка при создании профиля": ${error.message}`);
      }

      const data: UserResponce = await response.json();

      login(user);

      console.log("Профиль создан:", data);
    } catch (error) {
      throw new Error(`Ошибка при создании профиля": ${error}`);
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const showResponseMessages = () => {
    return (
      <div>
        <p>{message}</p>
      </div>
    );
  };

  const showAdminPart = () => {
    return (
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
    );
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
        {user.role === Role.Admin && showAdminPart()}
        {showResponseMessages()}
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
