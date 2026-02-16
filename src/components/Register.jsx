import { useContext, useState, useEffect } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle } from "../services/users.service";
import { validateRegister } from "../common/helpers/validationHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "daisyui/dist/full.css"; // Ensure you have daisyUI installed and imported
import RegisterButton from "./AnimatedButton/RegisterButton";
import { BASE } from "../common/constants";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    avatar: "",
    password: "",
    confirmPassword: "",
    address: "",
    userName: "",
  });
  const [errors, setErrors] = useState({});
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(`${BASE}`);
    }
  }, [user, navigate]);

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const register = async () => {
    try {
      const validationErrors = await validateRegister(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const credential = await registerUser(form.email, form.password);
      const userData = {
        uid: credential.user.uid,
        email: credential.user.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        address: form.address || "No address provided",
        avatar:
          "https://1k9gq2zpdb.ucarecd.net/bbc51f44-ccbf-4a92-a74d-8d40e43d652a/defaultprofile.png",
        handle: form.userName,
        isBlocked: false,
        role: "User",
      };

      try {
        await createUserHandle(userData);
        navigate(`${BASE}`);
      } catch (error) {
        console.error("Error creating user handle:", error);
        setErrors({
          server: "Failed to create user handle. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ server: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="register-form flex flex-col gap-4 sm:flex-row justify-center items-center mx-auto p-4 rounded-lg mt-8 mb-8 w-auto h-auto">
      <img
        src="https://images.pexels.com/photos/7034449/pexels-photo-7034449.jpeg"
        className="w-full sm:w-1/2 h-auto rounded-2xl"
        alt="Register"
      />
      <div className="w-full sm:w-1/2 p-10">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">Demo User Available</h3>
            <div className="text-xs">Use demo@planpal.com / Demo123! to <span className="font-semibold">login</span> and try the app</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="form-control w-full">
            <label htmlFor="userName" className="label">
              <span className="label-text">
                Username <span className="text-red-500">*</span>:
              </span>
            </label>
            <input
              placeholder="Enter Your Username"
              value={form.userName}
              onChange={updateForm("userName")}
              type="text"
              id="userName"
              className={`input input-bordered w-full ${
                errors.userName ? "input-error" : ""
              }`}
            />
            {errors.userName && (
              <span className="text-red-500 text-sm">{errors.userName}</span>
            )}
          </div>
          <div className="form-control w-full">
            <label htmlFor="email" className="label">
              <span className="label-text">
                Email <span className="text-red-500">*</span>:
              </span>
            </label>
            <input
              placeholder="Enter Your Email"
              value={form.email}
              onChange={updateForm("email")}
              type="email"
              id="email"
              className={`input input-bordered w-full ${
                errors.email ? "input-error" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div className="form-control w-full">
            <label htmlFor="firstName" className="label">
              <span className="label-text">
                First Name <span className="text-red-500">*</span>:
              </span>
            </label>
            <input
              placeholder="Enter Your First Name"
              value={form.firstName}
              onChange={updateForm("firstName")}
              type="text"
              id="firstName"
              className={`input input-bordered w-full ${
                errors.firstName ? "input-error" : ""
              }`}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">{errors.firstName}</span>
            )}
          </div>
          <div className="form-control w-full">
            <label htmlFor="lastName" className="label">
              <span className="label-text">
                Last Name <span className="text-red-500">*</span>:
              </span>
            </label>
            <input
              placeholder="Enter Your Last Name"
              value={form.lastName}
              onChange={updateForm("lastName")}
              type="text"
              id="lastName"
              className={`input input-bordered w-full ${
                errors.lastName ? "input-error" : ""
              }`}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">{errors.lastName}</span>
            )}
          </div>
          <div className="form-control w-full">
            <label htmlFor="password" className="label">
              <span className="label-text">
                Password <span className="text-red-500">*</span>:
              </span>
            </label>
            <div className="relative">
              <input
                placeholder="Enter Your Password"
                value={form.password}
                onChange={updateForm("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-2 top-2"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>
          </div>
          <div className="form-control w-full">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text">
                Confirm Password <span className="text-red-500">*</span>:
              </span>
            </label>
            <div className="relative">
              <input
                placeholder="Confirm Your Password"
                value={form.confirmPassword}
                onChange={updateForm("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`input input-bordered w-full ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute right-2 top-2"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>
          <div className="form-control w-full">
            <label htmlFor="phoneNumber" className="label">
              <span className="label-text">
                Phone Number <span className="text-red-500">*</span>:
              </span>
            </label>
            <input
              placeholder="Enter Your Phone Number"
              value={form.phoneNumber}
              onChange={updateForm("phoneNumber")}
              type="text"
              id="phoneNumber"
              className={`input input-bordered w-full ${
                errors.phoneNumber ? "input-error" : ""
              }`}
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
          <div className="form-control w-full">
            <label htmlFor="address" className="label">
              <span className="label-text">
                Address <span className="text-red-500">*</span>:
              </span>
            </label>
            <input
              placeholder="Enter Your Address"
              value={form.address}
              onChange={updateForm("address")}
              type="text"
              id="address"
              className={`input input-bordered w-full ${
                errors.address ? "input-error" : ""
              }`}
            />
            {errors.address && (
              <span className="text-red-500 text-sm">{errors.address}</span>
            )}
          </div>
          <RegisterButton onClick={register} />
        </div>
      </div>
    </div>
  );
}
