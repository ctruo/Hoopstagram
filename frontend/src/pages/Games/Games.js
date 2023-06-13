import { useEffect, useState } from "react";
import "./Games.css";
import GamesPlayed from "./GamesPlayed";
import InfiniteScroll from "react-infinite-scroll-component";

function Games() {
  const [index, setIndex] = useState(1);

  const [games, setGames] = useState([]);

  const [hasMore, setHasMore] = useState(true);

  //initial load of games with starting index 1
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => console.log(index), [index]);

  async function fetchData() {
    const response = await fetch("http://localhost:5000/stats/games", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ index: index }),
    });

    const responseData = await response.json();

    setGames((prevGames) => [...prevGames, ...responseData.games]);

    //no more left
    if (index === 16) {
      setHasMore(false);
    }
    //increment for next fetch
    setIndex((prevIndex) => prevIndex + 1);
  }

  return (
    <div id="games-display">
      <div id="scroll-wrapper">
        <InfiniteScroll
          dataLength={games.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4 style={{ color: "white" }}>Loading...</h4>}
          endMessage={
            <p id="endMessage">
              <b>No more games available.</b>
            </p>
          }
        >
          {games.map((game, index) => (
            <GamesPlayed key={index} game={game} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Games;
