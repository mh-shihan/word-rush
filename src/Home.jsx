import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <Link to="/gamePage">
        <button className="bg-green-500 text-white px-8 py-4 rounded-lg text-2xl hover:bg-green-600 transition-colors cursor-pointer">
          Play Now
        </button>
      </Link>
    </div>
  );
};

export default Home;
