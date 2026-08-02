import { formatSeconds } from "../../../utils/timeFormatter";

function TopWebsites({ websites }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5">
        🌐 Top Visited Websites
      </h2>

      {websites.length === 0 ? (
        <p className="text-slate-500">
          No telemetry available.
        </p>
      ) : (
        <div className="space-y-5">
          {websites.map((site, index) => (
            <div key={site.domain}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {index + 1}. {site.domain}
                </span>

                <span className="text-slate-600">
                  {formatSeconds(site.totalDuration)}
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (site.totalDuration /
                        websites[0].totalDuration) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopWebsites;