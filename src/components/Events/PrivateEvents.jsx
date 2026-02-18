import { useEffect, useState, useContext } from "react";
import { getPrivateEvents } from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { GoBackArrow } from "../../common/helpers/icons.jsx";
import { BASE } from "../../common/constants.js";
import LoadingSpinner from "../Loading/LoadingSpinner.jsx";
import EventItem from "./EventItem.jsx";

export default function PrivateEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    userData,
    loading: userLoading,
  } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const privateEvents = await getPrivateEvents(userData.handle);
        setEvents(privateEvents);
      } catch (error) {
        console.error("Error fetching private events:", error);
        setError("Failed to fetch private events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchEvents();
    }
  }, [userData]);


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
      <h1 className="text-4xl font-bold mb-8">Private Events</h1>
      <div className="absolute top-0 right-0 mt-4 mr-4 z-10">
        <GoBackArrow onClick={() => navigate(`${BASE}events`)} />
      </div>
      <div className="flex flex-col space-y-8 mt-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-600">
            No private events found.
          </div>
        ) : (
          events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
