import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { emptyUser, type User } from "../../utils/utils";
import { useHotels } from "../context/hotels/HotelsContext";
import { useAuth } from "../context/auth/AuthContext";

const LoginCard = () => {
  const [user, setUser] = useState<User>(emptyUser);
  const [message, setMessage] = useState<string>("");

  const { returnToMain } = useHotels();
  const { user: authUser, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (returnToMain) navigate("/");
    setUser(authUser);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(user);
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
        {showResponseMessages()}
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
