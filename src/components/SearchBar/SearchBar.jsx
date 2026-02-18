import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MagnGlass } from "../../common/helpers/icons";

export default function SearchBar({ onSearch, clearSearch, currentView }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (clearSearch) {
      setSearchQuery("");
    }
  }, [clearSearch, currentView]);

  return (
    <div className=" flex items-center max-w-md shadow-lg rounded-lg ">
      <div className="relative left-4 flex items-center pointer-events-none">
        <MagnGlass />
      </div>
      <input
        type="text"
        className="pl-10 pr-3 py-2 -ml-3 rounded-l-lg border border-transparent focus:outline-none w-full"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={handleKeyPress}
      />

      <button className="btn btn-ghost" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  clearSearch: PropTypes.bool,
  currentView: PropTypes.string,
};
