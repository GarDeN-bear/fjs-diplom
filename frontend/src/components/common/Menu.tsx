import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <nav className="container-nav">
      <ul>
        <li className="row">
          <Link to="/">Все гостиницы</Link>
        </li>
        <li className="row">
          <Link to="/search">Поиск номеров</Link>
        </li>
        <li className="row">
          <Link to="/hotel-create/">Добавить гостиницу</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
