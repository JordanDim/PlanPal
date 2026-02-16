# PlanPal - Event Calendar

PlanPal is your go-to solution for flexible event scheduling, designed to meet the needs of individuals and teams. With features like event series creation, reminders, and contacts lists, organizing your events has never been easier!

## 📝 Project Overview

This is a **clone of the Plan project** with several enhancements and optimizations:

- **Storage Migration**: Event posters and user avatars are now hosted on Uploadcare because Firebase Storage has become part of the project's pricing plan.
- **Enhanced UI/UX**: Improved CSS styling and layout responsiveness for a better user experience across devices.
- **Demo Account**: A demo account is available for users to explore the core functionality without registration.

**Demo Account Credentials:**
- Email: `demo@planpal.com`
- Password: `Demo123!`

---

## Why PlanPal?


 - Efficient event scheduling for both individuals and teams.
 - Feature-rich calendar with options for event series, reminders, and contacts.
 - Seamless integration with Firebase for secure authentication and real-time data storage.

## Features

### Authentication:
- Handled securely by Firebase, ensuring user data safety.

### Events:
- Create single or series events with customizable details like title, date, time, and location.
- Invite participants and manage event privacy settings.
- Add descriptions, tags, and attach a map to the event location.

### Contacts Lists:
- Organize your contacts into custom lists for easy event invitations.

### Calendar Views:
- Choose from various calendar views including day, week, month, and work week

### Personalization:
- Edit personal information including name, phone, address, and avatar picture.
- Search for other users and invite them to events.

### Administration:
- Admin panel for managing users, events, and permissions.



## Installation


Clone this repository to your local machine:

```
https://github.com/ReactProjectA58/PlanPal
```

Navigate to the project directory:

```
cd planpal
```
Install the required dependencies:
```
npm install
```
Start the development server:

```
npm run dev
```

## User Document Structure

    uid (Auto-generated Unique Identifier)
        A unique identifier for each user document.

    username (String)
        The username chosen by the user.

    email (String)
        The email address of the user.

    firstName (String)
        The first name of the user.

    lastName (String)
        The last name of the user.

    handle (String)
        A handle or alias chosen by the user.

    isBlocked (Boolean)
        Indicates whether the user is currently blocked from the platform.

    phoneNumber (String)
        The phone number of the user.

    address (String)
        The address of the user.

    avatar (String)
        The URL to the user's avatar image.

    role (String)
        The role of the user in the system (e.g., "User" or "Admin").

    goingToEvents (Map)
        A map containing IDs of events the user is attending as keys and boolean values indicating participation.

    contactLists (Map)
        A map containing the user's contact lists, each identified by a unique ID.


## Event Document Structure

    eventId (Auto-generated Unique Identifier)
        A unique identifier for each event document.

    title (String)
        The title of the event.

    category (String)
        The category of the event (e.g., "Sports", "Music").

    cover (String)
        The URL of the event cover image.

    description (String)
        The description of the event.

    startDate (String)
        The start date of the event.

    startTime (String)
        The start time of the event.

    endDate (String)
        The end date of the event.

    endTime (String)
        The end time of the event.

    location (String)
        The location of the event.

    isPublic (Boolean)
        Indicates whether the event is public.

    isReoccurring (String)
        Indicates the reoccurrence pattern of the event (e.g., "never", "daily").

    creator (String)
        The username of the user who created the event.

    createdOn (Timestamp)
        The timestamp indicating when the event was created.

    isDeleted (Boolean)
        Indicates whether the event is deleted.


## Contact List Document Structure

    contactListId (Auto-generated Unique Identifier)
        A unique identifier for each contact list document.

    title (String)
        The title of the contact list.

    creator (String)
        The username of the user who created the contact list.

    contacts (Map)
        A map of usernames that are included in the contact list.


## Community and Contributions

PlanPal is developed by **TEAM 3**.

We value open communication with our community to enhance the platform continuously. Your feedback is invaluable in shaping PlanPal's future.
