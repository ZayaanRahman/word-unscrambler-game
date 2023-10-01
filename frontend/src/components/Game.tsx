import Title from "./Title";
import { useEffect, useState } from "react";
import axios from "axios";

function Game() {
  // state variables
  const [gameStart, setGameStart] = useState("Intro"); // Intro, Game, and End
  const [word, setWord] = useState("");
  const [wordCount, setWordCount] = useState(1);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");

  // button handlers
  const handleStartClick = () => {
    setWordCount(1);
    setGuess("");
    setScore(0);
    setMessage("good luck :)");
    setHint("");
    setGameStart("Game"); // Hide the Title component
  };

  const handleGuessClick = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:3000/guess?guess=${guess}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const responseData = response.data;
        // console.log(response);
        // console.log("data: ", responseData);

        if (responseData === true) {
          setScore(score + 5);
          setGuess("");
          // console.log("true path");
          // console.log(score);
          // console.log(wordCount);
          if (wordCount === 5) {
            setWordCount(1);
          } else {
            setWordCount(wordCount + 1);
          }

          setMessage("Well done!");
        } else {
          setGuess("");
          setMessage("Try again!");
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handlePass = () => {
    setScore(score - 1); // punish the player for passing
    if (wordCount === 5) {
      setWordCount(1);
    } else {
      setWordCount(wordCount + 1);
    }
    console.log("test");
    setMessage("-1 point...");
  };

  const handleHint = () => {
    // Hint is not regenerated if already there

    if (hint === "") {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:3000/hint`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          const responseData = response.data;
          setMessage(responseData);
          setHint(responseData);
        })
        .catch((error) => {
          // console.log(error);
        });
    } else {
      setMessage(hint);
    }
  };

  // useEffects
  useEffect(() => {
    if (wordCount === 1 && gameStart === "Game") {
      setGameStart("End");
    }

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/scrambled",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setWord(response.data);
        setHint("");
      })
      .catch((error) => {
        // console.log(error);
      });
  }, [wordCount]);

  // main returns
  if (gameStart === "Intro") {
    return (
      <div className="text-center">
        <Title />
        <button className="btn btn-primary" onClick={handleStartClick}>
          Lets go!
        </button>
      </div>
    );
  } else if (gameStart === "Game") {
    return (
      <div className="text-center">
        <div className="join">
          <h1 className="text-2xl mb-4 mr-8">Score: {score}</h1>
          <h1 className="text-2xl mb-4">Words Left: {6 - wordCount}</h1>
        </div>
        <h1 className="text-5xl font-bold mb-4">{word}</h1>
        <div className="join join-vertical lg:join-horizontal">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <input
                name="guess"
                type="text"
                placeholder="Enter a guess..."
                className="input w-full max-w-xs mb-4 rounded-l-md"
                value={guess}
                onChange={(input) => {
                  setGuess(input.target.value);
                }}
              />
              <button
                className="btn join-item btn-primary mb-4"
                onClick={handleGuessClick}
              >
                Guess
              </button>
            </div>
            <div className="join mb-4">
              <button
                className="btn join-item btn-secondary"
                onClick={handleHint}
              >
                Hint?
              </button>
              <button
                className="btn join-item btn-secondary"
                onClick={handlePass}
              >
                Pass
              </button>
            </div>
          </div>
        </div>
        <p className="text-2xl text-centered">{message}</p>
      </div>
    );
  } else if (gameStart === "End") {
    return (
      <div className="text-center space-y-4">
        {" "}
        {/* Add space-y-4 class for vertical spacing */}
        <h1 className="text-5xl font-bold">Thanks for playing!</h1>
        <h1 className="text-2xl">Score: {score}</h1>
        <button className="btn btn-primary" onClick={handleStartClick}>
          Play again?
        </button>
      </div>
    );
  }
}

export default Game;
