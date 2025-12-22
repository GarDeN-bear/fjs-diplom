import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { Role } from "../../utils/utils";

const Menu = () => {
  const { user } = useAuth();

  return (
    <nav className="container-nav">
      <ul>
        <li className="row">
          <Link to="/">Все гостиницы</Link>
        </li>
        <li className="row">
          <Link to="/search">Поиск номеров</Link>
        </li>
        {user.role === Role.Admin && (
          <li className="row">
            <Link to="/hotel/create">Добавить гостиницу</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Menu;
