import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Contacts,
  GoBack,
  Minus,
  MinusToggle,
  Plus,
  PlusToggle,
} from "../../../common/helpers/icons";
import CreateNewContactList from "./CreateNewContactList";
import ContactList from "./ContactList";
import SearchBar from "../../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { updateContact } from "../../../services/contacts.service";
import { themeChecker } from "../../../common/helpers/toast";
import { BASE } from "../../../common/constants";

export default function ContactPanel({
  isSearching,
  currentView,
  setCurrentView,
  clearSearch,
  setClearSearch,
  searchQuery,
  searchResults,
  contactLists,
  allContacts,
  onAddContact,
  onRemoveContact,
}) {
  const { userData } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowUp, setIsArrowUp] = useState(false);
  const [updatingContact, setUpdatingContact] = useState(null);
  const navigate = useNavigate();

  const toggleCollapsePlus = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleCollapseArrow = () => {
    setIsArrowUp((prev) => !prev);
  };

  const getContacts = () => {
    if (isSearching) {
      return searchResults || [];
    } else if (currentView === "My Contacts") {
      return allContacts || [];
    } else {
      const currentList = contactLists.find(
        (list) => list?.title === currentView
      );
      if (currentList) {
        return Object.keys(currentList.contacts || {})
          .map((handle) =>
            allContacts.find((contact) => contact?.handle === handle)
          )
          .filter(Boolean);
      }
    }
    return [];
  };

  const getTooltip = (contactHandle) => {
    if (currentView === "My Contacts") {
      return isAddedContact(contactHandle) ? "Remove user" : "Add user";
    } else {
      const tooltip = isAddedContact(contactHandle) ? "Remove" : "Add contact ";
      return `${tooltip}`;
    }
  };

  const isLoggedInUser = (contactHandle) => {
    return userData && userData.handle === contactHandle;
  };

  const handleSearch = (query) => {
    navigate(`${BASE}contacts?query=${query}`);
  };

  const handleContactsBackClick = () => {
    navigate(`${BASE}contacts`);
    setCurrentView("My Contacts");
    setClearSearch((prev) => !prev);
  };

  const isAddedContact = (contactHandle) => {
    return allContacts.some((c) => c?.handle === contactHandle);
  };

  const handleToggleContact = async (contactHandle) => {
    if (updatingContact) return;

    setUpdatingContact(contactHandle);

    try {
      if (currentView === "My Contacts") {
        const isRemoving = isAddedContact(contactHandle);

        if (isRemoving) {
          await onRemoveContact(contactHandle);
          themeChecker(`${contactHandle} removed from Contacts!`);
        } else {
          await onAddContact(contactHandle);
          themeChecker(`${contactHandle} added to Contacts!`);
        }
      } else {
        const currentList = contactLists.find(
          (list) => list.title === currentView
        );
        if (currentList) {
          const updatedListContacts = { ...(currentList.contacts || {}) };
          if (updatedListContacts[contactHandle]) {
            delete updatedListContacts[contactHandle];
          } else {
            updatedListContacts[contactHandle] = true;
          }
          await updateContact(currentList.key, updatedListContacts);
        }
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
      themeChecker("Failed to update contact. Please try again.", "error");
    } finally {
      setUpdatingContact(null);
    }
  };

  useEffect(() => {
    if (currentView !== "My Contacts") {
      const currentContactList = contactLists.find(
        (list) => list.title === currentView
      );
      if (currentContactList) {
      }
    }
  }, [currentView, contactLists, allContacts]);

  return (
    <div>
      {/* separate component */}
      <h1 className="text-3xl rounded-lg glass max-w-fit mx-auto my-auto p-4 mt-5">
        Contacts Dashboard
      </h1>
      <div className="flex justify-between items-center flex-col md:flex-row p-3">
        <div className="flex items-center justify-between mb-4 md:mb-0">
          {isSearching ? (
            <a onClick={handleContactsBackClick}>
              <Contacts />
            </a>
          ) : (
            <GoBack />
          )}
          <h2 className="text-lg md:ml-4">
            {isSearching ? `Contacts Found for '${searchQuery}'` : currentView}
          </h2>
        </div>
        <SearchBar
          onSearch={handleSearch}
          currentView={currentView}
          clearSearch={clearSearch}
        />
      </div>
      {/* separate component */}

      {/* separate component */}
      <div className={getContacts().length > 3 ? "overflow-y-scroll h-96" : ""}>
        <ul>
          {getContacts().length === 0 ? (
            <p className="flex justify-center m-4">
              No contacts added to this list
            </p>
          ) : (
            getContacts().map((contact) => {
              return (
                <li
                  key={contact.uid}
                  className="mb-4 p-4 bg-transparent rounded-lg shadow-xl"
                >
                  {contact && (
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr></tr>
                        </thead>
                        <tbody>
                          <tr className="flex justify-between">
                            <td className="flex items-center gap-3 w-1/3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-20 h-16">
                                  <img
                                    src={contact.avatar}
                                    alt="Avatar"
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">
                                  {contact.firstName} {contact.lastName}
                                </div>
                                <div className="text-sm opacity-50">
                                  Bulgaria
                                </div>
                              </div>
                            </td>
                            <td className="flex flex-col items-center justify-center text-center w-1/5">
                              {contact.handle} <br />
                              <span className="badge badge-ghost badge-sm">
                                {contact.email}
                              </span>
                            </td>
                            {!isLoggedInUser(contact.handle) && (
                              <td className="flex items-center justify-center mr-9">
                                <div
                                  className="tooltip break-all"
                                  data-tip={getTooltip(contact.handle)}
                                >
                                  <label className="swap">
                                    <input
                                      type="checkbox"
                                      checked={isAddedContact(contact.handle)}
                                      onChange={() =>
                                        handleToggleContact(contact.handle)
                                      }
                                      disabled={updatingContact === contact.handle}
                                    />
                                    {isAddedContact(contact.handle) ? (
                                      <Minus />
                                    ) : (
                                      <Plus />
                                    )}
                                  </label>
                                </div>
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
      {/* separate component */}

      <div className="collapse bg-base-200 mb-2">
        <input
          type="checkbox"
          checked={isArrowUp}
          onChange={toggleCollapseArrow}
        />
        <div className="flex justify-between collapse-title text-xl font-medium">
          <label className="swap">
            <input type="checkbox" checked={isArrowUp} readOnly />
            {isArrowUp ? <ArrowUp /> : <ArrowDown />}
          </label>
          <span>Contact Lists</span>
        </div>
        <div className="collapse-content">
          <ContactList
            currentView={currentView}
            setCurrentView={setCurrentView}
            contactLists={contactLists}
            allContacts={allContacts}
            isSearching={isSearching}
          />
        </div>
      </div>
      <div>
        <div className="collapse bg-base-200">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={toggleCollapsePlus}
          />

          <div className="flex justify-between collapse-title text-xl font-medium">
            <span>Create New Contact List</span>
            <label className="swap">
              <input type="checkbox" checked={isOpen} readOnly />
              {isOpen ? <MinusToggle /> : <PlusToggle />}
            </label>
          </div>
          <div className="collapse-content">
            <CreateNewContactList />
          </div>
        </div>
      </div>
    </div>
  );
}

ContactPanel.propTypes = {
  currentView: PropTypes.string,
  setCurrentView: PropTypes.func,
  contactLists: PropTypes.arrayOf(PropTypes.object),
  allContacts: PropTypes.arrayOf(PropTypes.object),
  isSearching: PropTypes.bool,
  clearSearch: PropTypes.bool,
  setClearSearch: PropTypes.func,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  onAddContact: PropTypes.func,
  onRemoveContact: PropTypes.func,
};
