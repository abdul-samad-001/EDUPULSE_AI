function AIReportCard({ ai }) {
  if (!ai) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-5">
        🧠 AI Productivity Report
      </h2>

      <div className="mb-6">
        <p className="text-gray-500">
          Productivity Score
        </p>

        <h1 className="text-5xl font-bold text-blue-600">
          {ai.productivityScore}%
        </h1>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Recommendation
        </h3>

        <p className="text-gray-600">
          {ai.recommendation}
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-4">
          AI Insights
        </h3>

        <div className="space-y-4">
          {ai.insights.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4"
            >
              <h4 className="font-semibold">
                {item.title}
              </h4>

              <p className="text-gray-600 mt-1">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIReportCard;