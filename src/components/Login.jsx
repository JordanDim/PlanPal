import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { BASE } from "../common/constants";

export default function Login() {
  const { user } = useContext(AppContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location.state?.from.pathname || `${BASE}`);
    }
  }, [user, navigate, location.state]);

  const login = async () => {
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    const response = await loginUser(form.email, form.password);
    if (response.error) {
      setError(response.error);
    } else {
      navigate(location.state?.from.pathname || `${BASE}`);
    }
  };

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className=" register-form flex flex-col gap-4 sm:flex-row justify-center items-center  mx-auto p-4 rounded-lg mt-8 mb-8 w-auto h-auto">
      <div className="w-full sm:w-1/2 p-10">
        <h1 className="text-3xl font-semibold mb-4">Login</h1>
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">Demo User Credentials</h3>
            <div className="text-xs">Email: demo@planpal.com | Password: Demo123!</div>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email </label>
          <div>
            <input
              placeholder="Enter Your Email"
              value={form.email}
              onChange={updateForm("email")}
              type="text"
              name="email"
              id="email"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="password">Password </label>
            <div className="relative">
              <input
                placeholder="Enter Your Password"
                value={form.password}
                onChange={updateForm("password")}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="input input-bordered w-full"
              />

              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-2 top-3.5"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <button
          className="btn btn--hoverEffect2 m-auto mt-4"
          id="home-ripple"
          onClick={login}
        >
          Login
        </button>
      </div>
      <img
        src="https://images.pexels.com/photos/7034438/pexels-photo-7034438.jpeg"
        className="w-full sm:w-1/2 h-auto rounded-2xl"
        alt="Login"
      />
    </div>
  );
}
