import { useEffect, useState } from "react";
import { emptyUser, Role, type User } from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";

export enum ClientCardMode {
  Common,
  Catalog,
}
interface ClientCardPrompt {
  mode: ClientCardMode;
  userData?: User;
}

const ClientCard = ({ mode, userData }: ClientCardPrompt) => {
  const [user, setUser] = useState<User>(emptyUser);

  const { user: userAuth } = useAuth();

  useEffect(() => {
    if (mode === ClientCardMode.Common) {
      setUser(userAuth);
    } else {
      setUser(userData || emptyUser);
    }
  }, []);

  const showClientCardCommonView = () => {
    return (
      <div className="user-info">
        <span className="user-info-item">{`e-mail: ${user.email}`}</span>
        <span className="user-info-item">{`Имя: ${user.name}`}</span>
        <span className="user-info-item">{`Телефон: ${user.contactPhone}`}</span>
      </div>
    );
  };

  return (
    <>
      {mode === ClientCardMode.Common && (
        <div className="container-main-title">
          <h1>Профиль</h1>
          {showClientCardCommonView()}
        </div>
      )}
      {mode === ClientCardMode.Catalog && showClientCardCommonView()}
    </>
  );
};

export default ClientCard;
