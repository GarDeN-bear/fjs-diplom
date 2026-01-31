import { useState, useEffect } from "react";
import { useHotelsSearch } from "../../context/hotels/HotelsSearchContext";
import * as utils from "../../../utils/utils";
import Pagination from "../../common/Pagination";
import HotelCard from "../HotelCard";
import { HotelCardMode } from "../../context/hotels/HotelsContext";
import { useHotels } from "../../context/hotels/HotelsContext";
import { useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";
import { useAuth } from "../../context/auth/AuthContext";

const HotelsSearch = () => {
  const [hotelsOnPage, setHotelsOnPage] = useState<utils.Hotel[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const { hotels, hotelName, dateStart, dateEnd, setHotels, setRooms } =
    useHotelsSearch();
  const { hotels: allHotel } = useHotels();

  const { returnToMain } = useHotels();
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (returnToMain) navigate("/");
    fetchHotelsOnPage();
  }, []);

  useEffect(() => {
    fetchHotelsOnPage();
  }, [hotels, currentNumber]);

  useEffect(() => {
    utils.scrollToTop();
  }, [hotelsOnPage]);

  const handleSubmitSearch = () => {
    setLoading(true);
    setCurrentNumber(1);
    fetchHotelsSearch().finally(() => setLoading(false));
  };

  const fetchHotelsSearch = async () => {
    if (!dateStart || !dateEnd) {
      return;
    }

    try {
      const url = new URL(`${utils.VITE_BACKEND_URL}/api/common/hotel-rooms/`);

      const hotelId: string | undefined = findHotelId();
      if (hotelId && hotelId.length > 0) {
        url.searchParams.append("hotel", hotelId);
      }
      url.searchParams.append("limit", utils.limit.toString());
      url.searchParams.append(
        "offset",
        ((currentNumber - 1) * utils.itemsOnPage).toString(),
      );
      url.searchParams.append("dateStart", dateStart.toISOString());
      url.searchParams.append("dateEnd", dateEnd.toISOString());
      url.searchParams.append(
        "isEnabled",
        user.role !== utils.Role.Manager ? "true" : "false",
      );

      const response = await fetch(url.toString());

      const data: utils.HotelRoom[] = await response.json();
      const foundHotels: utils.Hotel[] = findHotelsByRooms(data);

      setHotels(foundHotels);
      setRooms(data);
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  const findHotelId = (): string | undefined => {
    if (hotelName.length > 0)
      return (
        allHotel.find((hotel) => hotelName === hotel.title)?._id || undefined
      );
    else return "";
  };

  const findHotelsByRooms = (rooms: utils.HotelRoom[]): utils.Hotel[] => {
    const result: utils.Hotel[] = [];
    if (hotelName.length > 0) {
      Array.from(rooms).forEach((room) => {
        const foundHotel = allHotel.find((hotel) => hotel._id === room.hotel);
        if (foundHotel) {
          result.push(foundHotel);
        }
      });
      return result;
    } else return allHotel;
  };

  const fetchHotelsOnPage = () => {
    const firstIndex = (currentNumber - 1) * utils.itemsOnPage;
    const page = hotels.slice(firstIndex, firstIndex + utils.itemsOnPage);
    setHotelsOnPage(page);
    fetchNumbers();
  };

  const fetchNumbers = () => {
    const totalPages = Math.ceil(hotels.length / utils.itemsOnPage);
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    setNumbers(numbers);
  };

  const showHotelCatalogView = () => {
    return (
      <div className="hotels-list">
        {hotelsOnPage.map((hotelName, index) => (
          <div key={index} className="hotel-card">
            <HotelCard mode={HotelCardMode.Catalog} hotelData={hotelName} />
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="hotel-catalog">
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
