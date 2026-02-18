import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};


export const loginUser = async (email, password) => {
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
  } catch (error) {
      console.error("Login error:", error);
      const errorMessage = 'Login failed. Please try again.';
      return { error: errorMessage };
  }
};

export const logoutUser = () => {
  return signOut(auth);
};