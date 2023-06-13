import "./ProfileInfo.css";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import ProfileInput from "./ProfileInput";
import PickTeams from "../../components/PickTeams";

function ProfileInfo() {
  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showPickTeams, setShowPickTeams] = useState(false);

  const [donePickingTeams, setDonePickingTeams] = useState(false);

  const fields = ["username", "email", "password"];

  //sending corresponding setter in props
  function correspondingSetter(field) {
    if (field === "username") {
      return setUsername;
    } else if (field === "email") {
      return setEmail;
    } else {
      return setPassword;
    }
  }

  //sending corresponding setter in props
  function correspondingState(field) {
    if (field === "username") {
      return username;
    } else if (field === "email") {
      return email;
    } else {
      return password;
    }
  }

  function editButton(e) {
    e.preventDefault();
    setDonePickingTeams(false);
    setShowPickTeams(true);
  }

  async function updateInfo(e) {
    e.preventDefault();
    let newInfo = {};
    setErrorMsg();
    setSuccessMsg();

    let emailRE = /^\S+@\S+$/;
    if (!emailRE.test(email)) {
      return setErrorMsg("Incorrect email format");
    }

    if (username !== user.username) {
      newInfo.username = username;
    }

    if (email !== user.email) {
      newInfo.email = email;
    }

    if (password) {
      newInfo.password = password;
    }

    if (Object.keys(newInfo).length > 0) {
      const response = await fetch("http://localhost:5000/user/update_info", {
        method: "PUT",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          info: newInfo,
        }),
      });

      const responseData = await response.json();

      //error
      if (responseData.errorMsg) {
        setErrorMsg(responseData.errorMsg);
      } else {
        setUser(responseData.user);
        setPassword("");
        setSuccessMsg("Updated successfully!");
      }
    } else {
      setErrorMsg("No changes were made");
    }
  }

  useEffect(() => {
    if (donePickingTeams) {
      setShowPickTeams(false);
    }
  }, [donePickingTeams]);

  return (
    <div>
      {showPickTeams ? (
        <PickTeams
          doneSelecting={setDonePickingTeams}
          initial={false}
          username={user.username}
          buttonText={"Cancel"}
        />
      ) : (
        ""
      )}
      <form id="profile-info-form">
        <h1>Profile Settings</h1>
        {errorMsg ? <p className="error-msg">{errorMsg}</p> : ""}
        {successMsg ? <p className="success-msg">{successMsg}</p> : ""}
        {fields.map((field) => (
          <ProfileInput
            key={field}
            type={field}
            state={correspondingState(field)}
            setter={correspondingSetter(field)}
          />
        ))}

        <div id="fav-teams-container">
          <p>Favorite Teams:</p>
          <button onClick={(e) => editButton(e)}>Edit</button>
        </div>

        <button id="update-btn" onClick={(e) => updateInfo(e)}>
          Update Info 💫
        </button>
      </form>
    </div>
  );
}

export default ProfileInfo;
