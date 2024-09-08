import { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, data } from "../firebase-settings";

export const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = (props) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user == null) return;
      const newUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
      };
      setUser(newUser);
    });

    return unsub;
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      const userRef = doc(data, "users", res.user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) return;

      await setDoc(userRef, {
        id: res.user.uid,
        name: res.user.displayName,
        email: res.user.email,
        image: res.user.photoURL,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <AuthContext.Provider value={{ signIn, user, signUserOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};
