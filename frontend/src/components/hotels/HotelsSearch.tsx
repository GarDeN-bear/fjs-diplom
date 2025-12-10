import { useState, useEffect } from "react";
import { useHotelsSearch } from "../context/HotelsSearchContext";
import * as utils from "../../utils/utils";
import Pagination from "../common/Pagination";
import HotelCard from "./HotelCard";
import { HotelCardMode } from "../context/HotelsContext";
import { useHotels } from "../context/HotelsContext";
import { useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";

const HotelsSearch = () => {
  const [hotelsOnPage, setHotelsOnPage] = useState<utils.Hotel[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { hotels, hotelName, dateStart, dateEnd, setHotels, setRooms } =
    useHotelsSearch();

  const { returnToMain } = useHotels();

  const navigate = useNavigate();

  useEffect(() => {
    if (returnToMain) navigate("/");
  }, []);

  useEffect(() => {
    fetchHotelsOnPage();
  }, [hotels, currentNumber]);

  useEffect(() => {
    utils.scrollToTop();
  }, [hotelsOnPage]);

  const handleSubmitSearch = () => {
    fetchHotelsSearch().finally(() => setLoading(false));
  };

  const fetchHotelsSearch = async () => {
    if (!dateStart || !dateEnd) {
      return;
    }

    try {
      const response = await fetch(
        `${
          utils.VITE_BACKEND_URL
        }/api/common/hotelName-rooms?hotelName=${hotelName}?limit=${utils.limit.toString()}&offset=${(
          (currentNumber - 1) *
          utils.itemsOnPage
        ).toString()}&dateStart=${dateStart}&dateEnd=${dateEnd}`
      );

      const data: utils.HotelRoom[] = await response.json();
      const foundHotels: utils.Hotel[] = findHotelsByRooms(data);
      setHotels(foundHotels);
      setRooms(data);
      const totalPages = Math.ceil(
        (hotelName ? foundHotels : data).length / utils.itemsOnPage
      );
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
      const foundHotel = hotels.find((hotelName) => hotelName._id === room._id);

      if (foundHotel) {
        result.push(foundHotel);
      }
    });
    return result;
  };

  const fetchHotelsOnPage = async () => {
    const firstIndex = (currentNumber - 1) * utils.itemsOnPage;
    const page = hotels.slice(firstIndex, firstIndex + utils.itemsOnPage);
    setHotelsOnPage(page);
  };

  const showHotelCatalogView = () => {
    return (
      <div className="hotels-list">
        {hotelsOnPage.map((hotelName, index) => (
          <div key={index} className="hotelName-card">
            <HotelCard mode={HotelCardMode.Catalog} hotelData={hotelName} />
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="hotelName-catalog">
      <SearchForm handleSubmit={handleSubmitSearch} />
      {showHotelCatalogView()}
      <Pagination
        currentNumber={currentNumber}
        numbers={numbers}
        setCurrentNumber={setCurrentNumber}
      />
    </div>
  );
};

export default HotelsSearch;
