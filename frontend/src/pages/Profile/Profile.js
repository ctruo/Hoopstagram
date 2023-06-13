import "./Profile.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TeamCard from "../../components/TeamCard";

function Profile() {
  const { id } = useParams();

  const [profile, setProfile] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/user/profile/${id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.user);
      });
  }, []);

  return (
    <div id="profile-container">
      <div id="profile-header">
        <img
          id="profile-pic"
          src="/default.png"
          alt="Profile pic"
          width={75}
        ></img>
        <h1 id="profile-username">{profile.username}</h1>
      </div>
      <h2>
        Favorite Teams <span id="click-msg">(click to view)</span>
      </h2>
      <div id="favorite-teams-container">
        {profile.favoriteTeams
          ? profile.favoriteTeams.map((team) => (
              <TeamCard key={team} team={team} />
            ))
          : ""}
      </div>
    </div>
  );
}

export default Profile;
