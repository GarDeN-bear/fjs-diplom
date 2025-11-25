import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";

import RoomCard from "./hotel-rooms/RoomCard";
import * as utils from "../../utils/utils";
import SearchHotels from "./SearchHotels";
import { useSearch } from "../context/SearchContext";

interface HotelCatalogPromt {
  search?: boolean;
}

const HotelCatalog = ({ search = false }: HotelCatalogPromt) => {
  const limit = 1000;
  const itemsInPage = 10;
  const [hotels, setAllHotels] = useState<utils.Hotel[]>([]);
  const [hotelsOnPage, setHotelsOnPage] = useState<utils.Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { checkInDate, departureDate, calendarState, setCalendarState } =
    useSearch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!search) {
      fetchAllHotels().finally(() => setLoading(false));
    } else {
      fetchSearchHotels().finally(() => setLoading(false));

      setLoading(false);
    }
  }, [search, calendarState]);

  useEffect(() => {
    fetchHotelsOnPage();
  }, [hotels, currentPage]);

  const fetchHotelsOnPage = async () => {
    if (hotels.length <= 0) {
      return;
    }

    const firstIndex = (currentPage - 1) * itemsInPage;
    const page = hotels.slice(firstIndex, firstIndex + itemsInPage);
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
  const fetchSearchHotels = async () => {
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

  const handleOnSubmitSearch = (e: FormEvent) => {
    e.preventDefault();
    setCalendarState(false);
  };

  return (
    <section className="hotel-catalog">
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          {search ? (
            <>
              <SearchHotels handleOnSubmitSearch={handleOnSubmitSearch} />
              <div className="hotels-list">
                {hotelsOnPage.map((hotel) => (
                  <div key={hotel._id} className="hotel-card">
                    <RoomCard hotelId={hotel._id} />
                    <div className="hotel-card-description">
                      <h3>{hotel.title}</h3>
                      <p>{hotel.description}</p>
                      <button onClick={() => navigate(`/hotel/${hotel._id}`)}>
                        Подробнее
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="container-main-title">Все гостиницы</h1>
              <div className="hotels-list">
                {hotelsOnPage.map((hotel) => (
                  <div key={hotel._id} className="hotel-card">
                    <RoomCard hotelId={hotel._id} />
                    <div className="hotel-card-description">
                      <h3>{hotel.title}</h3>
                      <p>{hotel.description}</p>
                      <button onClick={() => navigate(`/hotel/${hotel._id}`)}>
                        Подробнее
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <div className="pagination">
        {pageNumbers.length > 1 &&
          pageNumbers.map((num) => (
            <button
              key={num}
              className={`pagination-btn ${currentPage == num ? "active" : ""}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
      </div>
    </section>
  );
};

export default HotelCatalog;
