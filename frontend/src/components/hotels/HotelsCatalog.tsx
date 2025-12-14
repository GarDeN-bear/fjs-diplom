import { useState, useEffect } from "react";

import * as utils from "../../utils/utils";
import { HotelCardMode, useHotels } from "../context/hotels/HotelsContext";
import HotelCard from "./HotelCard";
import Pagination from "../common/Pagination";

const HotelsCatalog = () => {
  const [hotelsOnPage, setHotelsOnPage] = useState<utils.Hotel[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { hotels, setHotels, setReturnToMain } = useHotels();

  useEffect(() => {
    fetchHotels().finally(() => setLoading(false));
    setReturnToMain(false);
  }, []);

  useEffect(() => {
    fetchHotelsOnPage();
  }, [hotels, currentNumber]);

  useEffect(() => {
    utils.scrollToTop();
  }, [hotelsOnPage]);

  const fetchHotelsOnPage = async () => {
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

  const showHotelCatalogView = () => {
    return (
      <div className="hotels-list">
        {hotelsOnPage.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <HotelCard mode={HotelCardMode.Catalog} hotelData={hotel} />
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="hotel-catalog">
      <h1 className="container-main-title">Все гостиницы</h1>
      {showHotelCatalogView()}
      <Pagination
        currentNumber={currentNumber}
        numbers={numbers}
        setCurrentNumber={setCurrentNumber}
      />
    </div>
  );
};

export default HotelsCatalog;
