import { Link } from "react-router-dom";
import startBGM from "./assets/audio/game-start.mp3";
import { useEffect, useState } from "react";
import image from "../public/bg_image_png.png";

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
    <>
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full h-[100vh] z-0 "
      >
        <div className="w-full h-[100vh] absolute bg-black z-10 top-0 bottom-0 opacity-85"></div>
        <Link
          className="absolute z-40 top-[30%] md:top-[35%] lg:top-[40%]  left-[28%] md:left-[42%]"
          to="/gamePage"
        >
          <button
            onClick={playAudio}
            className="bg-green-500 text-white px-8 py-4 rounded-lg text-2xl hover:bg-green-600 transition-colors cursor-pointer"
          >
            Play Now
          </button>
        </Link>
      </div>
    </>
    // min-h-screen bg-blue-100
    // h-[100vh] bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center"
  );
};

export default Home;
