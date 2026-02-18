import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelLists from "./PanelLists";
import { BASE } from "../../../common/constants";

export default function ContactList({
  setCurrentView,
  contactLists,
  allContacts,
}) {
  const [renderedContacts, setRenderedContacts] = useState([]);
  const [visibleContacts] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (contactLists) {
      setRenderedContacts(contactLists.slice(0, visibleContacts));
    }
  }, [contactLists, visibleContacts]);

  return (
    <div className="h-60">
      <ul className="mb-4 p-4 bg-transparent rounded-lg shadow-xl">
        <span
          className={`text-sm cursor-pointer tracking-wider `}
          onClick={() => {
            setCurrentView("My Contacts");
            navigate(`${BASE}contacts`);
          }}
        >
          My Contacts
        </span>
      </ul>
      {renderedContacts &&
        renderedContacts.map((list, uniqueId) => (
          <PanelLists
            key={uniqueId}
            list={list}
            renderedContacts={renderedContacts}
            allContacts={allContacts}
            setCurrentView={setCurrentView}
          />
        ))}
    </div>
  );
}

ContactList.propTypes = {
  setCurrentView: PropTypes.func,
  contactLists: PropTypes.arrayOf(PropTypes.object),
  allContacts: PropTypes.arrayOf(PropTypes.object),
};
