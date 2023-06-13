import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import UserMenu from "../components/UserMenu";

function Navbar() {
  const { user } = useContext(UserContext);

  return (
    <nav>
      <Link id="logo" to="/">
        <img src="/logo.png" alt="Hoopstagram logo"></img>
      </Link>

      <div id="container">
        <ul id="nav-links">
          <li>
            <Link to="/feed">Feed</Link>
          </li>
          <li>
            <Link to="/games">Games</Link>
          </li>

          <li>
            <Link to="/teams_players/hawks">Teams & Players</Link>
          </li>
        </ul>

        {user ? (
          <UserMenu />
        ) : (
          <div id="account-btns">
            <Link to="/signup">
              <button>Sign-up</button>
            </Link>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
