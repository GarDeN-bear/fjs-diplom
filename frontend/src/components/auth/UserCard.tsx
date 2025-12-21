import { useAuth } from "../context/auth/AuthContext";

import ClientCard, { ClientCardMode } from "./ClientCard";
import AdminCard from "./AdminCard";
import ManagerCard from "./ManagerCard";
import { Role } from "../../utils/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserCard = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === Role.Common) navigate("/");
  }, []);

  const showUserCard = () => {
    switch (user.role) {
      case Role.Client:
        return <ClientCard mode={ClientCardMode.Common} />;
      case Role.Admin:
        return <AdminCard />;
      case Role.Manager:
        return <ManagerCard />;
      default:
        break;
    }
  };

  return <section className="user">{showUserCard()}</section>;
};

export default UserCard;
