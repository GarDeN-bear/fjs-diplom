import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="container">
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <Link to="/" className="navbar-brand">
              <img src="../../assets/cat-svgrepo-com.svg" alt="Cat" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
