import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Auth } from "./Auth";
import Cookies from "universal-cookie";
import { Text } from "./chat";
const cookies = new Cookies();

function App() {
  const [isLogin, setIsLogin] = useState(cookies.get("token"));

  if (!isLogin) {
    return (
      <>
        <Auth setIsLogin={setIsLogin} />
      </>
    );
  }

  return (
    <>
      <div className="main">
        <div className="border"></div>
        <Text />
      </div>
    </>
  );
}

export default App;
