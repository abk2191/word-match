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

  const intervalRef = useRef(null);

  function getWord() {
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
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      console.log("Interval fired - answered:", answered);
      if (!answered) {
        // User failed to answer
        console.log("No answer detected - penalizing");
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

  useEffect(() => {
    getWord(); // Get initial word
    resetInterval(); // Start the interval initially

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="game-container">
        <div className="game-area">
          <div className="game-area-parts-word">
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
          <div className="game-area-parts-button">
            <button className="pushable" onClick={() => handleAnswer("yes")}>
              <span class="shadow"></span>
              <span class="edge"></span>
              <span class="front"> Yes </span>
            </button>
            <button className="pushable" onClick={() => handleAnswer("no")}>
              <span class="shadow"></span>
              <span class="edge"></span>
              <span class="front"> No </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Game;
