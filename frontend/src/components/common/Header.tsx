import { useState } from "react";
import { Link } from "react-router-dom";
import AuthMenu from "./AuthMenu";

const Header = () => {
  const [authMenuVisibility, setAuthMenuVisibility] = useState<boolean>(false);

  return (
    <header className="container container-header">
      <div className="col-logo">
        <Link to="/">
          <img src="../../../assets/cat-svgrepo-com.svg" alt="logo" />
        </Link>
      </div>
      <div className="col-nav">
        <button className="avatar-btn">
          <img
            src="../../../assets/cat-svgrepo-com.svg"
            alt="avatar"
            onClick={() => {
              setAuthMenuVisibility(!authMenuVisibility);
            }}
          />
        </button>
        {authMenuVisibility && <AuthMenu />}
      </div>
    </header>
  );
};

export default Header;
