import { Card, Badge } from "../ui";
import { Zap } from "lucide-react";

function AIReportCard({ ai }) {
  if (!ai) return null;

  return (
    <Card title="🧠 AI Productivity Report" className="w-full">
      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-bg border border-dark-border mb-4">
        <div>
          <p className="text-xs text-dark-muted">Productivity Score</p>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mt-0.5">
            {ai.productivityScore}%
          </h2>
        </div>
        <Badge variant="primary" icon={Zap} size="sm">
          AI Evaluated
        </Badge>
      </div>

      {ai.recommendation && (
        <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
            Recommendation
          </h4>
          <p className="text-xs text-dark-text leading-relaxed">
            {ai.recommendation}
          </p>
        </div>
      )}

      {ai.insights && ai.insights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-dark-muted uppercase tracking-wider">
            AI Insights
          </h4>
          {ai.insights.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-dark-bg border border-dark-border"
            >
              <h5 className="text-xs font-semibold text-dark-text">
                {item.title}
              </h5>
              <p className="text-xs text-dark-muted mt-0.5 leading-relaxed">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default AIReportCard;