import { useEffect, useState } from "react";
import {
  itemsOnPage,
  limit,
  scrollToTop,
  VITE_BACKEND_URL,
  type SupportRequest,
  type User,
} from "../../utils/utils";
import Pagination from "../common/Pagination";
import ClientCard, { ClientCardMode } from "../auth/ClientCard";
import { useNavigate } from "react-router-dom";

const ManagerSupportCard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersOnPage, setUsersOnPage] = useState<User[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveChats().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsersOnPage();
  }, [users, currentNumber]);

  useEffect(() => {
    scrollToTop();
  }, [usersOnPage]);

  const fetchActiveChats = async () => {
    try {
      await fetchUsers();
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  const fetchUsersOnPage = async () => {
    if (!users) return;

    const firstIndex = (currentNumber - 1) * itemsOnPage;
    const page = users.slice(firstIndex, firstIndex + itemsOnPage);
    setUsersOnPage(page);
  };

  const fetchUsers = async () => {
    try {
      const url: string = `${VITE_BACKEND_URL}/api/manager/users?limit=${limit.toString()}&offset=${(
        (currentNumber - 1) *
        itemsOnPage
      ).toString()}`;

      const response = await fetch(url, { credentials: "include" });
      const data: User[] = await response.json();

      const userPromises = data.map(async (user) => {
        const hasActiveChat = await fetchChat(user._id);
        return hasActiveChat ? user : null;
      });

      const usersWithChats = await Promise.all(userPromises);
      const filteredUsers = usersWithChats.filter(
        (user): user is User => user !== null
      );

      setUsers(filteredUsers);

      const totalPages = Math.ceil(filteredUsers.length / itemsOnPage);
      const numbers = [];
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
      setNumbers(numbers);
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  const fetchChat = async (userId: string): Promise<boolean> => {
    try {
      const url = new URL(`${VITE_BACKEND_URL}/api/manager/support-requests`);
      url.searchParams.append("user", userId);
      url.searchParams.append("isActive", "true");
      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка: ${error}`);
      }

      const data: SupportRequest[] = await response.json();
      const activeRequest: SupportRequest | undefined = data.find(
        (req) => req.isActive
      );

      return activeRequest !== undefined;
    } catch (error) {
      console.log("Ошибка: ", error);
      return false;
    }
  };

  const onConnectBtnClick = (user: User) => {
    navigate(`/manager-chat-card/${user._id}`);
  };

  const showChatsCatalogView = () => {
    return (
      <div className="users-list">
        {usersOnPage.map((user, index) => (
          <ClientCard
            key={index}
            mode={ClientCardMode.Catalog}
            userData={user}
            onConnectBtnClick={() => onConnectBtnClick(user)}
          />
        ))}
      </div>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="support-card">
      <h1 className="container-main-title">Поддержка</h1>
      {showChatsCatalogView()}
      <Pagination
        currentNumber={currentNumber}
        numbers={numbers}
        setCurrentNumber={setCurrentNumber}
      />
    </div>
  );
};

export default ManagerSupportCard;
