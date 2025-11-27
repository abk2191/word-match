import { useState, useEffect, useRef } from "react";

function Game() {
  const colors = [
    { name: "RED", hex: "#FF0000" },
    { name: "BLUE", hex: "#0000FF" },
    { name: "GREEN", hex: "#00FF00" },
    { name: "YELLOW", hex: "#FFFF00" },
    { name: "ORANGE", hex: "#FFA500" },
    { name: "PURPLE", hex: "#800080" },
    { name: "PINK", hex: "#FFC0CB" },
    { name: "BROWN", hex: "#A52A2A" },
    { name: "BLACK", hex: "#000000" },
    { name: "WHITE", hex: "#FFFFFF" },
    { name: "GRAY", hex: "#808080" },
    { name: "CYAN", hex: "#00FFFF" },
    { name: "MAGENTA", hex: "#FF00FF" },
    { name: "LIME", hex: "#32CD32" },
    { name: "NAVY", hex: "#000080" },
  ];

  const [word, setWord] = useState("");
  const [hex, setHex] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);

  const intervalRef = useRef(null);
  const gameTimerRef = useRef(null);

  function getWord() {
    if (!gameActive) return;

    const shouldMatch = Math.random() < 0.4;
    const i = Math.floor(Math.random() * colors.length);
    const word = colors[i].name;
    setWord(word);
    let hex;

    if (shouldMatch) {
      hex = colors[i].hex;
    } else {
      let j;
      do {
        j = Math.floor(Math.random() * colors.length);
      } while (j === i);
      hex = colors[j].hex;
    }

    setHex(hex);
    setAnswered(false);
  }

  // Function to reset and restart the interval
  const resetInterval = () => {
    if (!gameActive) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      if (!answered && gameActive) {
        // User failed to answer
        setScore((prev) => Math.max(0, prev - 1));
        setFeedback("👎");
        setShowFeedback(true);
        setAnswered(true);

        // Wait a moment to show feedback, then get new word
        setTimeout(() => {
          setShowFeedback(false);
          setTimeout(() => {
            setFeedback(null);
            getWord();
            resetInterval(); // Restart interval for the new word
          }, 100);
        }, 1000);
      }
    }, 5000);
  };

  function handleAnswer(answer) {
    if (!gameActive) return;

    // Clear the current interval immediately when user answers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const match = colors.some((c) => c.name === word && c.hex === hex);

    const isCorrect =
      (answer === "yes" && match) || (answer === "no" && !match);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("👍");
    } else {
      setScore((prevScore) => Math.max(0, prevScore - 1));
      setFeedback("👎");
    }

    setShowFeedback(true);
    setAnswered(true);

    // Clear feedback after 1 second and get new word
    setTimeout(() => {
      setShowFeedback(false);
      setTimeout(() => {
        setFeedback(null);
        getWord();
        // Reset the interval AFTER getting the new word
        resetInterval();
      }, 100);
    }, 1000);
  }

  // Start the 60-second game timer
  const startGameTimer = () => {
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // End the game
  const endGame = () => {
    setGameActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
  };

  // Restart the game
  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setFeedback(null);
    setShowFeedback(false);
    setAnswered(false);

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }

    // Start new game
    getWord();
    resetInterval();
    startGameTimer();
  };

  useEffect(() => {
    getWord(); // Get initial word
    resetInterval(); // Start the interval initially
    startGameTimer(); // Start the 60-second timer

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="game-container">
        <div className="game-area">
          <div className="game-area-parts-word">
            {/* Timer Display */}
            <div className="timer-div">
              <p
                style={{
                  fontSize: "20px",
                  margin: "10px 0",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "bold",
                  color: timeLeft <= 10 ? "red" : "blue",
                }}
              >
                Time: {timeLeft}s
              </p>
            </div>

            <h1 style={{ color: hex }}>{word}</h1>
            <div className="feedback-div">
              <p
                style={{
                  fontSize: "54px",
                  margin: "20px 0",
                }}
                className={showFeedback ? "feedback-animation" : ""}
              >
                {feedback}
              </p>
            </div>
            <div className="score-div">
              <p
                style={{
                  fontSize: "20px",
                  margin: "10px 0",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                Score: {score}
              </p>
            </div>

            {/* Game Over Screen */}
            {!gameActive && (
              <div className="game-over">
                <h2 style={{ color: "#333", marginBottom: "20px" }}>
                  Game Over!
                </h2>
                <p style={{ fontSize: "24px", marginBottom: "30px" }}>
                  Final Score: {score}
                </p>
                <button
                  className="pushable"
                  onClick={restartGame}
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
                    Play Again
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Buttons - only show when game is active */}
          {gameActive && (
            <div className="game-area-parts-button">
              <button className="pushable" onClick={() => handleAnswer("yes")}>
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front"> Yes </span>
              </button>
              <button className="pushable" onClick={() => handleAnswer("no")}>
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front"> No </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Game;
