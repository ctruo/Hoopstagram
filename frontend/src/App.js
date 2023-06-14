import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Feed from "./pages/Feed/Feed";
import Games from "./pages/Games/Games";
import TeamsPlayers from "./pages/TeamsPlayers/TeamsPlayers";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import ProfileInfo from "./pages/ProfileInfo/ProfileInfo";
import Post from "./pages/Post/Post";
import { UserContext } from "./contexts/UserContext";
import { useEffect, useState } from "react";
import LoggedInRoute from "./protectedRoutes/LoggedInRoute";
import LoggedOutRoute from "./protectedRoutes/LoggedOutRoute";
import GoogleAuthError from "./components/Google/GoogleAuthError";

function App() {
  const [user, setUser] = useState(null);

  //persists user on refresh
  //looks at user state
  //if it is null request session user info from server
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/user/account_info", {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      try {
        const result = await response.json();
        return result;
      } catch (error) {
        //return null if no response available
        //204 No Content because no user is signed in
        return null;
      }
    };

    if (!user) {
      fetchData()
        .then((data) => {
          //only set user if an actual user is returned
          if (data) {
            setUser(data.user);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar />

        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/view/:id" element={<Post />} />
          <Route path="/games" element={<Games />} />
          <Route path="/teams_players/:teamParam" element={<TeamsPlayers />} />

          {/* Auth Pages */}
          {/* Must not be logged in to access*/}
          <Route
            path="/signup"
            element={
              <LoggedOutRoute user={user}>
                <Signup />
              </LoggedOutRoute>
            }
          />
          <Route
            path="/login"
            element={
              <LoggedOutRoute user={user}>
                <Login />
              </LoggedOutRoute>
            }
          />
          <Route
            path="/auth/google/error"
            element={
              <LoggedOutRoute user={user}>
                <GoogleAuthError />
              </LoggedOutRoute>
            }
          />

          {/* Profile Settings Pages */}
          {/* Must be logged in to access*/}
          <Route
            path="/profile_settings"
            element={
              <LoggedInRoute user={user}>
                <ProfileInfo />
              </LoggedInRoute>
            }
          />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
