import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  query,
  onSnapshot,
  collection,
  updateDoc,
  addDoc
} from "firebase/firestore";
import { auth, data } from "./firebase-settings";
import bcrypt from "bcryptjs";
import { useAuth } from "./context/auth-provider";
import { Text } from "./chat";

export const CreateGroupChat = () => {
  const { user } = useAuth();
  const [createGroupState, setCreateGroupState] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");

  const handleSummit = async (e) => {
    e.preventDefault();
    if (groupName === "") return;
    if (groupPassword === "") return;
    const id = groupName;
    const grouChatRef = doc(data, "groups", id);

    const groupData = {
      id,
      name: groupName,
      passwordHash: await bcrypt.hash(groupPassword, 10),
      users: [user.id],
    };

    try {
      await setDoc(grouChatRef, groupData);
    } catch (error) {
      console.log(error);
    }

    setCreateGroupState(false);
  };

  return (
    <div className="groupchat">
      <button
        onClick={() => {
          createGroupState
            ? setCreateGroupState(false)
            : setCreateGroupState(true);
        }}
      >
        Create Group
      </button>
      {createGroupState ? (
        <div>
          <form onSubmit={handleSummit} className="group-chat-form">
            <span>
              <label>Group-Name :</label>
              <input
                type="text"
                placeholder="Group name"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                name="name"
              ></input>
            </span>
            <span>
              <label>Set-Password :</label>
              <input
                type="text"
                placeholder="Password"
                onChange={(e) => setGroupPassword(e.target.value)}
                value={groupPassword}
                name="password"
              ></input>
            </span>
            <span>
              <button>summit</button>
            </span>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export const GroupChatIcon = (Props) => {
  const [names, setNames] = useState([]);
  const { user } = useAuth();
  const { setShowText, setGroupName } = Props;

  const fetchGroupName = () => {
    try {
      const groupChatRef = collection(data, "groups");
      const queryMessages = query(groupChatRef);
      const unSub = onSnapshot(queryMessages, (snapshot) => {
        const nameArray = [];
        snapshot.forEach((doc) => {
          nameArray.push({ ...doc.data() });
        });
        setNames(nameArray);
      });

      return unSub;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unSub = fetchGroupName();
    return unSub;
  }, []);


  return (
    <div>
      {names.map((value, outerIndex) => {
        return value.users.map((usersId, innerIndex) => {
          return usersId === user.id ? (
            <p onClick={() => { setShowText(false); setGroupName(value.name) }} key={`user-${outerIndex}-${innerIndex}`}>
              {value.name}
            </p>
          ) : null;
        });
      })}
    </div>
  );
};

export const JoinGroupChat = () => {
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const [joinChat, setJoinChat] = useState(false);
  const [names, setNames] = useState([]);
  const { user } = useAuth();

  const fetchGroupName = () => {
    try {
      const groupChatRef = collection(data, "groups");
      const queryMessages = query(groupChatRef);
      const unSub = onSnapshot(queryMessages, (snapshot) => {
        const nameArray = [];
        snapshot.forEach((doc) => {
          nameArray.push({ ...doc.data() });
        });
        setNames(nameArray);
      });

      return unSub;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unSub = fetchGroupName();
    return unSub;
  }, []);

  const handleSummit = async (e) => {
    e.preventDefault();
    const group = names.find((value) => value.name === groupName);
    setJoinChat(false);
    if (!group) {
      console.log("Group not found");
      return;
    }

    const passwordMatch = await bcrypt.compare(
      groupPassword,
      group.passwordHash
    );
    if (passwordMatch) {
      if (!group.users.includes(user.id)) {
        try {
          const groupRef = doc(data, "groups", group.id);

          await updateDoc(groupRef, {
            users: [...group.users, user.id],
          });
          console.log("User added to group successfully");
        } catch (error) {
          console.error("Error updating group:", error);
        }
      } else {
        return;
      }
    } else {
      console.log("Invalid password");
    }
  };
  return (
    <div>
      <button
        onClick={() => {
          joinChat ? setJoinChat(false) : setJoinChat(true);
        }}
      >
        Join-Chat
      </button>
      {joinChat ? (
        <div>
          <form onSubmit={handleSummit} className="group-chat-form">
            <span>
              <label>Group-Name :</label>
              <input
                type="text"
                placeholder="Group name"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                name="name"
              ></input>
            </span>
            <span>
              <label>Set-Password :</label>
              <input
                type="text"
                placeholder="Password"
                onChange={(e) => setGroupPassword(e.target.value)}
                value={groupPassword}
                name="password"
              ></input>
            </span>
            <span>
              <button>summit</button>
            </span>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export const GroupChat = () => {
  const { user } = useAuth();
  const handleSummit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Text />
    </>
  );
};
