import { useState, useEffect } from "react";
import { format, setHours, startOfDay, parseISO, isSameDay, startOfDay as startOfDayFn, endOfDay } from "date-fns";
import PropTypes from "prop-types";
import RecurringEvents from "../components/Events/RecurringEvents";

/**
 * Custom hook to manage current time state with updates every minute
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

/**
 * Generate array of hours for a given date
 */
export function getHoursArray(date) {
  return Array.from({ length: 24 }, (_, i) => setHours(startOfDay(date), i));
}

/**
 * Get category color class name
 * @param {string} category - Event category
 * @param {boolean} isPast - Whether the event is in the past
 * @param {string} type - 'tailwind' for class names or 'rgba' for color strings
 * @returns {string} - CSS class or color string
 */
export function getCategoryColor(category, isPast, type = 'tailwind') {
  const colors = {
    Sports: { tailwind: "bg-green-300", rgba: "rgba(0, 128, 0, 0.4)" },
    "Culture & Science": { tailwind: "bg-blue-300", rgba: "rgba(0, 0, 255, 0.4)" },
    Entertainment: { tailwind: "bg-yellow-300", rgba: "rgba(255, 255, 0, 0.4)" },
    default: { tailwind: "bg-gray-300", rgba: "rgba(128, 128, 128, 0.4)" },
  };

  const baseColor = colors[category]?.tailwind || colors.default.tailwind;
  const rgbaColor = colors[category]?.rgba || colors.default.rgba;

  if (type === 'rgba') {
    return rgbaColor;
  }

  return `${baseColor} ${isPast ? "bg-opacity-10" : "bg-opacity-20"}`;
}

/**
 * Get events for a specific day including recurring events
 */
export function getEventsForDay(events, selectedDate) {
  const recurringEventsForSelectedDay = RecurringEvents({ events, selectedDate });

  const eventsForSelectedDay = events.filter((event) => {
    const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
    const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
    return (
      format(eventStart, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ||
      format(eventEnd, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ||
      (eventStart < startOfDay(selectedDate) && eventEnd > endOfDay(selectedDate))
    );
  });

  return [...recurringEventsForSelectedDay, ...eventsForSelectedDay];
}

/**
 * Simplified version that gets events for a day (used in MonthCalendar)
 */
export function getEventsForDaySimple(events, selectedDate) {
  const recurringEventsForSelectedDay = RecurringEvents({ events, selectedDate });

  const eventsForSelectedDay = events.filter((event) => {
    const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
    const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
    return (
      isSameDay(eventStart, selectedDate) ||
      isSameDay(eventEnd, selectedDate) ||
      (eventStart < startOfDayFn(selectedDate) && eventEnd > endOfDay(selectedDate))
    );
  });

  return [...eventsForSelectedDay, ...recurringEventsForSelectedDay];
}

/**
 * Get current time position in rem units (3rem per hour)
 */
export function getCurrentTimePosition(currentTime) {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  return (currentHour + currentMinute / 60) * 3;
}

/**
 * Navigation button component
 */
export function NavigationButton({ direction, onClick, ariaLabel }) {
  const isPrevious = direction === "previous";
  const pathD = isPrevious ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-500"
    >
      <span className="sr-only">{ariaLabel}</span>
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={pathD}
        />
      </svg>
    </button>
  );
}

NavigationButton.propTypes = {
  direction: PropTypes.oneOf(["previous", "next"]).isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

/**
 * Calendar header component with navigation
 */
export function CalendarHeader({ title, onPrevious, onNext, previousLabel, nextLabel }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <NavigationButton direction="previous" onClick={onPrevious} ariaLabel={previousLabel} />
      <h2 className="text-lg font-semibold">{title}</h2>
      <NavigationButton direction="next" onClick={onNext} ariaLabel={nextLabel} />
    </div>
  );
}

CalendarHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  previousLabel: PropTypes.string.isRequired,
  nextLabel: PropTypes.string.isRequired,
};

/**
 * Current time indicator component (red line)
 */
export function CurrentTimeIndicator({ topPosition, leftOffset = "0rem" }) {
  return (
    <div
      className="absolute left-0 right-0 w-full border-t-2 border-red-500"
      style={{ top: `${topPosition}rem` }}
    >
      <div className={`absolute -mt-1 w-2 h-2 bg-red-500 rounded-full`} style={{ left: leftOffset }}></div>
    </div>
  );
}

CurrentTimeIndicator.propTypes = {
  topPosition: PropTypes.number.isRequired,
  leftOffset: PropTypes.string,
};

/**
 * Common container wrapper for calendar views
 */
export function CalendarContainer({ children }) {
  return (
    <div
      className="pt-16 rounded-2xl"
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        padding: "20px"
      }}
    >
      <div className="px-4 mx-auto sm:px-7 md:px-6 max-w-full">
        {children}
      </div>
    </div>
  );
}

CalendarContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
