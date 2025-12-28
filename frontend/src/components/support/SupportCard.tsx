import { useEffect } from "react";
import { Role } from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";
import ClientSupportCard from "./ClientSupportCard";
import ManagerSupportCard from "./ManagerSupportCard";
import { useNavigate } from "react-router-dom";

const SupportCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === Role.Common) navigate("/");
  }, []);

  switch (user.role) {
    case Role.Client:
      return <ClientSupportCard />;
    default:
      return <ManagerSupportCard />;
  }
};

export default SupportCard;
