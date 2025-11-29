import { useState } from "react";
import type { FormEvent } from "react";
import Calendar from "./Calendar";
import { DayOfMonth } from "../../utils/utils";
import { useSearch } from "../context/SearchContext";

const SearchHotels = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isCheckIn, setIsDeparture] = useState<boolean>(true);

  const {
    checkInDate,
    departureDate,
    calendarState,
    setCheckInDate,
    setDepartureDate,
    setCalendarState,
  } = useSearch();

  const handleOnSubmitSearch = (e: FormEvent) => {
    e.preventDefault();
    setCalendarState(false);
  };

  const handleOnBtnPress = (isNextMonth: boolean) => {
    const newDate = new Date(currentDate);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (isNextMonth) {
      if (currentMonth === 11) {
        newDate.setFullYear(currentYear + 1);
        newDate.setMonth(0);
      } else {
        newDate.setMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        newDate.setFullYear(currentYear - 1);
        newDate.setMonth(11);
      } else {
        newDate.setMonth(currentMonth - 1);
      }
    }
    setCurrentDate(newDate);
  };

  const handleOnDayClick = (day: number, dayOfMonth: DayOfMonth) => {
    let selectedMonth = currentDate.getMonth();
    let selectedYear = currentDate.getFullYear();

    switch (dayOfMonth) {
      case DayOfMonth.PreviousMonth:
        if (selectedMonth === 0) {
          --selectedYear;
          selectedMonth = 11;
        } else {
          --selectedMonth;
        }
        break;
      case DayOfMonth.NextMonth:
        if (selectedMonth === 11) {
          ++selectedYear;
          selectedMonth = 0;
        } else {
          ++selectedMonth;
        }
        break;
      default:
        break;
    }

    const selectedDate = new Date(selectedYear, selectedMonth, day);
    if (isCheckIn) {
      if (departureDate === null) {
        setCheckInDate(selectedDate);
      } else if (selectedDate < departureDate) {
        setCheckInDate(selectedDate);
      }
    } else {
      if (checkInDate === null) {
        setDepartureDate(selectedDate);
      } else if (selectedDate > checkInDate) {
        setDepartureDate(selectedDate);
      }
    }
    setIsDeparture(!isCheckIn);
  };

  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <div className="hotel-catalog-search-card container-main-title">
      <h1>Поиск гостиницы</h1>
      <form onSubmit={handleOnSubmitSearch}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Введите название гостиницы (необязательно)"
          />
        </div>
        <div className="form-group form-group-in-out">
          <input
            type="text"
            placeholder="Заезд"
            value={formatDateForDisplay(checkInDate)}
            readOnly
            onClick={(e: FormEvent) => {
              e.preventDefault();
              setCalendarState(true);
            }}
          />
          <span>-</span>
          <input
            type="text"
            placeholder="Выезд"
            value={formatDateForDisplay(departureDate)}
            readOnly
            onClick={(e: FormEvent) => {
              e.preventDefault();
              setCalendarState(true);
            }}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Искать
          </button>
        </div>
      </form>
      {calendarState && (
        <Calendar
          currentDate={currentDate}
          handleOnBtnPress={handleOnBtnPress}
          handleOnDayClick={handleOnDayClick}
          checkInDate={checkInDate}
          departureDate={departureDate}
        />
      )}
    </div>
  );
};

export default SearchHotels;
