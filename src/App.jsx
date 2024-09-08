import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Cookies from "universal-cookie";
import { GroupChatScreen, Text } from "./chat";
import { useAuth } from "./context/auth-provider";
import {
  CreateGroupChat,
  GroupChat,
  GroupChatIcon,
  JoinGroupChat,
} from "./group-chat";

function App() {
  const [showText, setShowText] = useState(true);
  const { signIn, user, signUserOut } = useAuth();
  const [groupName, setGroupName] = useState("");

  if (!user) {
    return <button onClick={signIn}> Sign in </button>;
  }

  return (
    <div className="main">
      <div className="side-bar">
        <span style={{ display: "flex" }}>
          <CreateGroupChat />
          <JoinGroupChat />
        </span>
        <button onClick={() => { setShowText(true) }}>Public-ChatRoom</button>
        <GroupChatIcon setShowText={setShowText} setGroupName={setGroupName} />
        <button onClick={() => { signUserOut(); setShowText(true) }}>Sign-out</button>
      </div>

      {showText ? <Text /> : <GroupChatScreen name={groupName} />}
    </div >
  );
}

export default App;
