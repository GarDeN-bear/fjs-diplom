import { useState, type FormEvent, type ChangeEvent } from "react";
import * as utils from "../../../utils/utils";
import Calendar from "./Calendar";
import { useHotelsSearch } from "../../context/hotels/HotelsSearchContext";

interface SearchFormPrompt {
  handleSubmit: () => void;
}

const SearchForm = ({ handleSubmit }: SearchFormPrompt) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isDateStartSetup, setIsDateStartSetup] = useState<boolean>(true);

  const {
    dateStart,
    dateEnd,
    hotelName,
    showCalendar,
    setShowCalendar,
    setDateStart,
    setDateEnd,
    setHotelName,
  } = useHotelsSearch();

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

  const handleOnDayClick = (day: number, dayOfMonth: utils.DayOfMonth) => {
    let selectedMonth = currentDate.getMonth();
    let selectedYear = currentDate.getFullYear();

    switch (dayOfMonth) {
      case utils.DayOfMonth.PreviousMonth:
        if (selectedMonth === 0) {
          --selectedYear;
          selectedMonth = 11;
        } else {
          --selectedMonth;
        }
        break;
      case utils.DayOfMonth.NextMonth:
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
    if (isDateStartSetup) {
      if (dateEnd === null) {
        setDateStart(selectedDate);
      } else if (selectedDate < dateEnd) {
        setDateStart(selectedDate);
      }
    } else {
      if (dateStart === null) {
        setDateEnd(selectedDate);
      } else if (selectedDate > dateStart) {
        setDateEnd(selectedDate);
      }
    }
    setIsDateStartSetup(!isDateStartSetup);
  };

  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  const showSearchForm = () => {
    return (
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          setShowCalendar(false);
          handleSubmit();
        }}
      >
        <div className="form-group">
          <input
            type="text"
            value={hotelName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setHotelName(e.target.value)
            }
            placeholder="Введите название гостиницы (необязательно)"
          />
        </div>
        <div className="form-group form-group-in-out">
          <input
            type="text"
            placeholder="Заезд"
            value={formatDateForDisplay(dateStart)}
            readOnly
            onClick={() => {
              setShowCalendar(true);
            }}
          />
          <span>-</span>
          <input
            type="text"
            placeholder="Выезд"
            value={formatDateForDisplay(dateEnd)}
            readOnly
            onClick={() => {
              setShowCalendar(true);
            }}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Искать
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="hotel-catalog-search-card container-main-title">
      <h1>Поиск гостиницы</h1>
      {showSearchForm()}
      {showCalendar && (
        <Calendar
          currentDate={currentDate}
          handleOnBtnPress={handleOnBtnPress}
          handleOnDayClick={handleOnDayClick}
          dateStart={dateStart}
          dateEnd={dateEnd}
        />
      )}
    </div>
  );
};

export default SearchForm;
