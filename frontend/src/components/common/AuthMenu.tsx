import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth/AuthContext";
import { emptyUser, Role, VITE_BACKEND_URL } from "../../utils/utils";

interface AuthMenuPrompt {
  setAuthMenuVisibility: (flag: boolean) => void;
}

const AuthMenu = ({ setAuthMenuVisibility }: AuthMenuPrompt) => {
  const { user, token, setToken, setUser } = useAuth();

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const url: string = `${VITE_BACKEND_URL}/api/auth/logout`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при выходе": ${error}`);
      }
      setAuthMenuVisibility(false);
      setUser(emptyUser);
      setToken("");
      navigate("/");
    } catch (error) {
      throw new Error(`Ошибка при выходе": ${error}`);
    }
  };

  return (
    <ul className="auth-menu">
      {user.role !== Role.Common && (
        <li
          onClick={() => {
            navigate("/user");
          }}
        >
          Профиль
        </li>
      )}
      <li
        onClick={() => {
          setAuthMenuVisibility(false);
          navigate("/auth/login");
        }}
      >
        Вход
      </li>
      <li
        onClick={() => {
          setAuthMenuVisibility(false);
          navigate("/auth/register");
        }}
      >
        Регистрация
      </li>
      <li
        onClick={() => {
          logout();
        }}
      >
        Выход
      </li>
    </ul>
  );
};

export default AuthMenu;
