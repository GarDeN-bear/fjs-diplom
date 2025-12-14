import { useAuth, Role } from "../context/auth/AuthContext";

import AuthCard from "./LoginCard";
import ClientCard from "./ClientCard";
import AdminCard from "./AdminCard";
import ManagerCard from "./ManagerCard";

const UserCard = () => {
  const { role } = useAuth();
  switch (role) {
    case Role.Client:
      return <ClientCard />;
    case Role.Admin:
      return <AdminCard />;
    case Role.Manager:
      return <ManagerCard />;
    default:
      return <AuthCard />;
  }
};

export default UserCard;
