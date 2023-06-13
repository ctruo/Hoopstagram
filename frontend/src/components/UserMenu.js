import "./UserMenu.css";
import { Link } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import useOutsideComponent from "../hooks/useOutsideComponent";
import { UserContext } from "../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faUser,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

function UserMenu() {
  const { user, setUser } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideComponent(wrapperRef, setShowMenu);

  async function handleLogout() {
    const response = await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 200) {
      setUser(null);
    }
  }

  return (
    <div ref={wrapperRef} id="user-menu-container">
      <button id="user-menu-btn" onClick={() => setShowMenu(!showMenu)}>
        <img
          id="profile-pic"
          src="/default.png"
          alt="Profile pic"
          width={45}
        ></img>
      </button>
      {showMenu && (
        <ul id="user-menu">
          <li>
            <Link
              to={`/profile/${user._id}`}
              onClick={() => setShowMenu(false)}
            >
              <button>
                <FontAwesomeIcon icon={faUser} />
                View Profile
              </button>
            </Link>
          </li>
          <li>
            <Link to="/profile_settings" onClick={() => setShowMenu(false)}>
              <button>
                <FontAwesomeIcon icon={faGear} />
                Profile Settings
              </button>
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => setShowMenu(false)}>
              <button onClick={() => handleLogout()}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
export default UserMenu;
