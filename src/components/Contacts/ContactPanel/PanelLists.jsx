import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { Plus, TrashBin } from "../../../common/helpers/icons";
import {
  deleteContactList,
  updateContact,
} from "../../../services/contacts.service";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { ToastContainer } from "react-toastify";
import { themeChecker } from "../../../common/helpers/toast";
import { BASE } from "../../../common/constants";

export default function PanelLists({ setCurrentView, list, allContacts }) {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState({});
  const [updatingContact, setUpdatingContact] = useState(null);

  useEffect(() => {
    setContacts(list?.contacts || {});
  }, [list?.contacts]);

  const handleDelete = async (id) => {
    try {
      await deleteContactList(id, userData?.handle);
      themeChecker("Contact list deleted!");
      setCurrentView("My Contacts");
    } catch (error) {
    }
  };

  const handleUpdateList = async (listKey, contact) => {
    if (updatingContact) return;

    const user = contact.handle.toLowerCase();
    const isRemoving = !!contacts[user];
    const updatedContacts = { ...contacts };

    if (isRemoving) {
      delete updatedContacts[user];
    } else {
      updatedContacts[user] = true;
    }

    setUpdatingContact(contact.handle);

    try {
      await updateContact(listKey, updatedContacts);
      setContacts(updatedContacts);
      themeChecker(
        `${contact.handle} ${isRemoving ? "removed from" : "added to"} ${list.title}!`
      );
    } catch (error) {
    } finally {
      setUpdatingContact(null);
    }
  };

  return (
    <ul className="mb-4 p-4 bg-transparent rounded-lg shadow-xl">
      <div className="flex items-center justify-between py-2">
        <span
          className="text-sm cursor-pointer tracking-wider"
          onClick={() => {
            setCurrentView(list.title);
            navigate(`${BASE}contacts`);
          }}
        >
          {list.title}
        </span>

        <div className="flex gap-4">
          <div className="dropdown dropdown-left dropdown-end ">
            <div tabIndex={0} role="button" className="btn-ghost">
              <Plus />
            </div>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box overflow-auto h-auto max-h-96 z-[1000]">
              <li className="menu-title">
                <span>Contacts</span>
              </li>
              {allContacts && allContacts.length > 0 ? (
                allContacts.map((contact) => {
                  const isContactInList =
                    (contacts && contacts[contact.handle.toLowerCase()]) ??
                    false;
                  return (
                    <li key={contact.handle}>
                      <label className="label cursor-pointer w-full justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-md"
                          checked={isContactInList}
                          onChange={() => handleUpdateList(list.key, contact)}
                          disabled={updatingContact === contact.handle}
                        />
                        <span className="label-text ml-2">
                          {contact.handle}
                        </span>
                      </label>
                    </li>
                  );
                })
              ) : (
                <li className="text-center py-2">No contacts available</li>
              )}
            </ul>
          </div>
          <button onClick={() => handleDelete(list.key)}>
            <TrashBin />
          </button>
        </div>
      </div>
    </ul>
  );
}

PanelLists.propTypes = {
  list: PropTypes.object.isRequired,
  renderedContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  allContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCurrentView: PropTypes.func.isRequired,
};
