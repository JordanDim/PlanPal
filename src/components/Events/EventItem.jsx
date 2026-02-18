 
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { joinEvent, leaveEvent } from "../../services/event.service.js";
import { BASE, EVENT_COVER_BY_DEFAULT } from "../../common/constants.js";
import { errorChecker, themeChecker } from "../../common/helpers/toast.js";
import showConfirmDialog from "../ConfirmDialog.jsx";

const EventItem = ({ event }) => {
  const { user, userData, setUserData } = useContext(AppContext);
  const [isGoing, setIsGoing] = useState(
    userData?.goingToEvents?.[event.title] || false
  );
  const navigate = useNavigate();

  const handleJoinEventDashboard = async () => {
    if (!userData) {
      alert("User data is not available.");
      return;
    }

    const result = await joinEvent(userData.handle, event.id);
    if (result) {
      themeChecker("You have joined the event successfully!");

      const updatedUserData = {
        ...userData,
        goingToEvents: {
          ...userData.goingToEvents,
          [event.title]: true,
        },
      };
      setUserData(updatedUserData);
      setIsGoing(true);
    }
  };

  const handleLeaveEventDashboard = async () => {
    if (!userData) {
      errorChecker("User data is not available.");
      return;
    }

    showConfirmDialog("Do you want to leave this event?", async () => {
      const result = await leaveEvent(userData.handle, event.title);
      if (result) {
        themeChecker("You have left the event successfully!");

        const updatedGoingToEvents = { ...userData.goingToEvents };
        updatedGoingToEvents[event.title] = false;
        setUserData({
          ...userData,
          goingToEvents: updatedGoingToEvents,
        });
        setIsGoing(false);
      }
    });
  };

  return (
    <li className="event-card backdrop-blur-lg bg-white/10 transform transition-transform hover:scale-105 mt-4 flex flex-col sm:flex-row items-center p-4 space-y-4 sm:space-y-0 sm:space-x-4 rounded-[30px]" style={{ boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.2)' }}>
      <figure className="w-full h-80 sm:w-64 sm:h-48 lg:w-80 lg:h-56 flex-shrink-0">
        <img
          src={event.cover || EVENT_COVER_BY_DEFAULT}
          alt="Event"
          className="event-cover rounded-[30px] w-full h-full object-cover"
        />
      </figure>
      <div className="card-body w-full flex flex-col space-y-2">
        <h2 className="card-title text-lg sm:text-xl font-semibold">{event.title}</h2>
        <p className="text-gray-500 break-words whitespace-normal overflow-hidden max-h-24 text-sm">
          {event.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-gray-500 text-xs">
          <p className="col-span-full">Location: {event.location}</p>
          <p>
            Start: {event.startDate} {event.startTime}
          </p>
          <p>
            End: {event.endDate} {event.endTime}
          </p>
          <p>Public: {event.isPublic ? "Yes" : "No"}</p>
          <p>Reoccurring: {event.isReoccurring}</p>
          <p>Creator: {event.creator}</p>
          <p>Category: {event.category}</p>
        </div>
        <div className="card-actions flex flex-wrap gap-2">
          <button
            className="btn btn-primary btn-sm sm:btn-md"
            onClick={() =>
              user
                ? navigate(`${BASE}events/${event.id}`)
                : navigate(`${BASE}login`)
            }
          >
            View more
          </button>
          {user && (
            <>
              {isGoing ? (
                <button className="btn btn-sm sm:btn-md" onClick={handleLeaveEventDashboard}>
                  Leave Event
                </button>
              ) : (
                <button
                  className="btn btn-secondary btn-sm sm:btn-md"
                  onClick={handleJoinEventDashboard}
                >
                  Join Event
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default EventItem;
