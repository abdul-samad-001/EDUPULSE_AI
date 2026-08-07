import { formatSeconds } from "../../../utils/timeFormatter";
import { Card, Progress } from "../../ui";

function TopWebsites({ websites = [] }) {
  const maxDuration = websites.length > 0 ? websites[0].totalDuration : 1;

  return (
    <Card title="🌐 Top Visited Websites" className="w-full">
      {websites.length === 0 ? (
        <p className="text-xs text-dark-muted py-4 text-center border border-dashed border-dark-border rounded-xl">
          No website telemetry available yet.
        </p>
      ) : (
        <div className="space-y-3">
          {websites.map((site, index) => {
            const percent = (site.totalDuration / maxDuration) * 100;

            return (
              <div key={site.domain || index} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-text">
                    {index + 1}. {site.domain}
                  </span>
                  <span className="text-primary">
                    {formatSeconds(site.totalDuration)}
                  </span>
                </div>
                <Progress
                  value={percent}
                  size="sm"
                  color="primary"
                />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default TopWebsites;