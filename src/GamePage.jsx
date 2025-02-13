import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bgm from "./assets/audio/bgm_cut.mp3";
import { MdMusicNote } from "react-icons/md";
import { MdMusicOff } from "react-icons/md";
import balloonPunch from "./assets/audio/balloon_punch.wav";
import winningMp3 from "./assets/audio/winning.mp3";
import gameOver from "./assets/audio/game-over.mp3";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

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

const Balloon = ({ letter, onPop, position }) => (
  <div
    className="absolute w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer transition-transform"
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

const GamePage = () => {
  const [currentCity, setCurrentCity] = useState("");
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState("playing");
  const [balloons, setBalloons] = useState([]);

  // Audio State
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const [audioBGM, setAudioBGM] = useState(null);
  const [balloonPop, setBalloonPop] = useState(null);
  const [winAudio, setWinAudio] = useState(null);
  const [timeOutAudio, setTimeOutAudio] = useState(null);

  // Sound effects
  useEffect(() => {
    const newAudio = new Audio(bgm);
    const newBalloonPunch = new Audio(balloonPunch);
    const newWinAudio = new Audio(winningMp3);
    const newTimeOutAudio = new Audio(gameOver);

    newAudio.loop = true;
    newAudio.volume = 0.5;
    newWinAudio.volume = 0.3;
    newBalloonPunch.volume = 0.5;

    setAudioBGM(newAudio);
    setBalloonPop(newBalloonPunch);
    setWinAudio(newWinAudio);
    setTimeOutAudio(newTimeOutAudio);
  }, []);

  const toggleMusic = () => {
    if (!audioBGM) return;

    if (isBGMPlaying) {
      audioBGM.pause();
      audioBGM.currentTime = 0;
    } else {
      audioBGM.play();
    }
  };

  const handleOnClick = () => {
    setIsBGMPlaying(!isBGMPlaying);

    toggleMusic();
  };

  const handlePop = (letter) => {
    if (gameStatus !== "playing") return;
    balloonPop.play();

    const expectedLetter = currentCity[selectedLetters.length];

    if (letter === expectedLetter) {
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);

      if (newSelected.join("") === currentCity) {
        setGameStatus("won");
      }
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
    if (gameStatus !== "playing") {
      if (isBGMPlaying) toggleMusic();
      if (gameStatus === "won") {
        winAudio.play();
        confetti();
      } else timeOutAudio.play();
      return;
    }

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

  return (
    <div className="h-[100vh] bg-gradient-to-r from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Game Info */}
      <div className="p-4 flex justify-between">
        <div className="text-cyan-400 font-bold text-xl md:text-3xl font-mono">
          {currentCity}
        </div>
        {/* Selected Letters */}
        <div className="text-cyan-400  text-2xl md:text-4xl font-mono text-center  mt-6 md:mt-4">
          {selectedLetters.join(" ")}
        </div>

        <div className="flex  justify-center gap-2 ">
          <div className="text-cyan-400 font-mono  text-xl font-bold">
            Time: {timeLeft}s
          </div>
          <button className=" text-purple-500 rounded-full md:mb-2">
            {isBGMPlaying ? (
              <MdMusicNote
                onClick={handleOnClick}
                className="text-xl cursor-pointer"
              />
            ) : (
              <MdMusicOff
                onClick={handleOnClick}
                className="text-[20px] cursor-pointer"
              />
            )}
          </button>
        </div>
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
              <div className="flex gap-10">
                {/* Status Button */}
                <button
                  onClick={startNewGame}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer border-transparent"
                >
                  Play Again
                </button>
                {/* Exit Button */}
                <Link to="/">
                  <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 cursor-pointer">
                    Exit!
                  </button>
                </Link>
              </div>
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

export default GamePage;
