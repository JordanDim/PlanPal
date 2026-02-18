import { format, add, sub, startOfDay, endOfDay, getHours, getMinutes, parseISO } from "date-fns";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BASE } from "../../common/constants";
import {
  useCurrentTime,
  getHoursArray,
  getCategoryColor,
  getEventsForDay,
  getCurrentTimePosition,
  CalendarHeader,
  CalendarContainer,
  CurrentTimeIndicator,
} from "../../utils/calendarUtils.jsx";

function DayCalendar({ events, selectedDate, onDateChange }) {
  const currentTime = useCurrentTime();
  const navigate = useNavigate();

  function previousDay() {
    const newSelectedDate = sub(selectedDate, { days: 1 });
    onDateChange(newSelectedDate);
  }

  function nextDay() {
    const newSelectedDate = add(selectedDate, { days: 1 });
    onDateChange(newSelectedDate);
  }

  const hours = getHoursArray(selectedDate);

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(currentTime, "yyyy-MM-dd");

  const allEventsForSelectedDay = getEventsForDay(events, selectedDate);

  function calculateEventLayout(events) {
    const parsedEvents = events.map(event => ({
      ...event,
      start: parseISO(`${event.startDate}T${event.startTime}`),
      end: parseISO(`${event.endDate}T${event.endTime}`)
    }));

    return parsedEvents.map((event, i) => {
      const overlappingEvents = parsedEvents.filter((other, j) => {
        if (i === j) return false;
        return event.start < other.end && other.start < event.end;
      });

      const numOverlapping = overlappingEvents.length + 1;

      const overlapGroup = [...overlappingEvents, event].sort((a, b) => {
        if (a.start.getTime() !== b.start.getTime()) {
          return a.start - b.start;
        }
        return events.indexOf(a) - events.indexOf(b);
      });

      const position = overlapGroup.findIndex(e => e.id === event.id);

      return {
        ...event,
        column: position,
        totalColumns: numOverlapping
      };
    });
  }

  const eventsWithLayout = calculateEventLayout(allEventsForSelectedDay);

  return (
    <CalendarContainer>
      <CalendarHeader
        title={format(selectedDate, "EEEE, MMMM d, yyyy")}
        onPrevious={previousDay}
        onNext={nextDay}
        previousLabel="Previous day"
        nextLabel="Next day"
      />
      <div className="border p-4 relative overflow-hidden max-w-full">
        <div className="relative">
          {hours.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col justify-start border-t h-12"
            >
              <div className="w-16 text-right pr-2 text-xs">
                {format(hour, "HH:mm")}
              </div>
            </div>
          ))}
          {eventsWithLayout.map((event) => {
            const eventStart = parseISO(
              `${event.startDate}T${event.startTime}`
            );
            const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);

            const isPast = eventEnd < currentTime;

            const eventStartHour =
              eventStart < startOfDay(selectedDate)
                ? 0
                : getHours(eventStart);
            const eventStartMinute =
              eventStart < startOfDay(selectedDate)
                ? 0
                : getMinutes(eventStart);
            const startTop = (eventStartHour + eventStartMinute / 60) * 3;

            const eventEndHour =
              eventEnd > endOfDay(selectedDate) ? 24 : getHours(eventEnd);
            const eventEndMinute =
              eventEnd > endOfDay(selectedDate) ? 0 : getMinutes(eventEnd);
            const eventHeight =
              (eventEndHour + eventEndMinute / 60) * 3 - startTop;

            const HOUR_LABELS_WIDTH_REM = 5;
            const { column, totalColumns } = event;

            const categoryColor = getCategoryColor(event.category, isPast);

            return (
              <div
                key={event.id}
                className={`absolute pr-4 text-black text-xs rounded-lg shadow-lg cursor-pointer ${categoryColor}`}
                style={{
                  top: `${startTop}rem`,
                  height: `${eventHeight}rem`,
                  width: `calc((100% - ${HOUR_LABELS_WIDTH_REM}rem) / ${totalColumns} - 0.5rem)`,
                  left: `calc(${HOUR_LABELS_WIDTH_REM}rem + ${column} * ((100% - ${HOUR_LABELS_WIDTH_REM}rem) / ${totalColumns}))`,
                  opacity: isPast ? 0.5 : 1,
                }}
                onClick={() => navigate(`${BASE}events/${event.id}`)}
              >
                <div className="px-2 py-1">
                  <div className="font-semibold">{event.title}</div>
                  <div>
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              </div>
            );
          })}
          {isToday && (
            <CurrentTimeIndicator topPosition={getCurrentTimePosition(currentTime)} leftOffset="5rem" />
          )}
        </div>
      </div>
    </CalendarContainer>
  );
}

DayCalendar.propTypes = {
  events: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default DayCalendar;
