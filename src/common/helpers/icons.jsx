import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faAddressCard,
  faBars,
  faChevronDown,
  faChevronLeft,
  faChevronUp,
  faListCheck,
  faMagnifyingGlass,
  faMinus,
  faMoon,
  faPlus,
  faSquareMinus,
  faSquarePlus,
  faSun,
  faTimes,
  faTrash,
  faUserGroup,
  faPenToSquare,
  faCircleArrowLeft,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GithubIcon = () => {
  return <FontAwesomeIcon icon={faGithub} size="2x" />;
};

export const LinkedInIcon = () => {
  return <FontAwesomeIcon icon={faLinkedin} size="2x" />;
};

export const GithubIssues = () => {
  return <FontAwesomeIcon icon={faListCheck} size="2x" />;
};

export const AboutUs = () => {
  return <FontAwesomeIcon icon={faAddressCard} size="2x" />;
};


export const MagnGlass = () => {
  return <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600" />;
};

export const Burger = () => {
  return (
    <FontAwesomeIcon
      icon={faBars}
      className="swap-off fill-current [:checked~*_&]:!-rotate-45 [:checked~*_&]:!opacity-0"
      style={{ width: "24px", height: "24px" }}
    />
  );
};

export const CancelBurger = () => {
  return (
    <FontAwesomeIcon
      icon={faTimes}
      className="swap-on fill-current [:checked~*_&]:!rotate-0 [:checked~*_&]:!opacity-100"
      style={{ width: "24px", height: "24px" }}
    />
  );
};

export const Moon = () => {
  return (
    <FontAwesomeIcon
      icon={faMoon}
      className="swap-off fill-current w-10 h-10"
      style={{ width: "20px", height: "20px" }}
    />
  );
};

export const Sun = () => {
  return (
    <FontAwesomeIcon
      icon={faSun}
      className="swap-on fill-current w-10 h-10"
      style={{ width: "20px", height: "20px" }}
    />
  );
};

export const Contacts = () => {
  return <FontAwesomeIcon icon={faChevronLeft} size={"lg"} />;
};

export const GoBack = () => {
  return <FontAwesomeIcon icon={faUserGroup} size={"lg"} />;
};

 
export const GoBackArrow = ({ onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", fontSize: "2em" }}>
      <FontAwesomeIcon icon={faCircleArrowLeft} />
    </div>
  );
};

 
export const Edit = ({ onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", fontSize: "2em" }}>
      <FontAwesomeIcon icon={faPenToSquare} />
    </div>
  );
};

 
export const DeleteEvent = ({ onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", fontSize: "2em" }}>
      <FontAwesomeIcon icon={faTrash} />
    </div>
  );
};

export const Plus = () => {
  return (
    <FontAwesomeIcon
      className="swap-off fill-current"
      icon={faSquarePlus}
      size={"xl"}
    />
  );
};

export const Minus = () => {
  return (
    <FontAwesomeIcon
      className="swap-on fill-current"
      icon={faSquareMinus}
      size={"xl"}
    />
  );
};

export const PlusToggle = () => {
  return (
    <FontAwesomeIcon
      icon={faPlus}
      className="swap-off fill-current"
      size={"1x"}
    />
  );
};

export const MinusToggle = () => {
  return (
    <FontAwesomeIcon
      icon={faMinus}
      className="swap-on fill-current"
      size={"1x"}
    />
  );
};

export const ArrowUp = () => {
  return (
    <FontAwesomeIcon
      icon={faChevronUp}
      className="swap on fill-current"
      size={"1x"}
    />
  );
};

export const ArrowDown = () => {
  return (
    <FontAwesomeIcon
      icon={faChevronDown}
      className="swap on fill-current"
      size={"1x"}
    />
  );
};

export const TrashBin = () => {
  return <FontAwesomeIcon icon={faTrash} size={"lg"} />;
};

export const Check = () => {
  return <FontAwesomeIcon icon={faCheck} size={"lg"} />;
};

export const Uncheck = () => {
  return <FontAwesomeIcon icon={faXmark} size={"lg"} />;
};
