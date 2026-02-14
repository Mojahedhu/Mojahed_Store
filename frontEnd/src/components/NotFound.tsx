import { FaHome } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-slate-950 via-slate-900 text-white px-6">
      <div className="text-center max-w-xl w-full">
        <h1 className="text-[120px] font-extrabold leading-none bg-linear-to-r from-red-400 to-pink-50-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-semibold mt-4">Page not found</h2>
        <p className="text-slate-400 mt-4"></p>
        The page you are looking for does not exist or has been moved. let's get
        you back on track.
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all active:bg-slate-600 active:scale-95"
        >
          Go back
        </button>
        <Link
          to={"/"}
          className="flex items-center py-3 px-5 gap-2 rounded-xl bg-pink-600 hover:bg-pink-700 transition-all shadow-lg shadow-indigo-900/30"
        >
          <FaHome size={20} />
          Home
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 py-3 px-5 rounded-xl border border-slate-700 hover:bg-slate-800 transition"
        >
          <FiRefreshCcw size={18} />
        </button>
      </div>

      <div className="mt-12 relative">
        <div className="absolute inset-0 blur-3xl opacity-30 bg-indigo-300 rounded-full"></div>
        <div className="relative text-slate-300 text-sm">
          Error code: 404_Not_Found
        </div>
      </div>
    </div>
  );
};

export { NotFound };
