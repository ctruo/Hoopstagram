const express = require("express");
const router = express.Router();
const roster = require("../data/Roster.json");
const games = require("../data/Games.json");

//POST Methods
router.post("/games", async (req, res) => {
  let startingIndex = 5 * (req.body.index - 1);
  let endingIndex = startingIndex + 5;

  let gamesArray = [];
  for (i = startingIndex; i < endingIndex; i++) {
    gamesArray.push(games.games[i]);
  }
  res.send({ games: gamesArray });
});

router.post("/teams_players", (req, res) => {
  let teamPlayers = roster.players.filter(
    (player) => player.tid === req.body.teamID
  );

  res.send({ roster: teamPlayers });
});

module.exports = router;
