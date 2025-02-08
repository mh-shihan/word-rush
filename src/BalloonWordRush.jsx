import { useState, useEffect } from "react";

// List of Bangladeshi cities
const CITIES = [
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

// Sound effects (using base64 encoded short audio)
const correctSound = new Audio(
  "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"
);
const incorrectSound = new Audio(
  "data:audio/wav;base64,UklGRrZgT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ"
);

const Balloon = ({ letter, onPop, position }) => (
  <div
    className="absolute w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer transition-transform"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `translate(-50%, -50%)`,
      animation: `float ${8 + Math.random() * 4}s infinite ease-in-out`,
    }}
    onClick={() => onPop(letter)}
  >
    {letter}
  </div>
);

const BalloonWordRush = () => {
  const [currentCity, setCurrentCity] = useState("");
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState("playing");
  const [balloons, setBalloons] = useState([]);

  const handlePop = (letter) => {
    if (gameStatus !== "playing") return;

    const expectedLetter = currentCity[selectedLetters.length];

    if (letter === expectedLetter) {
      correctSound.play();
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);

      if (newSelected.join("") === currentCity) {
        setGameStatus("won");
      }
    } else {
      incorrectSound.play();
    }
  };

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    setCurrentCity(city);
    setSelectedLetters([]);
    setTimeLeft(30);
    setGameStatus("playing");
    generateBalloons(city);
  };

  const generateBalloons = (city) => {
    const cityLetters = city.split("");
    const allLetters = [...cityLetters];

    // Add random letters until we have 15 balloons
    while (allLetters.length < 15) {
      const randomChar = String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );
      if (!allLetters.includes(randomChar)) {
        allLetters.push(randomChar);
      }
    }

    const shuffled = allLetters.sort(() => Math.random() - 0.5);
    const newBalloons = shuffled.map((letter) => ({
      letter,
      position: {
        x: Math.random() * 90 + 5,
        y: Math.random() * 70 + 15,
      },
    }));

    setBalloons(newBalloons);
  };

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStatus("lost");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // const handlePop = (letter) => {
  //   if (gameStatus !== "playing") return;

  //   const expectedLetter = currentCity[selectedLetters.length];
  //   if (letter === expectedLetter) {
  //     const newSelected = [...selectedLetters, letter];
  //     setSelectedLetters(newSelected);

  //     if (newSelected.join("") === currentCity) {
  //       setGameStatus("won");
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      {/* Game Info */}
      <div className="p-4 flex justify-between">
        <div className="text-xl font-bold">City: {currentCity}</div>
        {/* Selected Letters */}
        <div className="text-center text-2xl mt-4">
          {selectedLetters.join(" ")}
        </div>

        <div className="text-xl font-bold">Time: {timeLeft}s</div>
      </div>

      {/* Balloons */}
      <div>
        {balloons.map((balloon, i) => (
          <Balloon
            key={i}
            letter={balloon.letter}
            position={balloon.position}
            onPop={handlePop}
          />
        ))}

        {/* Popups */}
        {gameStatus !== "playing" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">
                {gameStatus === "won" ? "Congratulations!" : "Time's Up!"}
              </h2>
              <button
                onClick={startNewGame}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translate(-50%, -50%) translateY(0);
            }
            50% {
              transform: translate(-50%, -50%) translateY(-20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BalloonWordRush;
