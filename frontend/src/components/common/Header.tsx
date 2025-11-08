import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="container container-header">
      <div className="col-logo">
        <Link to="/">
          <img src="../../../assets/cat-svgrepo-com.svg" alt="logo" />
        </Link>
      </div>
      <div className="col-nav"></div>
    </header>
  );
};

export default Header;
