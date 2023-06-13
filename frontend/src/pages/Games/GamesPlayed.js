import "./GamesPlayed.css";

function GamesPlayed(props) {
  const { game } = props;

  const dateFormatted = new Date(game.date).toLocaleString();

  let homeImg = setImgUrl(game.home_team.name);
  let awayImg = setImgUrl(game.visitor_team.name);

  let homeWidth = setImgWidth(game.home_team.name.toLowerCase());
  let awayWidth = setImgWidth(game.visitor_team.name.toLowerCase());

  return (
    <div className="gameDivision">
      <div className="team-type">
        <p>HOME</p>
        <p>{dateFormatted}</p>
        <p>AWAY</p>
      </div>

      <div className="game-details">
        <div className="home-team">
          <p>{game.home_team.abbreviation}</p>
          <img
            src={homeImg.imgURL}
            alt={homeImg.altText}
            style={homeWidth}
          ></img>
        </div>
        <div className="score">
          <h3>{game.home_team_score}</h3> <h3>-</h3>{" "}
          <h3>{game.visitor_team_score}</h3>
        </div>
        <div className="away-team">
          <img
            src={awayImg.imgURL}
            alt={awayImg.altText}
            style={awayWidth}
          ></img>
          <p>{game.visitor_team.abbreviation}</p>
        </div>
      </div>
    </div>
  );
}

function setImgUrl(team) {
  const imgURL = "/logos/" + team.toLowerCase() + ".png";
  const altText = team + " Logo";

  return { imgURL, altText };
}

function setImgWidth(teamFormatted) {
  let setWidth = { width: "45px" };
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
    setWidth = { width: "60px" };
  }
  return setWidth;
}

export default GamesPlayed;
