import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <SearchX size={36} className="text-blue-600" />
        </div>

        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
        >
          <Home size={16} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;