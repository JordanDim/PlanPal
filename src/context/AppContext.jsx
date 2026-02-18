import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../config/firebase-config";
import PropTypes from "prop-types";

export const AppContext = createContext({
  user: null,
  userData: null,
  loading: true,
  setUserData: () => {},
});

const getUsernameFromEmail = (email) => {
  return email?.split("@")[0] || null;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const usersRef = ref(db, "users");
          const userQuery = query(usersRef, orderByChild("uid"), equalTo(user.uid));
          const snapshot = await get(userQuery);

          if (isMounted.current) {
            setUser(user);

            if (snapshot.exists()) {
              const usersData = snapshot.val();
              const userKey = Object.keys(usersData)[0];
              const userData = usersData[userKey];

              setUserData({
                id: user.uid,
                handle: userKey,
                username: userKey,
                ...userData,
              });
            } else {
              console.warn("User not found in database");
              setUserData({
                id: user.uid,
                handle: null,
                username: getUsernameFromEmail(user.email),
              });
            }
          }
        } else {
          if (isMounted.current) {
            setUser(null);
            setUserData(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted.current) {
          setUser(null);
          setUserData(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  const setUserDataCallback = useCallback((newUserData) => {
    setUserData(newUserData);
  }, []);

  return (
    <AppContext.Provider
      value={{ user, userData, loading, setUserData: setUserDataCallback }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
