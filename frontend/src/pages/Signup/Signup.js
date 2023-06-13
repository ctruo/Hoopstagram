import "./Signup.css";
import { Link } from "react-router-dom";
import { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import PickTeams from "../../components/PickTeams";
import GoogleButton from "../../components/Google/GoogleButton";

function Signup() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser } = useContext(UserContext);

  const [errorMsg, setErrorMsg] = useState("");

  //bool state used to show PickTeams on successful signup
  const [showPickTeams, setShowPickTeams] = useState(false);

  const [donePickingTeams, setDonePickingTeams] = useState(false);

  const [tempUserData, setTempUserData] = useState();

  //set google to false if clicked on signup button
  const [google, setGoogle] = useState(true);

  function validSubmission() {
    //submission must be not empty
    if (
      usernameRef.current.value &&
      emailRef.current.value &&
      passwordRef.current.value
    ) {
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
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: usernameRef.current.value,
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
        setShowPickTeams(true);
        //store temp user data until done picking teams
        setTempUserData(responseData.user);
      }
    }
  }

  //when done picking teams, set the global context user
  useEffect(() => {
    if (donePickingTeams) {
      setUser(tempUserData);
    }
  }, [donePickingTeams, tempUserData, setUser]);

  return (
    <div>
      {showPickTeams ? (
        <PickTeams
          doneSelecting={setDonePickingTeams}
          initial={true}
          buttonText={"Skip"}
        />
      ) : (
        ""
      )}
      <form id="signup-form" onSubmit={(e) => handleSubmit(e)}>
        <h1>Welcome!</h1>
        {errorMsg ? <p className="error-msg">{errorMsg}</p> : ""}
        <label htmlFor="username">Username</label>
        <input
          ref={usernameRef}
          type="text"
          id="username"
          name="username"
          autoComplete="off"
        ></input>

        <label htmlFor="email">Email</label>

        <input ref={emailRef} type="email" id="email" name="email"></input>
        <label htmlFor="text">Password</label>
        <input
          ref={passwordRef}
          type="password"
          id="password"
          name="password"
          autoComplete="off"
        ></input>
        <button
          id="signup-form-btn"
          type="submit"
          onClick={() => setGoogle(false)}
        >
          Sign up 🚀
        </button>
        <GoogleButton />
        <div className="existing-user-prompt">
          <p>Already have an account? Login </p>
          <Link to="/login" className="here">
            here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
