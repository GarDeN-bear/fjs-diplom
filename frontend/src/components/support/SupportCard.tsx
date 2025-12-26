import { Role } from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";
import ClientSupportCard from "./ClientSupportCard";
import ManagerSupportCard from "./ManagerSupportCard";

const SupportCard = () => {
  const { user } = useAuth();
  switch (user.role) {
    case Role.Client:
      return <ClientSupportCard />;
    default:
      return <ManagerSupportCard />;
  }
};

export default SupportCard;
