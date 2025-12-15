import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { emptyLoginUser, type LoginUser } from "../../utils/utils";
import { useHotels } from "../context/hotels/HotelsContext";

const LoginCard = () => {
  const [user, setUser] = useState<LoginUser>(emptyLoginUser);

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

  const handleChange = (field: keyof LoginUser, value: string) => {
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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Вход
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="auth-card">
      <h1 className="container-main-title">Вход</h1>
      {showFormView()}
    </div>
  );
};

export default LoginCard;
