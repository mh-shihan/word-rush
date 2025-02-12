import { Link } from "react-router-dom";
import startBGM from "./assets/audio/game-start.mp3";
import { useEffect, useState } from "react";

const Home = () => {
  const [audio, setAudio] = useState(null);
  useEffect(() => {
    const newAudio = new Audio(startBGM);
    newAudio.loop = false;
    newAudio.volume = 0.5;
    setAudio(newAudio);
  }, []);

  const playAudio = () => {
    audio.play();
  };

  return (
    // min-h-screen bg-blue-100
    <div className=" h-[100vh] bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <Link to="/gamePage">
        <button
          onClick={playAudio}
          className="bg-green-500 text-white px-8 py-4 rounded-lg text-2xl hover:bg-green-600 transition-colors cursor-pointer"
        >
          Play Now
        </button>
      </Link>
    </div>
  );
};

export default Home;
