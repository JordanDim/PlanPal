import { getAuth } from "firebase/auth";
import { themeChecker } from "../helpers/toast";

const DEMO_USER_EMAIL = "demo@planpal.com";

/**
 * Checks if the current authenticated user is the demo user
 * @returns {boolean} True if current user is demo user
 */
export const isDemoUser = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  return currentUser?.email?.toLowerCase() === DEMO_USER_EMAIL.toLowerCase();
};

/**
 * Throws an error if the current user is the demo user
 * Use this to restrict database write operations for the demo account
 * @param {string} action - Description of the action being attempted
 * @throws {Error} If current user is demo user
 */
export const restrictDemoUser = (action = "perform this action") => {
  if (isDemoUser()) {
    const message = `Demo user cannot ${action}. Please sign up for a full account to access all features.`;
    themeChecker(message);
    const error = new Error(message);
    error.isDemoUserRestriction = true;
    throw error;
  }
};
