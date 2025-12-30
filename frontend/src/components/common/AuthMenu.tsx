import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth/AuthContext";
import { Role } from "../../utils/utils";

interface AuthMenuPrompt {
  setAuthMenuVisibility: (flag: boolean) => void;
}

const AuthMenu = ({ setAuthMenuVisibility }: AuthMenuPrompt) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <ul className="auth-menu">
      {user.role !== Role.Common && (
        <>
          <li
            onClick={() => {
              setAuthMenuVisibility(false);
              navigate("/user");
            }}
          >
            Профиль
          </li>
          <li
            onClick={() => {
              navigate("/support");
              setAuthMenuVisibility(false);
            }}
          >
            Поддержка
          </li>
        </>
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
      {user.role !== Role.Common && (
        <li
          onClick={() => {
            logout();
            setAuthMenuVisibility(false);
          }}
        >
          Выход
        </li>
      )}
    </ul>
  );
};

export default AuthMenu;
