import { useEffect, useState } from "react";
import ClientCard, { ClientCardMode } from "./ClientCard";
import {
  itemsOnPage,
  limit,
  scrollToTop,
  VITE_BACKEND_URL,
  type User,
} from "../../utils/utils";
import Pagination from "../common/Pagination";

const ManagerCard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersOnPage, setUsersOnPage] = useState<User[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsersOnPage();
  }, [users, currentNumber]);

  useEffect(() => {
    scrollToTop();
  }, [usersOnPage]);

  const fetchUsersOnPage = async () => {
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

      setUsers(data);
      const totalPages = Math.ceil(data.length / itemsOnPage);
      const numbers = [];
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
      setNumbers(numbers);
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  const showClientsCatalogView = () => {
    return (
      <div className="users-list">
        {usersOnPage.map((user, index) => (
          <ClientCard
            key={index}
            mode={ClientCardMode.Catalog}
            userData={user}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <ClientCard mode={ClientCardMode.Common} />
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          {showClientsCatalogView()}
          <Pagination
            currentNumber={currentNumber}
            numbers={numbers}
            setCurrentNumber={setCurrentNumber}
          />
        </>
      )}
    </>
  );
};

export default ManagerCard;
