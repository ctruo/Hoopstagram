import "./Home.css";
import Landing from "./Landing";
import FeedDescription from "./FeedDescription";
import GamesDescription from "./GamesDescription";
import TPDescription from "./TPDescription";

function Home() {
  return (
    <div>
      <section id="landing">
        <Landing />
      </section>
      <section id="feed-section">
        <FeedDescription />
      </section>
      <section id="games-section">
        <GamesDescription />
      </section>
      <section id="tp-section">
        <TPDescription />
      </section>
    </div>
  );
}

export default Home;
