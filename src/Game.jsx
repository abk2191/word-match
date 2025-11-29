import { useState, useEffect, useRef } from "react";

function Game({ setGameStarted, scoreStorage, setScoreStorage, firstScore }) {
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
  const [showGameDisplay, setShowGameDisplay] = useState(true);
  const [showScores, setShowScores] = useState(false);
  const [displayScores, setDisplayScores] = useState(false);

  const intervalRef = useRef(null);
  const gameTimerRef = useRef(null);
  const scoreRef = useRef(0);
  const endedRef = useRef(false);

  const handleDisplayScores = () => {
    setDisplayScores(false);
    setShowScores((prev) => !prev);
  };

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
          if (!gameActive) return;
          setShowFeedback(false);
          setTimeout(() => {
            // ⛔ STOP BEFORE GETTING NEW WORD
            if (!gameActive) return;
            setFeedback(null);
            getWord();
            // ⛔ DO NOT START A NEW INTERVAL IF GAME ENDED
            if (!gameActive) return;
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
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
      setFeedback("👍");
    } else {
      setScore((prev) => {
        const newScore = Math.max(0, prev - 1);
        scoreRef.current = newScore;
        return newScore;
      });
      setFeedback("👎");
    }

    setShowFeedback(true);
    setAnswered(true);

    // Clear feedback after 1 second and get new word
    setTimeout(() => {
      if (!gameActive) return;
      setShowFeedback(false);
      setTimeout(() => {
        if (!gameActive) return;
        setFeedback(null);
        getWord();
        // Reset the interval AFTER getting the new word
        if (!gameActive) return;
        resetInterval();
      }, 100);
    }, 1000);
  }

  // Start the 60-second game timer
  const startGameTimer = () => {
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          setShowGameDisplay(false);
          setTimeout(() => {
            endGame(); // <-- safe now
          }, 0);

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // End the game
  const endGame = () => {
    if (endedRef.current) return; // <- guard
    endedRef.current = true; // <- lock it

    setScoreStorage((prev) => [...prev, scoreRef.current]);
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
    endedRef.current = false;
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setFeedback(null);
    setShowFeedback(false);
    setAnswered(false);
    setShowGameDisplay(true);

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

  const showScore = () => {
    setTimeout(() => {
      setShowScores((prev) => !prev);
      setDisplayScores(true);
    }, 150);
  };

  return (
    <>
      <div className="game-container">
        <div className="game-area">
          <div className="game-area-parts-word">
            {/* Timer Display */}
            {showGameDisplay && (
              <div className="game-display">
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
              </div>
            )}

            {/* Game Over Screen */}
            {!gameActive && (
              <div className="game-over">
                <button className="pushable" onClick={showScore}>
                  <span className="shadow"></span>
                  <span className="edge"></span>
                  <span className="front"> Scores </span>
                </button>

                {displayScores && (
                  <div className="backdrop" onClick={handleDisplayScores}>
                    {showScores && (
                      <div className="scores-div">
                        {scoreStorage.length > 0 &&
                          (() => {
                            const highestScore = Math.max(...scoreStorage);

                            return (
                              <div className="score-history">
                                <h3
                                  style={{
                                    color: "blueviolet",
                                  }}
                                >
                                  SCORES:
                                </h3>
                                <ul>
                                  {scoreStorage.map((storedScore, index) => (
                                    <div className="list-div">
                                      <li
                                        key={index}
                                        style={{
                                          color:
                                            storedScore === highestScore
                                              ? "blue"
                                              : "lightgreen",
                                        }}
                                      >
                                        Game {index + 1}: {storedScore}
                                      </li>
                                    </div>
                                  ))}
                                </ul>
                              </div>
                            );
                          })()}
                      </div>
                    )}
                  </div>
                )}
                <h2 style={{ color: "#333", marginBottom: "20px" }}>
                  Game Over!
                </h2>
                <p style={{ fontSize: "24px", marginBottom: "30px" }}>
                  Final Score: {scoreRef.current}
                </p>
                <div className="game-btns">
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
                  <button
                    className="pushable"
                    onClick={() => setGameStarted(false)}
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
                      End Game
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Buttons - only show when game is active */}
          {gameActive && (
            <div className="game-area-parts-button">
              <div className="yes-and-no-btn-div">
                <button
                  className="pushable"
                  onClick={() => handleAnswer("yes")}
                >
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
              <div className="end-game-btn-div">
                <button
                  className="pushable"
                  onClick={() => setGameStarted(false)}
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
                    End Game
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Game;
