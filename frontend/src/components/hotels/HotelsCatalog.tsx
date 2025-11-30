import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import * as utils from "../../utils/utils";
import SearchHotels from "./SearchHotels";
import { useSearch } from "../context/SearchContext";
import { useHotels, HotelsMode } from "../context/HotelsContext";
import HotelCard from "./HotelCard";
import Pagination from "../common/Pagination";
import { useHotelCard, HotelCardMode } from "../context/HotelCardContext";

const HotelsCatalog = () => {
  const [hotelsSearch, setHotelsSearch] = useState<utils.Hotel[]>([]);
  const [hotelsOnPage, setHotelsOnPage] = useState<utils.Hotel[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { checkInDate, departureDate, calendarState } = useSearch();

  const { hotels, mode, setHotels, setMode: setHotelsMode } = useHotels();
  const { setMode } = useHotelCard();
  const location = useLocation();

  useEffect(() => {
    let currentMode: HotelsMode = HotelsMode.None;
    if (location.pathname === "/") {
      currentMode = HotelsMode.Common;
    } else if (location.pathname === "/search") {
      currentMode = HotelsMode.Search;
    }

    setHotelsMode(currentMode);

    switch (currentMode) {
      case HotelsMode.Search:
        fetchSearchHotels().finally(() => setLoading(false));
        break;
      case HotelsMode.Common:
        fetchHotels().finally(() => setLoading(false));
        break;
      default:
        setLoading(false);
        break;
    }
    setMode(HotelCardMode.Catalog);
  }, [mode, calendarState]);

  useEffect(() => {
    fetchHotelsOnPage();
  }, [hotels, hotelsSearch, currentNumber]);

  const fetchHotelsOnPage = async () => {
    if (hotels.length <= 0) {
      return;
    }

    const firstIndex = (currentNumber - 1) * utils.itemsOnPage;
    const page = hotels.slice(firstIndex, firstIndex + utils.itemsOnPage);
    setHotelsOnPage(page);
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotels?limit=${utils.limit.toString()}&offset=${(
          (currentNumber - 1) *
          utils.itemsOnPage
        ).toString()}`
      );
      const data: utils.Hotel[] = await response.json();
      setHotels(data);
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

  const fetchSearchHotels = async () => {
    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotel-rooms?limit=${utils.limit.toString()}&offset=${(
          (currentNumber - 1) *
          utils.itemsOnPage
        ).toString()}&dateStart=${checkInDate}&dateEnd=${departureDate}`
      );

      const data: utils.HotelRoom[] = await response.json();
      const foundHotels: utils.Hotel[] = findHotelsByRooms(data);
      setHotelsSearch(foundHotels);
      const totalPages = Math.ceil(foundHotels.length / utils.itemsOnPage);
      const numbers = [];
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
      setNumbers(numbers);
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  const findHotelsByRooms = (rooms: utils.HotelRoom[]): utils.Hotel[] => {
    const result: utils.Hotel[] = [];
    Array.from(rooms).forEach((room) => {
      const foundHotel = hotels.find((hotel) => hotel._id === room._id);

      if (foundHotel) {
        result.push(foundHotel);
      }
    });
    return result;
  };

  const showHeaderView = () => {
    return (
      <>
        {mode === HotelsMode.Search ? (
          <SearchHotels />
        ) : (
          <h1 className="container-main-title">Все гостиницы</h1>
        )}
      </>
    );
  };

  const showHotelCatalogView = () => {
    return (
      <div className="hotels-list">
        {hotelsOnPage.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <HotelCard hotelData={hotel} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="hotel-catalog">
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          {showHeaderView()} {showHotelCatalogView()}
        </>
      )}
      <Pagination
        currentNumber={currentNumber}
        numbers={numbers}
        setCurrentNumber={setCurrentNumber}
      />
    </div>
  );
};

export default HotelsCatalog;
