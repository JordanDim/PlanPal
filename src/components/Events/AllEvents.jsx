import { useEffect, useState, useContext, useRef } from "react";
import {
  getAllEvents,
  sortByCategory,
  searchEventsByName,
} from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { BASE } from "../../common/constants.js";
import "./styles.css";
import LoadingSpinner from "../Loading/LoadingSpinner.jsx";
import EventItem from "./EventItem.jsx";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    userData,
    loading: userLoading,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  const categories = ["Entertainment", "Sports", "Culture & Science", "Other"];

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userData) return;
      try {
        const eventsData = await getAllEvents(userData.handle);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userData]);

  useEffect(() => {
    const performSearch = async () => {
      if (!userData) return;
      if (searchTerm.trim() !== "") {
        const results = await searchEventsByName(searchTerm);
        setEvents(results);
      } else {
        const eventsData = await getAllEvents(userData.handle);
        setEvents(eventsData);
      }
    };

    performSearch();
  }, [searchTerm, userData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        categoriesRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortByCategory = async (category) => {
    setLoading(true);
    try {
      const sortedEvents = await sortByCategory(category);
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error sorting events by category:", error);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
    if (categoriesRef.current) {
      categoriesRef.current.removeAttribute("open");
    }
  };

  if (loading || userLoading || !userData)
    return (
      <div className="text-center mt-10">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="events-container relative px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">All Events</h1>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            className="btn btn-primary btn-sm sm:btn-md"
            onClick={() => navigate(`${BASE}create-event`)}
          >
            Create Event
          </button>

          <button
            className="btn btn-sm sm:btn-md"
            onClick={() => navigate(`${BASE}my-events`)}
          >
            My Events
          </button>

          <button
            className="btn btn-sm sm:btn-md"
            onClick={() => navigate(`${BASE}public-events`)}
          >
            Public Events
          </button>
          <button
            className="btn btn-sm sm:btn-md"
            onClick={() => navigate(`${BASE}private-events`)}
          >
            Private Events
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center w-full lg:w-auto">
          {userData.role === "Admin" && (
            <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search events"
                className="input input-bordered input-sm sm:input-md w-full lg:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <details
            className="dropdown dropdown-end w-full lg:w-auto"
            ref={categoriesRef}
            style={{ position: "relative" }}
          >
            <summary className="font-bold py-2 px-4 cursor-pointer btn btn-secondary btn-sm sm:btn-md w-full lg:w-auto">
              ▼Categories
            </summary>
            <div
              className="dropdown-menu absolute max-h-48 overflow-y-auto mt-2"
              style={{ zIndex: 999 }}
            >
              <ul className="space-y-2 backdrop-blur-lg bg-white/10 text-black">
                {categories.length === 0 ? (
                  <li className="p-2 hover:glass">No categories found.</li>
                ) : (
                  categories.map((category, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSortByCategory(category)}
                    >
                      {category}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </details>
        </div>
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
