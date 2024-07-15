import {
  collection,
  serverTimestamp,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { data, auth } from "./firebase-settings";

export const Text = () => {
  const [message, setMessage] = useState("");
  const [text, setText] = useState([]);
  const messageRef = collection(data, "texts");

  useEffect(() => {
    const queryMessages = query(messageRef, orderBy("createdAt"));
    const unSub = onSnapshot(queryMessages, (snapshot) => {
      const texts = [];
      snapshot.forEach((doc) => {
        texts.push({ ...doc.data() });
      });
      setText(texts);
    });

    return () => unSub();
  }, []);

  const handleSummit = async (e) => {
    e.preventDefault();
    if (message === "") return;
    await addDoc(messageRef, {
      text: message,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
    });
    setMessage("");
  };

  return (
    <div className="chatPage">
      <div className="chatDisplay">
        {text.map((value, index) => (
          <p key={index}>
            <b>{value.user}: </b>
            {value.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleSummit}>
        <input
          placeholder="Type here.."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button className="send-btn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/46/46076.png"
            height={"20px"}
          />
        </button>
      </form>
    </div>
  );
};
