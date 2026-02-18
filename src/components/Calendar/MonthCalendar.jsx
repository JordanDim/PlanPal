import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFutbol,
  faBook,
  faFilm,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { getCategoryColor, getEventsForDaySimple, CalendarHeader, CalendarContainer } from "../../utils/calendarUtils.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MonthCalendar({ onDateClick, events }) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  useEffect(() => {
    setCurrentMonth(format(selectedDay, "MMM-yyyy"));
  }, [selectedDay]);

  const previousMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    onDateClick(day);
  };

  const getEventsForDay = (day) => {
    return getEventsForDaySimple(events, day);
  };

  const getEventIcon = (category) => {
    const iconMap = {
      Sports: faFutbol,
      "Culture & Science": faBook,
      Entertainment: faFilm,
    };
    return iconMap[category] || faEllipsisH;
  };

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const startDayOfWeek = (getDay(firstDayCurrentMonth) + 6) % 7; // Adjust to start week on Monday
  const blankDays = Array.from({ length: startDayOfWeek }).map((_, index) => (
    <div key={`blank-${index}`} className="py-1.5 relative h-auto"></div>
  ));

  return (
    <CalendarContainer>
      <CalendarHeader
        title={format(firstDayCurrentMonth, "MMMM yyyy")}
        onPrevious={previousMonth}
        onNext={nextMonth}
        previousLabel="Previous month"
        nextLabel="Next month"
      />
      <div className="grid grid-cols-7 gap-2 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <div key={index} className="text-xl font-semibold">
            {day}
          </div>
        ))}
        {blankDays}
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={classNames(
              dayIdx === 0 && colStartClasses[getDay(day)],
              "py-1.5 relative h-auto"
            )}
          >
            <button
              type="button"
              className={classNames(
                isEqual(day, selectedDay) && "text-red-500 font-semibold",
                !isEqual(day, selectedDay) && isToday(day) && "text-red-500 font-semibold",
                !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && "text-900",
                !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && "text-400",
                "mx-auto flex flex-col items-center justify-start w-full h-full"
              )}
              onClick={() => handleDayClick(day)}
            >
              <time dateTime={format(day, "yyyy-MM-dd")} className="flex items-center justify-center w-full mb-1">
                {format(day, "d")}
              </time>
              <div className="w-full border-t mb-1 pb-4"></div>
              <div className="flex justify-center items-center">
                {getEventsForDay(day).map((event, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={getEventIcon(event.category)}
                    style={{ color: getCategoryColor(event.category, false, 'rgba') }}
                    className="text-lg mx-1"
                  />
                ))}
              </div>
            </button>
          </div>
        ))}
      </div>
    </CalendarContainer>
  );
}

MonthCalendar.propTypes = {
  onDateClick: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
};

const colStartClasses = [
  "",
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
];
