import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import {
  getEventById,
  updateEvent,
  deleteEvent,
  getUserContacts,
  inviteUser,
  uninviteUser,
} from "../../services/event.service.js";
import Button from "../Button.jsx";
import {
  GoBackArrow,
  DeleteEvent,
} from "../../common/helpers/icons.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { uploadCover } from "../../services/upload.service.js";
import "./styles.css";
import { errorChecker, themeChecker } from "../../common/helpers/toast.js";
import showConfirmDialog from "../ConfirmDialog.jsx";
import { BASE } from "../../common/constants.js";
import { useLocationAutocomplete } from "../../hooks/useLocationAutocomplete.js";
import { useEventFormValidation } from "../../hooks/useEventFormValidation.js";
import EventFormFields from "./form/EventFormFields.jsx";
import ReoccurringSelect from "./form/ReoccurringSelect.jsx";
import CategorySelect from "./form/CategorySelect.jsx";

export default function UpdateEvent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [finalDate, setFinalDate] = useState("");
  const [isIndefinite, setIsIndefinite] = useState(false);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const inviteRef = useRef(null);
  const uninviteRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isReoccurringOpen, setIsReoccurringOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const { suggestions, handleLocationChange, handleSuggestionClick } =
    useLocationAutocomplete();

  const { validateEventForm } = useEventFormValidation(event);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        if (["weekly", "monthly", "yearly"].includes(eventData.isReoccurring)) {
          setFinalDate(eventData.finalDate);
          setIsIndefinite(eventData.isReoccurring === "indefinitely");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError("Failed to fetch event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (userData?.handle) {
        const contactsData = await getUserContacts(userData.handle);
        setContacts(contactsData);
      }
    };

    fetchContacts();
  }, [userData]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (inviteRef.current && !inviteRef.current.contains(e.target)) {
        inviteRef.current.removeAttribute("open");
      }
      if (uninviteRef.current && !uninviteRef.current.contains(e.target)) {
        uninviteRef.current.removeAttribute("open");
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const updateEventData = (value, key) => {
    setEvent({
      ...event,
      [key]: value,
    });
  };

  const handleUpdateEvent = async () => {
    const filteredErrors = validateEventForm();

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    try {
      await updateEvent(eventId, event);
      navigate(`${BASE}events/${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
      errorChecker("Failed to update event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    showConfirmDialog(
      "Are you sure you want to delete this event?",
      async () => {
        try {
          const result = await deleteEvent(eventId);
          if (result) {
            navigate(`${BASE}my-events`);
          } else {
            errorChecker("Failed to delete event. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          errorChecker("Failed to delete event. Please try again.");
        }
      }
    );
  };

  const handleInviteUser = async (userHandle) => {
    if (event.peopleGoing && event.peopleGoing[userHandle]) {
      themeChecker("This user is already invited to this event!");
      if (inviteRef.current) {
        inviteRef.current.open = false;
      }
      return;
    }

    try {
      const result = await inviteUser(eventId, userData.handle, userHandle);
      if (result) {
        themeChecker(`${userHandle} was successfully invited.`);
        setEvent({
          ...event,
          peopleGoing: {
            ...event.peopleGoing,
            [userHandle]: true,
          },
        });
        if (inviteRef.current) {
          inviteRef.current.open = false;
        }
      } else {
        errorChecker(`Failed to invite user ${userHandle}`);
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      errorChecker("Failed to invite user. Please try again.");
    }
  };

  const handleUninviteUser = async (userHandle) => {
    try {
      const result = await uninviteUser(eventId, userHandle);
      if (result) {
        themeChecker(`${userHandle} was successfully kicked out.`);
        const updatedPeopleGoing = { ...event.peopleGoing };
        delete updatedPeopleGoing[userHandle];
        setEvent({
          ...event,
          peopleGoing: updatedPeopleGoing,
        });
        if (uninviteRef.current) {
          uninviteRef.current.open = false;
        }
      } else {
        errorChecker(`Failed to uninvite user ${userHandle}`);
      }
    } catch (error) {
      console.error("Error uninviting user:", error);
      errorChecker("Failed to uninvite user. Please try again.");
    }
  };

  const handleUpdateCover = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const coverURL = await uploadCover(event.title, file);
        const updatedEvent = { ...event, cover: coverURL };
        await updateEvent(eventId, updatedEvent);
        setEvent(updatedEvent);
        themeChecker("Cover image updated successfully.");
      } catch (error) {
        console.error("Error updating cover image:", error);
        errorChecker("Failed to update cover image. Please try again.");
      }
    }
  };

  const onLocationChange = (e) => {
    const value = e.target.value;
    handleLocationChange(value, (newValue) => updateEventData(newValue, "location"));
  };

  const onSuggestionClick = (suggestion) => {
    handleSuggestionClick(suggestion, (newValue) =>
      updateEventData(newValue, "location")
    );
  };

  if (!event) return <div className="text-center mt-10">No event found.</div>;

  return (
    <div className="single-event-container p-4 max-w-5xl mx-auto rounded-[30px] mt-8 mb-8" style={{ boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.2)' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Update Event</h1>
        <div className="flex items-center space-x-2">
          <details className="dropdown" ref={inviteRef}>
            <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">
              Invite
            </summary>
            <div
              className="dropdown-menu absolute max-h-96 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black hover:glass"
              style={{ zIndex: 999, minWidth: '200px' }}
            >
              <ul className="space-y-2 overflow-x-hidden">
                {contacts.filter((contact) => !event.peopleGoing || !event.peopleGoing[contact]).length === 0 ? (
                  <li className="p-2">No contacts to invite.</li>
                ) : (
                  contacts
                    .filter((contact) => !event.peopleGoing || !event.peopleGoing[contact])
                    .map((contact) => (
                      <li
                        key={contact}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        <a onClick={() => handleInviteUser(contact)}>{contact}</a>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </details>
          <details className="dropdown" ref={uninviteRef}>
            <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">
              Uninvite
            </summary>
            <div
              className="dropdown-menu absolute max-h-96 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black hover:glass"
              style={{ zIndex: 999, minWidth: '200px' }}
            >
              <ul className="space-y-2 overflow-x-hidden">
                {Object.keys(event.peopleGoing || {}).filter(
                  (handle) => handle !== event.creator
                ).length === 0 ? (
                  <li className="p-2">No participants to uninvite.</li>
                ) : (
                  Object.keys(event.peopleGoing || {})
                    .filter((handle) => handle !== event.creator)
                    .map((participant) => (
                      <li
                        key={participant}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        <a onClick={() => handleUninviteUser(participant)}>
                          {participant}
                        </a>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </details>
          <Button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current.click()}
          >
            Update Cover
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleUpdateCover}
          />
          <DeleteEvent onClick={handleDeleteEvent} />
          <GoBackArrow onClick={() => navigate(`${BASE}events/${eventId}`)} />
        </div>
      </div>

      <EventFormFields
        event={event}
        onUpdate={updateEventData}
        errors={errors}
        onLocationChange={onLocationChange}
        onSuggestionClick={onSuggestionClick}
        locationSuggestions={suggestions}
      >
        <div className="flex items-center space-x-2 mb-4">
          <label className="font-semibold">Public Event:</label>
          <input
            type="checkbox"
            checked={event.isPublic}
            onChange={(e) => updateEventData(e.target.checked, "isPublic")}
          />
        </div>

        <ReoccurringSelect
          value={event.isReoccurring}
          onUpdate={(value) => updateEventData(value, "isReoccurring")}
          isOpen={isReoccurringOpen}
          onToggle={setIsReoccurringOpen}
          finalDate={finalDate}
          isIndefinite={isIndefinite}
          onFinalDateChange={(value) => {
            setFinalDate(value);
            updateEventData(value, "finalDate");
          }}
          onIndefiniteChange={setIsIndefinite}
        />

        <CategorySelect
          value={event.category}
          onUpdate={(value) => updateEventData(value, "category")}
          isOpen={isCategoryOpen}
          onToggle={setIsCategoryOpen}
          includeOther={false}
        />
      </EventFormFields>

      <div className="flex space-x-4">
        <Button className="btn btn-primary" onClick={handleUpdateEvent}>
          Update Event
        </Button>
      </div>
    </div>
  );
}
