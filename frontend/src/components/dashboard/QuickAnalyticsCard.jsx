import { useNavigate } from "react-router-dom";

function QuickAnalyticsCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-3">
        📊 Analytics Overview
      </h2>

      <p className="text-gray-600 mb-6">
        View your productivity trends, AI insights,
        study vs distract analysis, procrastination
        score, and website usage.
      </p>

      <button
        onClick={() => navigate("/analytics")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Open Analytics →
      </button>
    </div>
  );
}

export default QuickAnalyticsCard;