import { ref, push, getDatabase, get, update } from "firebase/database";
import { db } from "../config/firebase-config";
import { themeChecker } from "../common/helpers/toast";
import { restrictDemoUser } from "../common/helpers/demoUserRestriction";

export const addEvent = async (event) => {
  restrictDemoUser("create events");
  const newEvent = {
    ...event,
    createdOn: Date.now(),
    isDeleted: false,
    peopleGoing: {
      [event.creator]: true,
    },
  };

  const result = await push(ref(db, "events"), newEvent);
  const eventId = result.key;

  const updates = {};
  updates[`users/${newEvent.creator}/goingToEvents/${newEvent.title}`] = true;

  await update(ref(db), updates);

  return { id: eventId, ...newEvent };
};

export const getAllEvents = async (userHandle) => {
  try {
    const publicEvents = await getPublicEvents();
    const privateEvents = await getPrivateEvents(userHandle);

    return [...publicEvents, ...privateEvents];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};


export const joinEvent = async (handle, eventId) => {
  try {
    restrictDemoUser("join events");
  } catch (error) {
    if (error?.isDemoUserRestriction) return null;
  }

  const eventRef = ref(db, `events/${eventId}`);

  try {
    const eventSnapshot = await get(eventRef);
    if (!eventSnapshot.exists()) {
      console.error("Event does not exist");
      return;
    }

    const eventTitle = eventSnapshot.val().title;

    const userEventSnapshot = await get(
      ref(db, `users/${handle}/goingToEvents/${eventTitle}`)
    );
    if (userEventSnapshot.exists()) {
      themeChecker("You already joined this event");
      return;
    }

    const updates = {};
    updates[`events/${eventId}/peopleGoing/${handle}`] = true;
    updates[`users/${handle}/goingToEvents/${eventTitle}`] = true;

    await update(ref(db), updates);

    return { id: eventId, title: eventTitle };
  } catch (error) {
    console.error("Error joining event:", error);
    return null;
  }
};

export const leaveEvent = async (handle, eventTitle) => {
  try {
    restrictDemoUser("leave events");
  } catch (error) {
    if (error?.isDemoUserRestriction) return null;
  }

  const eventRef = ref(db, `events/`);
  let eventId;

  try {
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const events = snapshot.val();
      for (const id in events) {
        if (events[id].title === eventTitle) {
          eventId = id;
          break;
        }
      }
    }

    if (!eventId) {
      console.error("Event does not exist");
      return;
    }

    const updates = {};
    updates[`events/${eventId}/peopleGoing/${handle}`] = null;
    updates[`users/${handle}/goingToEvents/${eventTitle}`] = null;

    await update(ref(db), updates);

    return { id: eventId, title: eventTitle };
  } catch (error) {
    console.error("Error leaving event:", error);
    return null;
  }
};

export const displayMyEvents = async (userHandle) => {
  const userRef = ref(db, `users/${userHandle}/goingToEvents`);
  const snapshot = await get(userRef);
  const eventTitles = snapshot.val() ? Object.keys(snapshot.val()) : [];

  const events = [];
  for (const title of eventTitles) {
    const eventSnapshot = await get(ref(db, `events/`));
    if (eventSnapshot.exists()) {
      const allEvents = eventSnapshot.val();
      for (const id in allEvents) {
        if (allEvents[id].title === title) {
          events.push({ id, ...allEvents[id] });
          break;
        }
      }
    }
  }

  return events;
};

export const getPublicEvents = async () => {
  const db = getDatabase();
  const eventsRef = ref(db, "events/");

  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      return Object.keys(eventsData)
        .filter((key) => eventsData[key].isPublic)
        .map((key) => ({
          id: key,
          ...eventsData[key],
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};


export const getPrivateEvents = async (userHandle) => {
  const db = getDatabase();
  const eventsRef = ref(db, "events");

  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      return Object.keys(eventsData)
        .filter(key => eventsData[key].peopleGoing && eventsData[key].peopleGoing[userHandle] && !eventsData[key].isPublic)
        .map(key => ({
          id: key,
          ...eventsData[key],
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching private events:", error);
    throw new Error("Failed to fetch private events");
  }
};




export const getEventDetails = async (eventId) => {
  const db = getDatabase();
  const eventRef = ref(db, `events/${eventId}`);

  try {
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      return { id: eventId, ...snapshot.val() };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};

export const getParticipants = async (eventId) => {
  const db = getDatabase();
  const participantsRef = ref(db, `events/${eventId}/peopleGoing`);

  try {
    const snapshot = await get(participantsRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  const db = getDatabase();
  const eventRef = ref(db, `events/${eventId}`);

  try {
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      return { id: eventId, ...snapshot.val() };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    restrictDemoUser("update events");
    const eventRef = ref(db, `events/${eventId}`);
    const eventSnapshot = await get(eventRef);

    if (!eventSnapshot.exists()) {
      console.error("Event does not exist");
      return;
    }

    const oldEventData = eventSnapshot.val();
    const oldEventTitle = oldEventData.title;
    const newEventTitle = eventData.title || oldEventTitle;
    const peopleGoing = oldEventData.peopleGoing || {};

    const updates = {};
    updates[`events/${eventId}`] = eventData;

    Object.keys(peopleGoing).forEach((handle) => {
      updates[`users/${handle}/goingToEvents/${oldEventTitle}`] = null;
      updates[`users/${handle}/goingToEvents/${newEventTitle}`] = true;
    });

    await update(ref(db), updates);
  } catch (error) {
    if (error?.isDemoUserRestriction) {
      throw error;
    }
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    restrictDemoUser("delete events");
  } catch (error) {
    if (error?.isDemoUserRestriction) return false;
  }

  const eventRef = ref(db, `events/${eventId}`);

  try {
    const eventSnapshot = await get(eventRef);
    if (!eventSnapshot.exists()) {
      console.error("Event does not exist");
      return false;
    }

    const eventTitle = eventSnapshot.val().title;
    const peopleGoing = eventSnapshot.val().peopleGoing || {};

    const updates = Object.keys(peopleGoing).reduce((acc, handle) => {
      acc[`users/${handle}/goingToEvents/${eventTitle}`] = null;
      return acc;
    }, {});
    updates[`events/${eventId}`] = null;

    await update(ref(db), updates);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};

export const getTopEvents = async () => {
  const db = getDatabase();
  const eventsRef = ref(db, "events/");

  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      const events = Object.keys(eventsData).map((key) => ({
        id: key,
        ...eventsData[key],
      }));

      return events.sort((a, b) => b.peopleGoing - a.peopleGoing).slice(0, 5);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};

export const getUserContacts = async (userHandle) => {
  const userRef = ref(db, `users/${userHandle}/contacts`);
  const snapshot = await get(userRef);
  const contacts = snapshot.val() || {};
  return Object.keys(contacts);
};

export const inviteUser = async (
  eventId,
  invitingUserHandle,
  userToInviteHandle
) => {
  try {
    restrictDemoUser("invite users to events");
  } catch (error) {
    if (error?.isDemoUserRestriction) return false;
  }

  const eventRef = ref(db, `events/${eventId}`);

  try {
    const eventSnapshot = await get(eventRef);
    if (!eventSnapshot.exists()) {
      console.error("Event does not exist");
      return false;
    }

    const eventTitle = eventSnapshot.val().title;

    const userContacts = await getUserContacts(invitingUserHandle);

    if (!userContacts.includes(userToInviteHandle)) {
      console.error("User to invite is not in the contacts list");
      return false;
    }

    const updates = {};
    updates[`events/${eventId}/peopleGoing/${userToInviteHandle}`] = true;
    updates[`users/${userToInviteHandle}/goingToEvents/${eventTitle}`] = true;

    await update(ref(db), updates);
    return true;
  } catch (error) {
    console.error("Error inviting user:", error);
    return false;
  }
};

export const uninviteUser = async (eventId, userHandle) => {
  try {
    restrictDemoUser("uninvite users from events");
  } catch (error) {
    if (error?.isDemoUserRestriction) return false;
  }

  const eventRef = ref(db, `events/${eventId}`);

  try {
    const eventSnapshot = await get(eventRef);
    if (!eventSnapshot.exists()) {
      console.error("Event does not exist");
      return false;
    }

    const eventTitle = eventSnapshot.val().title;

    const updates = {};
    updates[`events/${eventId}/peopleGoing/${userHandle}`] = null;
    updates[`users/${userHandle}/goingToEvents/${eventTitle}`] = null;

    await update(ref(db), updates);
    return true;
  } catch (error) {
    console.error("Error disinviting user:", error);
    return false;
  }
};

export const getContactListById = async (listId) => {
  const listRef = ref(db, `contactLists/${listId}/contacts`);
  const snapshot = await get(listRef);
  return snapshot.val() || {};
};

export const inviteList = async (eventId, invitingUserHandle, listId) => {
  try {
    restrictDemoUser("invite contact lists to events");
  } catch (error) {
    if (error?.isDemoUserRestriction) return false;
  }

  const eventRef = ref(db, `events/${eventId}`);

  try {
    const eventSnapshot = await get(eventRef);
    if (!eventSnapshot.exists()) {
      console.error("Event does not exist");
      return false;
    }

    const eventTitle = eventSnapshot.val().title;

    const contacts = await getContactListById(listId);

    if (!contacts || Object.keys(contacts).length === 0) {
      console.error("No contacts found in the specified list.");
      return false;
    }

    const updates = {};

    Object.keys(contacts).forEach((userToInviteHandle) => {
      updates[`events/${eventId}/peopleGoing/${userToInviteHandle}`] = true;
      updates[`users/${userToInviteHandle}/goingToEvents/${eventTitle}`] = true;
    });

    await update(ref(db), updates);
    return true;
  } catch (error) {
    console.error("Error inviting users from the contact list:", error);
    return false;
  }
};

export const getContactLists = async (userHandle) => {
  const db = getDatabase();
  const contactListsRef = ref(db, `contactLists`);
  try {
    const snapshot = await get(contactListsRef);
    if (snapshot.exists()) {
      const contactListsData = snapshot.val();
      const userLists = Object.keys(contactListsData).filter(
        (key) => contactListsData[key].creator === userHandle
      );
      return userLists.map((key) => ({
        id: key,
        ...contactListsData[key],
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching contact lists:", error);
    throw new Error("Failed to fetch contact lists");
  }
};

export const sortByCategory = async (category) => {
  const eventsRef = ref(db, "events");
  const snapshot = await get(eventsRef);
  const events = snapshot.val() || {};

  const filteredEvents = Object.values(events).filter(
    (event) => event.category === category
  );
  return filteredEvents;
};

export const getTopThreeEvents = async () => {
  const db = getDatabase();
  const eventsRef = ref(db, "events/");

  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      const events = Object.keys(eventsData).map((key) => ({
        id: key,
        ...eventsData[key],
      }));

      return events
        .filter((event) => event.isPublic)
        .sort(
          (a, b) =>
            Object.keys(b.peopleGoing || {}).length -
            Object.keys(a.peopleGoing || {}).length
        )
        .slice(0, 3);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};

export const searchEventsByName = async (searchTerm) => {
  const db = getDatabase();
  const eventsRef = ref(db, "events");

  try {
    const snapshot = await get(eventsRef);
    if (!snapshot.exists()) return [];

    const events = Object.entries(snapshot.val()).map(([key, value]) => ({
      ...value,
      id: key,
    }));

    return events.filter(
      (event) =>
        (event.title &&
          event.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.description &&
          event.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error) {
    console.error("Error searching events by name:", error);
    throw error;
  }
};
