import { useState, useEffect } from "react";

import * as utils from "../../utils/utils";
import RoomCard from "./hotel-rooms/RoomCard";
import { Link } from "react-router-dom";

const HotelCatalog = () => {
  const limit = 1000;
  const itemsInPage = 10;
  const [hotels, setAllHotels] = useState<utils.Hotel[]>([]);
  const [hotelsOnPage, setHotelsOnPage] = useState<utils.Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllHotels().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHotelsOnPage();
  }, [hotels, currentPage]);

  const fetchHotelsOnPage = async () => {
    if (hotels.length <= 0) {
      return;
    }

    const firstIndex = (currentPage - 1) * itemsInPage;
    const page = hotels.slice(firstIndex, firstIndex + itemsInPage);
    console.log("page", page)
    setHotelsOnPage(page);
  };

  const fetchAllHotels = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotels?limit=${limit.toString()}&offset=${(
          (currentPage - 1) *
          itemsInPage
        ).toString()}`
      );
      const data: utils.Hotel[] = await response.json();
      setAllHotels(data);
      setPageNumbers([]);
      const totalPages = Math.ceil(data.length / itemsInPage);
      const numbers = [];
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
      setPageNumbers(numbers);
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  return (
    <section className="hotel-catalog">
      <h1>Все гостиницы</h1>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="hotels-list">
          {hotelsOnPage.map((hotel) => (
            <div key={hotel._id} className="hotel-card">
              <RoomCard hotelId={hotel._id} />
              <div className="hotel-card-description">
                <h3>{hotel.title}</h3>
                <p>{hotel.description}</p>
                <Link to={`/room/${hotel._id}`}>
                  <button>Подробнее</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        {pageNumbers.length > 1 &&
          pageNumbers.map((num) => (
            <button key={num} className={`pagination-btn ${currentPage==num ? "active" : ""}`} onClick={() => setCurrentPage(num)}>
              {num}
            </button>
          ))}
      </div>
    </section>
  );
};

export default HotelCatalog;
