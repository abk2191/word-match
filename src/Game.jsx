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
    { name: "MAROON", hex: "#800000" },
    { name: "NAVY", hex: "#000080" },
    { name: "TEAL", hex: "#008080" },
    { name: "OLIVE", hex: "#808000" },
    { name: "CORAL", hex: "#FF7F50" },
    { name: "GOLD", hex: "#FFD700" },

    { name: "INDIGO", hex: "#4B0082" },
    { name: "VIOLET", hex: "#EE82EE" },
    { name: "BEIGE", hex: "#F5F5DC" },
    { name: "TAN", hex: "#D2B48C" },
    { name: "CHOCOLATE", hex: "#D2691E" },
    { name: "CRIMSON", hex: "#DC143C" },
    { name: "SALMON", hex: "#FA8072" },
    { name: "KHAKI", hex: "#F0E68C" },
    { name: "TURQUOISE", hex: "#40E0D0" },
    { name: "SKYBLUE", hex: "#87CEEB" },

    { name: "STEELBLUE", hex: "#4682B4" },
    { name: "ROYALBLUE", hex: "#4169E1" },
    { name: "DEEPPINK", hex: "#FF1493" },
    { name: "HOTPINK", hex: "#FF69B4" },
    { name: "TOMATO", hex: "#FF6347" },
    { name: "FIREBRICK", hex: "#B22222" },
    { name: "SEAGREEN", hex: "#2E8B57" },
    { name: "FORESTGREEN", hex: "#228B22" },
    { name: "SPRINGGREEN", hex: "#00FF7F" },
    { name: "AQUAMARINE", hex: "#7FFFD4" },

    { name: "LAVENDER", hex: "#E6E6FA" },
    { name: "PLUM", hex: "#DDA0DD" },
    { name: "ORCHID", hex: "#DA70D6" },
    { name: "SIENNA", hex: "#A0522D" },
    { name: "SLATEBLUE", hex: "#6A5ACD" },
    { name: "SLATEGRAY", hex: "#708090" },
    { name: "DODGERBLUE", hex: "#1E90FF" },
    { name: "LIGHTGREEN", hex: "#90EE90" },
    { name: "MINTCREAM", hex: "#F5FFFA" },
    { name: "HONEYDEW", hex: "#F0FFF0" },
  ];

  const [word, setWord] = useState("");
  const [hex, setHex] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  function getWord() {
    const shouldMatch = Math.random() < 0.4;
    const i = Math.floor(Math.random() * colors.length);
    const word = colors[i].name;
    setWord(word);
    let hex;

    if (shouldMatch) {
      hex = colors[i].hex; // guaranteed correct
    }

    if (!shouldMatch) {
      let j;
      do {
        j = Math.floor(Math.random() * colors.length);
      } while (j === i);

      hex = colors[j].hex; // guaranteed wrong
    }

    setHex(hex);
  }

  useEffect(() => {
    console.log("Score updated:", score);
  }, [score]);

  function handleAnswer(answer) {
    const match = colors.some((c) => c.name === word && c.hex === hex);

    const isCorrect =
      (answer === "yes" && match) || (answer === "no" && !match);

    if (isCorrect) {
      console.log("score+1");
      setScore((prevScore) => prevScore + 1);
      setFeedback("👍");
    } else {
      console.log("score-1");
      setScore((prevScore) => Math.max(0, prevScore - 1));
      setFeedback("👎");
    }

    // Clear feedback after 1 second and get new word
    setTimeout(() => {
      setFeedback(null);
      getWord();
    }, 1000);

    // Reset the interval
    resetInterval();
  }

  const intervalRef = useRef(null);

  // Function to reset and restart the interval
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(getWord, 5000);
  };

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
            <h1 style={{ color: hex, fontSize: "65px" }}>{word}</h1>
            <p style={{ fontSize: "24px", margin: "20px 0" }}>{feedback}</p>
          </div>
          <div className="game-area-parts-button">
            <button className="game-button" onClick={() => handleAnswer("yes")}>
              Yes
            </button>
            <button className="game-button" onClick={() => handleAnswer("no")}>
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Game;
