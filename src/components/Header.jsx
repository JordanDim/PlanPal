import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import { BASE, DARK_THEME, LIGHT_THEME } from "../common/constants";
import { Moon, Sun } from "../common/helpers/icons";
import SideBar from "./Sidebar/Sidebar";
import AnimatedButton from "./AnimatedButton/AnimatedButton";
import HomeButton from "./AnimatedButton/HomeButton";
import AdminPanelDropdown from "./AdminPanel/AdminPanel";
import showConfirmDialog from "./ConfirmDialog";
import CalendarViewDropdown from "./Calendar/CalendarViewDropdown";

export default function Header() {
  const { user, userData } = useContext(AppContext);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : LIGHT_THEME
  );
  const location = useLocation();
  const navigate = useNavigate();
  const handleToggle = (e) => {
    e.target.checked ? setTheme(DARK_THEME) : setTheme(LIGHT_THEME);
  };

  const handleClick = () => {
    navigate(`${BASE}profile/${userData ? userData.handle : ""}`);
  };

  const logout = async () => {
    showConfirmDialog("Leaving us so quickly?", async () => {
      await logoutUser();
      navigate(`${BASE}`);
    });
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  return (
    <div
      className={`navbar bg-base-300 min-w-full flex justify-between items-center backdrop-blur-lg bg-white/10 z-50 ${
        location.pathname === `${BASE}`
          ? "fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10"
          : ""
      }`}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-4">
        {user && <SideBar />}
        <HomeButton />
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-4">
        {user ? (
          <>
            {location.pathname === `${BASE}calendar` && <CalendarViewDropdown />}
            <button className="btn btn-primary hidden sm:block" onClick={handleClick}>
              Profile
            </button>
            {userData?.role === "Admin" && <AdminPanelDropdown className="hidden sm:block" />}
            <button className="btn btn-secondary hidden sm:block" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <AnimatedButton />
          </>
        )}
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            onChange={handleToggle}
            checked={theme === DARK_THEME}
          />
          <Sun />
          <Moon />
        </label>
      </div>
    </div>
  );
}
