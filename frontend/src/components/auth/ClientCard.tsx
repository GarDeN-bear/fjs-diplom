import { Role, type User } from "../../utils/utils";
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
  const { user } = useAuth();

  const showClientCardCommonView = () => {
    return (
      <div className="user-info">
        <span className="user-info-item">{`e-mail: ${user.email}`}</span>
        <span className="user-info-item">{`Имя: ${user.name}`}</span>
        <span className="user-info-item">{`Телефон: ${user.contactPhone}`}</span>
      </div>
    );
  };

  const showClientCardCatalogView = () => {
    return <></>;
  };

  const showClientCardView = () => {
    switch (mode) {
      case ClientCardMode.Catalog:
        return showClientCardCatalogView();
      default:
        return showClientCardCommonView();
    }
  };

  return (
    <>
      {mode === ClientCardMode.Common && (
        <h1 className="container-main-title">Профиль</h1>
      )}
      <div className="user-card">{showClientCardView()}</div>
    </>
  );
};

export default ClientCard;
