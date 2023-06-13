import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useContext, useState } from "react";
import GoogleButton from "../../components/Google/GoogleButton";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  let [errorMsg, setErrorMsg] = useState("");

  //set google to false if clicked on login button
  const [google, setGoogle] = useState(true);

  function validSubmission() {
    //submission must be not empty
    if (emailRef.current.value && passwordRef.current.value) {
      return true;
    } else {
      setErrorMsg("Please fill out all fields");
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    //using passport in backend instead of sending form
    if (google) return;

    if (validSubmission()) {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }),
      });
      const responseData = await response.json();

      //error
      if (responseData.errorMsg) {
        setErrorMsg(responseData.errorMsg);
      }
      //receives user info and sets user context for app
      else if (responseData.user) {
        setUser(responseData.user);
        navigate("/feed");
      }
    }
  }

  return (
    <div>
      <form id="login-form" onSubmit={(e) => handleSubmit(e)}>
        <h1>Welcome back!</h1>
        {errorMsg ? <p className="error-msg">{errorMsg}</p> : ""}
        <label htmlFor="email">Email</label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          name="email"
          autoComplete="off"
        ></input>
        <label htmlFor="text">Password</label>
        <input
          ref={passwordRef}
          type="password"
          id="password"
          name="password"
          autoComplete="off"
        ></input>
        <button
          id="login-form-btn"
          type="submit"
          onClick={() => setGoogle(false)}
        >
          Log in 🏀
        </button>
        <GoogleButton />

        <div className="existing-user-prompt">
          <p>Don't have an account? Sign up </p>
          <Link to="/signup" className="here">
            here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
