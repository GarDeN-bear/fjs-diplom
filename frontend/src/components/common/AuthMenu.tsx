import { useNavigate } from "react-router-dom";

import { useAuth, Role } from "../context/auth/AuthContext";

const AuthMenu = () => {
  const { role, setRole } = useAuth();

  const navigate = useNavigate();

  return (
    <ul className="auth-menu">
      {role === Role.Common && (
        <>
          <li onClick={() => navigate("/auth/login")}>Вход</li>
          <li onClick={() => navigate("/auth/register")}>Регистрация</li>
        </>
      )}
      <li onClick={() => setRole(Role.Common)}>Выход</li>
    </ul>
  );
};

export default AuthMenu;
