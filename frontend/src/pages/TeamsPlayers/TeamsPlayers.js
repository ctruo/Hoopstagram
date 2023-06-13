import "./TeamsPlayers.css";
import TeamCard from "../../components/TeamCard";
import TeamPage from "../../components/TeamPage";
import { teams } from "../../components/teamList";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TeamsPlayers() {
  const [refresh, setRefresh] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const { teamParam } = useParams();
  const navigate = useNavigate();
  let teamID = Object.keys(teams).findIndex(findTeamID);

  let imgDetails = setImgUrl(teamParam);
  let setWidth = setImgWidth(teamParam);

  function findTeamID(team) {
    const teamName = team.trim().split(" ");
    const teamNameFormatted = teamName[teamName.length - 1].toLowerCase();

    if (teamNameFormatted === teamParam) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetch("http://localhost:5000/stats/teams_players", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ teamID: teamID }),
    })
      .then((res) => res.json())
      .then((data) => {
        //players returned here
        setTeamData(data);
      });
  }, []);

  useEffect(() => {
    if (refresh) {
      navigate(0);
    }
  }, [refresh, navigate]);

  return (
    <div className="teams-players-container">
      <div id="teams">
        {Object.keys(teams).map((team) => (
          <TeamCard
            key={team}
            team={team}
            abbreviated={true}
            teamsView={true}
            loadPage={setRefresh}
          />
        ))}
      </div>
      <div className="teams-players-data">
        <div className="teams-players-details">
          <img
            src={imgDetails.imgURL}
            alt={imgDetails.altText}
            style={setWidth}
          ></img>
          <h1>{Object.keys(teams)[teamID]}</h1>
        </div>
        {teamData && <TeamPage data={teamData} />}
      </div>
    </div>
  );
}

function setImgUrl(team) {
  const imgURL = "/logos/" + team + ".png";

  const altText = team + " Logo";

  return { imgURL, altText };
}

function setImgWidth(teamFormatted) {
  let setWidth = { width: "80px" };
  //width is dependent on size of img
  if (
    teamFormatted === "spurs" ||
    teamFormatted === "heat" ||
    teamFormatted === "lakers" ||
    teamFormatted === "pistons" ||
    teamFormatted === "jazz" ||
    teamFormatted === "magic" ||
    teamFormatted === "knicks" ||
    teamFormatted === "hornets" ||
    teamFormatted === "pelicans"
  ) {
    setWidth = { width: "95px" };
  }
  return setWidth;
}

export default TeamsPlayers;
