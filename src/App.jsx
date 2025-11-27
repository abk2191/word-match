import { useState } from "react";
import Game from "./Game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <>
      <div>
        {!gameStarted ? (
          <div className="start-game-div">
            <h1>Does the color match the word?</h1>
            <button
              className="pushable"
              onClick={handleStartGame}
              style={{ marginTop: "10px" }}
            >
              <span className="shadow"></span>
              <span
                className="edge"
                style={{
                  background:
                    "linear-gradient(to right, hsl(120, 39%, 39%) 0%, hsl(120, 39%, 49%) 8%, hsl(120, 39%, 39%) 92%, hsl(120, 39%, 29%) 100%)",
                }}
              ></span>
              <span
                className="front"
                style={{ background: "hsl(120, 53%, 58%)" }}
              >
                Start Game
              </span>
            </button>
          </div>
        ) : (
          <Game setGameStarted={setGameStarted} />
        )}
      </div>
    </>
  );
}

export default App;
