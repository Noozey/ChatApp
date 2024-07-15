import { auth, provider } from "./firebase-settings";
import { signInWithPopup } from "firebase/auth";
import { data } from "./firebase-settings";
import Cookies from "universal-cookie";
import { collection, addDoc } from "firebase/firestore";
const cookies = new Cookies();

export const Auth = (props) => {
  const loginDataUser = collection(data, "users");
  const { setIsLogin } = props;
  const signInWithGoogle = async () => {
    const output = await signInWithPopup(auth, provider);
    cookies.set("token", output.user.refreshToken);
    console.log(output);
    await addDoc(loginDataUser, {
      id: output.user.reloadUserInfo.localId,
      email: output.user.email,
    });
    setIsLogin(true);
  };
  return (
    <div className="auth">
      <p>Sign In</p>
      <button onClick={signInWithGoogle} className="sing-in-btn">
        <img
          src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png"
          height={"25px"}
        />
      </button>
    </div>
  );
};
