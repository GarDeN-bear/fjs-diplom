import { Link } from "react-router-dom";
import { useHotels, HotelsMode } from "../context/HotelsContext";
import { useEdit, EditMode } from "../context/EditContext";

const Menu = () => {
  const { setMode } = useHotels();
  const { setHotelMode: setEditMode } = useEdit();

  return (
    <nav className="container-nav">
      <ul>
        <li className="row">
          <Link to="/" onClick={() => setMode(HotelsMode.Common)}>
            Все гостиницы
          </Link>
        </li>
        <li className="row">
          <Link to="/search" onClick={() => setMode(HotelsMode.Search)}>
            Поиск номеров
          </Link>
        </li>
        <li className="row">
          <Link
            to="/hotel/create/"
            onClick={() => setEditMode(EditMode.Create)}
          >
            Добавить гостиницу
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
