import { useEffect, useState, useContext } from "react";
import { displayMyEvents } from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { GoBackArrow } from "../../common/helpers/icons.jsx";
import { BASE } from "../../common/constants.js";
import LoadingSpinner from "../Loading/LoadingSpinner.jsx";
import EventItem from "./EventItem.jsx";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    userData,
    loading: userLoading,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const fetchMyEvents = async (userHandle) => {
    try {
      const myEvents = await displayMyEvents(userHandle);
      setEvents(myEvents);
    } catch (error) {
      console.error("Error fetching my events:", error);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && userData) {
      fetchMyEvents(userData.handle);
    }
  }, [userData, userLoading]);


  if (loading || userLoading)
    return (
      <div className="text-center mt-10">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="events-container relative px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Events</h1>
      <div className="absolute top-0 right-0 mt-4 mr-4 z-10">
        <GoBackArrow onClick={() => navigate(`${BASE}events`)} />
      </div>
      <div className="flex flex-col space-y-8 mt-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-600">No events found.</div>
        ) : (
          events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
