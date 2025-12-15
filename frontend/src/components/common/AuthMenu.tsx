import { useNavigate } from "react-router-dom";

import { useAuth, Role } from "../context/auth/AuthContext";

interface AuthMenuPrompt {
  setAuthMenuVisibility: (flag: boolean) => void;
}

const AuthMenu = ({ setAuthMenuVisibility }: AuthMenuPrompt) => {
  const { role, setRole } = useAuth();

  const navigate = useNavigate();

  return (
    <ul className="auth-menu">
      {role === Role.Common && (
        <>
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
        </>
      )}
      <li
        onClick={() => {
          setAuthMenuVisibility(false);
          setRole(Role.Common);
        }}
      >
        Выход
      </li>
    </ul>
  );
};

export default AuthMenu;
