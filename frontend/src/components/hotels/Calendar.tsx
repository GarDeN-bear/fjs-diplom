import "../../css/Calendar.css";

import { DayOfMonth } from "../../utils/utils";

const daysOfWeek = [
  ["Понедельник", "Пн"],
  ["Вторник", "Вт"],
  ["Среда", "Ср"],
  ["Четверг", "Чт"],
  ["Пятница", "Пт"],
  ["Суббота", "Сб"],
  ["Воскресенье", "Вс"],
];

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

interface CalendarPromt {
  currentDate: Date;
  handleOnBtnPress: (isNextMonth: boolean) => void;
  handleOnDayClick: (day: number, dayOfMonth: DayOfMonth) => void;
  dateStart: Date | null;
  dateEnd: Date | null;
}

const Calendar = ({
  currentDate,
  handleOnBtnPress,
  handleOnDayClick,
  dateStart,
  dateEnd,
}: CalendarPromt) => {
  const isMonthInBorders = (day: number, dayOfMonth: DayOfMonth): boolean => {
    switch (dayOfMonth) {
      case DayOfMonth.PreviousMonth:
        return (
          (dateStart !== null &&
            day === dateStart.getDate() &&
            dateStart.getMonth() ===
              (currentDate.getMonth() - 1 < 0
                ? 11
                : currentDate.getMonth() - 1)) ||
          (dateEnd !== null &&
            day === dateEnd.getDate() &&
            dateEnd.getMonth() ===
              (currentDate.getMonth() - 1 < 0
                ? 11
                : currentDate.getMonth() - 1))
        );
      case DayOfMonth.NextMonth:
        return (
          (dateStart !== null &&
            day === dateStart.getDate() &&
            dateStart.getMonth() ===
              (currentDate.getMonth() + 1 > 11
                ? 0
                : currentDate.getMonth() + 1)) ||
          (dateEnd !== null &&
            day === dateEnd.getDate() &&
            dateEnd.getMonth() ===
              (currentDate.getMonth() + 1 > 11
                ? 0
                : currentDate.getMonth() + 1))
        );
      default:
        return (
          (dateStart !== null &&
            day === dateStart.getDate() &&
            dateStart.getMonth() === currentDate.getMonth()) ||
          (dateEnd !== null &&
            day === dateEnd.getDate() &&
            dateEnd.getMonth() === currentDate.getMonth())
        );
    }
  };

  const monthName = monthNames[currentDate.getMonth()];
  const lastDayOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  let monthInfo = [];
  let firstDayOfMonth = lastDayOfPreviousMonth.getDay();

  while (firstDayOfMonth > 0) {
    let dayOfPreviousMonth =
      lastDayOfPreviousMonth.getDate() - firstDayOfMonth + 1;
    monthInfo.push({
      day: dayOfPreviousMonth,
      week: 1,
      dayClass:
        "ui-datepicker-other-month" +
        (isMonthInBorders(dayOfPreviousMonth, DayOfMonth.PreviousMonth)
          ? " ui-datepicker-selected"
          : ""),
      dayOfMonth: DayOfMonth.PreviousMonth,
    });
    --firstDayOfMonth;
  }
  for (let i = 1; i < lastDayOfMonth.getDate() + 1; ++i) {
    monthInfo.push({
      day: i,
      week: Math.ceil((monthInfo.length + 1) / 7),
      dayClass: isMonthInBorders(i, DayOfMonth.CurrentMonth)
        ? "ui-datepicker-selected"
        : "",
      dayOfMonth: DayOfMonth.CurrentMonth,
    });
  }
  let lastDayOfWeek = 1;
  while (monthInfo.length < 7 * monthInfo[monthInfo.length - 1].week) {
    monthInfo.push({
      day: lastDayOfWeek,
      week: monthInfo[monthInfo.length - 1].week,
      dayClass:
        "ui-datepicker-other-month" +
        (isMonthInBorders(lastDayOfWeek, DayOfMonth.NextMonth)
          ? " ui-datepicker-selected"
          : ""),
      dayOfMonth: DayOfMonth.NextMonth,
    });
    lastDayOfWeek++;
  }

  const renderRows = () => {
    const month: any[] = [];
    for (let i = 0; i < Math.ceil(monthInfo.length / 7) + 1; ++i) {
      const weeks: any[] = [];
      monthInfo.forEach((info, index) => {
        if (info.week === i) {
          weeks.push(
            <td
              key={index}
              className={info.dayClass}
              onClick={() => handleOnDayClick(info.day, info.dayOfMonth)}
            >
              {info.day}
            </td>
          );
        } else {
          return;
        }
      });
      month.push(<tr key={i}>{weeks}</tr>);
    }
    return month;
  };

  return (
    <div className="ui-datepicker">
      <div className="ui-datepicker-header">
        <button
          className="ui-datepicker-header-btn"
          onClick={() => handleOnBtnPress(false)}
        >
          {"<<"}
        </button>
        <div className="ui-datepicker-title">
          <span className="ui-datepicker-month">{monthName}</span>&nbsp;
          <span className="ui-datepicker-year">
            {currentDate.getFullYear()}
          </span>
        </div>
        <button
          className="ui-datepicker-header-btn"
          onClick={() => handleOnBtnPress(true)}
        >
          {">>"}
        </button>
      </div>
      <table className="ui-datepicker-calendar">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            {daysOfWeek.map((day, index) => (
              <th key={index} scope="col" title={day[0]}>
                {day[1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
