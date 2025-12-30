import { useState, useEffect } from "react";

import * as utils from "../../utils/utils";
import Pagination from "../common/Pagination";
import ReservationCard from "./ReservationCard";
import { useAuth } from "../context/auth/AuthContext";
import { useParams } from "react-router-dom";

const ReservationsCatalog = () => {
  const { id: userIdParam } = useParams<{ id?: string }>();

  const [reservationsOnPage, setReservationsOnPage] = useState<
    utils.Reservation[]
  >([]);
  const [reservations, setReservations] = useState<utils.Reservation[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [userId, setUserId] = useState<string>("");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { user: userAuth } = useAuth();

  useEffect(() => {
    console.log(userIdParam);

    setUserId(userIdParam || userAuth._id);

    fetchReservations().finally(() => setLoading(false));
  }, [userIdParam]);

  useEffect(() => {
    fetchReservationsOnPage().finally(() => setLoading(false));
  }, [reservations, currentNumber]);

  useEffect(() => {
    utils.scrollToTop();
  }, [reservationsOnPage]);

  const fetchReservationsOnPage = async () => {
    const firstIndex = (currentNumber - 1) * utils.itemsOnPage;
    const page = reservations.slice(firstIndex, firstIndex + utils.itemsOnPage);
    setReservationsOnPage(page);
  };

  const fetchReservations = async () => {
    try {
      const url: string = `${utils.VITE_BACKEND_URL}/api/${
        userAuth.role
      }/reservations?userId=${userId}&limit=${utils.limit.toString()}&offset=${(
        (currentNumber - 1) *
        utils.itemsOnPage
      ).toString()}`;
      const response = await fetch(url, {
        credentials: "include",
      });
      const data: utils.Reservation[] = await response.json();

      setReservations(data);
      const totalPages = Math.ceil(data.length / utils.itemsOnPage);
      const numbers = [];
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
      setNumbers(numbers);
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  const sendRemoveReservationData = async (id?: string) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${utils.VITE_BACKEND_URL}/api/${userAuth.role}/reservations/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при удалении брони": ${error}`);
      }
      const filteredReservations: utils.Reservation[] = reservations.filter(
        (reservation) => {
          return reservation._id !== id;
        }
      );

      setReservations(filteredReservations);

      console.log("Бронь удалена");
    } catch (error) {
      throw new Error(`Ошибка при удалении брони": ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const showReservationsCatalogView = () => {
    return (
      <div className="reservations-list">
        {reservationsOnPage.map((reservation, index) => (
          <div key={index} className="reservation-card">
            <ReservationCard
              reservationData={reservation}
              onRemove={sendRemoveReservationData}
            />
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="reservation-catalog">
      <h1 className="container-main-title">Брони</h1>
      {showReservationsCatalogView()}
      <Pagination
        currentNumber={currentNumber}
        numbers={numbers}
        setCurrentNumber={setCurrentNumber}
      />
    </div>
  );
};

export default ReservationsCatalog;
