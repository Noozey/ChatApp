import {
  collection,
  serverTimestamp,
  doc,
  addDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { data } from "./firebase-settings";
import { useAuth } from "./context/auth-provider";

export const Text = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [text, setText] = useState([]);

  const messageRef = collection(data, "texts");
  const fechMessages = () => {
    try {
      const queryMessages = query(messageRef, orderBy("createdAt"));
      const unSub = onSnapshot(queryMessages, (snapshot) => {
        const texts = [];
        snapshot.forEach((doc) => {
          texts.push({ ...doc.data() });
        });
        setText(texts);
      });

      return unSub;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unSub = fechMessages();
    return unSub;
  }, []);

  const handleSummit = async (e) => {
    e.preventDefault();
    if (message === "") return;
    await addDoc(messageRef, {
      text: message,
      createdAt: serverTimestamp(),
      userId: user.id,
      user: doc(data, "users", user.id)
    });
    setMessage("");
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className="chat-box">
      <div className="chat-nav-bar"></div>
      <div className="chatPage">
        <div className="chatDisplay" ref={scrollRef}>
          {text.map((value, index) => (
            <ChatBubble text={value} value={index} />
          ))}
        </div>
        <form onSubmit={handleSummit} className="chat-form">
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
    </div>
  );
};

const ChatBubble = ({ text }) => {
  const { user } = useAuth();
  const [sender, setSender] = useState();

  const isCurrentUser = text.userId === user.id;

  const fetchSender = async (userId) => {
    try {
      if (isCurrentUser) {
        setSender(user);
        return;
      }
      const userRef = doc(data, "users", text.userId);
      const userData = await getDoc(userRef).then((doc) => doc.data());
      setSender(userData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSender(text.userId);
  }, [text]);

  if (!sender) return null;
  return (
    <div
      class ="chat-bubble"
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <img
          src={sender?.image}
          alt={sender?.name}
          style={{
            height: 20,
            aspectRatio: 1,
            borderRadius: "50%",
          }}
        />
        <b>{isCurrentUser ? "Me" : sender?.name}: </b>
        {JSON.stringify(text.text)}
      </div>
    </div>
  );
};

export const GroupChatScreen = (Props) => {
  const { name } = Props;
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [text, setText] = useState([]);

  const messageRef = collection(data, name);
  const fechMessages = () => {
    try {
      const queryMessages = query(messageRef, orderBy("createdAt"));
      const unSub = onSnapshot(queryMessages, (snapshot) => {
        const texts = [];
        snapshot.forEach((doc) => {
          texts.push({ ...doc.data() });
        });
        setText(texts);
      });

      return unSub;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unSub = fechMessages();
    return unSub;
  }, []);

  const handleSummit = async (e) => {
    e.preventDefault();
    if (message === "") return;
    await addDoc(messageRef, {
      text: message,
      createdAt: serverTimestamp(),
      userId: user.id,
      user: doc(data, "users", user.id)
    });
    setMessage("");
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className="chat-box">
      <div className="chat-nav-bar"></div>
      <div className="chatPage">
        <div className="chatDisplay" ref={scrollRef}>
          {text.map((value, index) => (
            <ChatBubble text={value} value={index} />
          ))}
        </div>
        <form onSubmit={handleSummit} className="chat-form">
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
    </div>
  );
};
