import { useEffect, useState, useContext } from "react";
import { getPublicEvents } from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { GoBackArrow } from "../../common/helpers/icons.jsx";
import { BASE } from "../../common/constants.js";
import LoadingSpinner from "../Loading/LoadingSpinner.jsx";
import EventItem from "./EventItem.jsx";

export default function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    loading: userLoading,
  } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const publicEvents = await getPublicEvents();
        setEvents(publicEvents);
      } catch (error) {
        console.error("Error fetching public events:", error);
        setError("Failed to fetch public events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl text-center font-bold ">Public Events</h1>
        <GoBackArrow onClick={() => navigate(`${BASE}events`)} />
      </div>
      <div className="flex flex-col space-y-8 mt-4">
        {events.length === 0 ? (
          <div className="text-center">No public events found.</div>
        ) : (
          events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
