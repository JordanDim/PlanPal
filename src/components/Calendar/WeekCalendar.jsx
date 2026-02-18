import { useState } from "react";
import PropTypes from "prop-types";
import {
  format,
  add,
  sub,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  getHours,
  getMinutes,
  parseISO,
  differenceInMinutes,
  isBefore,
} from "date-fns";
import {
  useCurrentTime,
  getHoursArray,
  getCategoryColor,
  getEventsForDaySimple,
  getCurrentTimePosition,
  CalendarHeader,
  CalendarContainer,
  CurrentTimeIndicator,
} from "../../utils/calendarUtils.jsx";

function WeekCalendar({ events = [], onDateClick = () => {}, isInWeekView = false }) {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const currentTime = useCurrentTime();

  function previousWeek() {
    setSelectedWeek(sub(selectedWeek, { weeks: 1 }));
  }

  function nextWeek() {
    setSelectedWeek(add(selectedWeek, { weeks: 1 }));
  }

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => add(selectedWeek, { days: i }));

  const isCurrentWeek = format(startOfWeek(currentTime, { weekStartsOn: 1 }), "yyyy-MM-dd") === format(selectedWeek, "yyyy-MM-dd");

  const hours = getHoursArray(new Date());

  const getEventsForDay = (day) => {
    return getEventsForDaySimple(events, day);
  };

  const isOverlapping = (startA, endA, startB, endB) => {
    return startA < endB && startB < endA;
  };

  const groupEvents = (dayEvents) => {
    const columns = [];
    dayEvents.forEach((event) => {
      const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
      const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].some((colEvent) => isOverlapping(eventStart, eventEnd, parseISO(`${colEvent.startDate}T${colEvent.startTime}`), parseISO(`${colEvent.endDate}T${colEvent.endTime}`)))) {
          columns[i].push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
      }
    });
    return columns;
  };

  return (
    <CalendarContainer>
      <CalendarHeader
        title={`${format(selectedWeek, "MMMM d")} - ${format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), "MMMM d, yyyy")}`}
        onPrevious={previousWeek}
        onNext={nextWeek}
        previousLabel="Previous week"
        nextLabel="Next week"
      />
      <div className={`grid ${isInWeekView ? 'grid-cols-6' : 'grid-cols-8'}`}>
        <div className="h-12 flex flex-col items-center justify-center border-b py-2">
          <h3 className="text-sm">Hours</h3>
        </div>
        {daysOfWeek
          .filter((_, index) => !isInWeekView || (index !== 5 && index !== 6))
          .map((day, dayIndex) => (
            <div key={dayIndex} className="h-12 flex flex-col items-center justify-center border-b py-2">
              <h3 className="text-sm">{format(day, "EEE, MMM d")}</h3>
            </div>
          ))}
      </div>

      <div className="relative border w-full">
        <div className={`grid ${isInWeekView ? 'grid-cols-6' : 'grid-cols-8'}`}>
          <div className="w-full">
            {hours.map((hour, index) => (
              <div key={index} className="h-12 flex items-center justify-center border-b border-r">
                <div className="w-16 text-right pr-2 text-xs">{format(hour, "HH:mm")}</div>
              </div>
            ))}
          </div>
          {daysOfWeek
            .filter((_, index) => !isInWeekView || (index !== 5 && index !== 6))
            .map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const groupedEvents = groupEvents(dayEvents);
              const maxColumns = groupedEvents.length;
              return (
                <div key={dayIndex} className="relative w-full cursor-pointer" onClick={() => onDateClick(day)}>
                  <div className="relative">
                    {hours.map((hour, index) => (
                      <div key={index} className="h-12 border-b border-r"></div>
                    ))}
                    {groupedEvents.map((eventsInColumn, columnIndex) =>
                      eventsInColumn.map((event, index) => {
                        const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
                        const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);

                        const dayStart = startOfDay(day);
                        const dayEnd = endOfDay(day);

                        const actualStart = eventStart < dayStart ? dayStart : eventStart;
                        const actualEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

                        const eventStartHour = getHours(actualStart);
                        const eventStartMinute = getMinutes(actualStart);
                        const startTop = (eventStartHour + eventStartMinute / 60) * 3;
                        const eventHeight = (differenceInMinutes(actualEnd, actualStart) / 60) * 3;
                        const isPast = isBefore(actualEnd, currentTime);
                        const eventColor = getCategoryColor(event.category, isPast);

                        const eventWidth = `${100 / maxColumns}%`;
                        const eventLeft = `${columnIndex * (100 / maxColumns)}%`;

                        return (
                          <div
                            key={index}
                            className={`absolute text-black text-xs rounded-lg shadow-lg cursor-pointer ${eventColor}`}
                            style={{
                              top: `${startTop}rem`,
                              height: `${eventHeight}rem`,
                              width: `calc(${eventWidth} - 4px)`,
                              left: `calc(${eventLeft} + 2px)`,
                              opacity: isPast ? 0.5 : 1,
                            }}
                          >
                            <div className="px-2 py-1">
                              <div className="font-semibold">{event.title}</div>
                              <div>{event.startTime} - {event.endTime}</div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {isCurrentWeek && format(currentTime, "yyyy-MM-dd") === format(day, "yyyy-MM-dd") && (
                      <CurrentTimeIndicator topPosition={getCurrentTimePosition(currentTime)} />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </CalendarContainer>
  );
}

WeekCalendar.propTypes = {
  events: PropTypes.array,
  onDateClick: PropTypes.func,
  isInWeekView: PropTypes.bool,
};

export default WeekCalendar;
