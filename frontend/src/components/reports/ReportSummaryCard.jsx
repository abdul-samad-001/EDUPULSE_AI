function ReportSummaryCard({ stats }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        📊 Report Summary
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div>
          <p className="text-gray-500 text-sm">
            Total Sessions
          </p>

          <h3 className="text-3xl font-bold">
            {stats.totalSessions}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Study Time
          </p>

          <h3 className="text-3xl font-bold text-green-600">
            {Math.round(stats.productiveTime / 60)} min
          </h3>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Distraction Time
          </p>

          <h3 className="text-3xl font-bold text-red-600">
            {Math.round(stats.distractionTime / 60)} min
          </h3>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Productivity
          </p>

          <h3 className="text-3xl font-bold text-blue-600">
            {stats.productivePercentage}%
          </h3>
        </div>

      </div>

    </div>
  );
}

export default ReportSummaryCard;