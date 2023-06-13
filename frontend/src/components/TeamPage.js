import React, { useState, useEffect } from "react";
import "./TeamPage.css";

const TeamPage = ({ data }) => {
  const [flippedCards, setFlippedCards] = useState([]);

  useEffect(() => {
    setFlippedCards([]); // Reset flippedCards whenever data changes
  }, [data]);

  if (!data) {
    return null; // Return null or a loading indicator when data is null
  }

  const handleCardClick = (event, index) => {
    event.stopPropagation();
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter((card) => card !== index));
    } else {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const convertToFeetAndInches = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet} ft ${remainingInches} in`;
  };

  return (
    <div className="team-page">
      <div className="team-page-info">
        <img src=""></img>
      </div>
      <div className="roster">
        <div className="team-roster">
          {data.roster.map((player, index) => (
            <div
              key={player.tid}
              className={`player-box ${
                flippedCards.includes(index) ? "flipped" : ""
              }`}
            >
              <div
                className="card"
                onClick={(event) => handleCardClick(event, index)}
              >
                <div className="card-inner">
                  <div className="front">
                    <img
                      className="player-images"
                      src={player.playerIMG}
                      alt="Profile"
                    />
                    <div className="player-text">
                      <span className="player-name">{player.name}</span>
                      <br />
                      <span className="player-position">
                        Position: {player.position}
                      </span>
                    </div>
                  </div>
                  <div className="back">
                    <img
                      className="player-images-back"
                      src={player.playerIMG}
                      alt="Profile"
                    />
                    <div className="player-details-back">
                      <span className="player-name-back">{player.name}</span>
                      <div className="player-stats-back">
                        <span className="player-jersey-back">
                          Jersey Number: {player.jerseyNumber}
                        </span>
                        <span className="player-weight-back">
                          Weight: {player.weight} lbs
                        </span>
                        <span className="player-height-back">
                          Height: {convertToFeetAndInches(player.height)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
