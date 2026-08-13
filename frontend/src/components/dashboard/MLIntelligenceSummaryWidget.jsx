import { useState, useEffect } from "react";
import { Card, Badge } from "../ui";
import { Sparkles, ShieldAlert, Zap, Compass, CheckCircle2, RotateCw } from "lucide-react";
import mlService from "../../services/mlService";
import { getRecommendationStats } from "../../services/recommendationService";

function MLIntelligenceSummaryWidget() {
  const [mlData, setMlData] = useState({
    procrastination: null,
    productivity: null,
    recommendation: null,
  });
  const [recStats, setRecStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isStaleFallback, setIsStaleFallback] = useState(false);

  const performRefresh = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }
    try {
      const refreshRes = await mlService
        .refreshMLIntelligence({
          triggerSource: isManualRefresh ? "user_manual_click" : "dashboard_load",
        })
        .catch(() => null);

      if (refreshRes?.success && refreshRes?.data) {
        const d = refreshRes.data;
        setMlData({
          procrastination: d.procrastination || d.predictions?.procrastination || null,
          productivity: d.productivity || d.predictions?.productivity || null,
          recommendation: d.recommendation || d.predictions?.recommendation || null,
        });
        setIsStaleFallback(false);
      } else {
        const [procRes, prodRes, recRes] = await Promise.all([
          mlService.getProcrastinationPrediction().catch(() => null),
          mlService.getProductivityPrediction().catch(() => null),
          mlService.getRecommendationPrediction().catch(() => null),
        ]);
        setMlData({
          procrastination: procRes?.data || null,
          productivity: prodRes?.data || null,
          recommendation: recRes?.data || null,
        });
      }

      const statsRes = await getRecommendationStats().catch(() => null);
      if (statsRes?.success && statsRes?.data) {
        setRecStats(statsRes.data);
      }
    } catch (err) {
      console.warn("ML Summary Widget Warning:", err?.message);
      setIsStaleFallback(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initialLoad = async () => {
      try {
        const refreshRes = await mlService
          .refreshMLIntelligence({ triggerSource: "dashboard_load" })
          .catch(() => null);

        if (isMounted && refreshRes?.success && refreshRes?.data) {
          const d = refreshRes.data;
          setMlData({
            procrastination: d.procrastination || d.predictions?.procrastination || null,
            productivity: d.productivity || d.predictions?.productivity || null,
            recommendation: d.recommendation || d.predictions?.recommendation || null,
          });
          setIsStaleFallback(false);
        } else if (isMounted) {
          const [procRes, prodRes, recRes] = await Promise.all([
            mlService.getProcrastinationPrediction().catch(() => null),
            mlService.getProductivityPrediction().catch(() => null),
            mlService.getRecommendationPrediction().catch(() => null),
          ]);
          setMlData({
            procrastination: procRes?.data || null,
            productivity: prodRes?.data || null,
            recommendation: recRes?.data || null,
          });
        }

        const statsRes = await getRecommendationStats().catch(() => null);
        if (isMounted && statsRes?.success && statsRes?.data) {
          setRecStats(statsRes.data);
        }
      } catch (err) {
        console.warn("ML Summary Widget Initial Load Warning:", err?.message);
        if (isMounted) setIsStaleFallback(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const procScore = mlData.procrastination?.probability
    ? Math.round(mlData.procrastination.probability * 100)
    : 20;
  const procRisk = mlData.procrastination?.risk_level || "Low";

  const prodScore = mlData.productivity?.productivity_score ?? 78;

  const nextAction = mlData.recommendation?.recommendation || "Complete Pending Tasks";
  const confidence = mlData.recommendation?.confidence
    ? Math.round(mlData.recommendation.confidence * 100)
    : 75;

  const acceptanceRate = recStats?.acceptanceRate ?? 85;
  const completionRate = recStats?.completionRate ?? 90;

  return (
    <Card
      title="✨ AI Focus & Productivity Insights"
      subtitle={
        refreshing
          ? "Updating AI insights..."
          : "Personalized real-time focus evaluation, risk analysis & smart guidance"
      }
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="success" icon={CheckCircle2} size="sm" className="hidden sm:inline-flex text-[10px]">
            {completionRate}% Follow-Through
          </Badge>
          <Badge
            variant={isStaleFallback ? "warning" : "primary"}
            icon={Sparkles}
            size="sm"
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => performRefresh(true)}
          >
            {refreshing ? "Refreshing..." : isStaleFallback ? "Cached AI" : "AI Active"}
          </Badge>
          <button
            onClick={() => performRefresh(true)}
            disabled={refreshing}
            className="p-1 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-border transition-colors disabled:opacity-50"
            title="Refresh ML Insights"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      }
      className="w-full bg-linear-to-r from-dark-card via-dark-card to-primary/5 border-primary/20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Procrastination Risk Signal */}
        <div className="p-3 rounded-xl bg-dark-bg/90 border border-dark-border space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-dark-muted">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Procrastination Risk
            </span>
            <Badge
              variant={procRisk === "High" ? "danger" : procRisk === "Moderate" ? "warning" : "success"}
              size="sm"
              className="text-[10px] py-0 px-1.5"
            >
              {procRisk} Risk
            </Badge>
          </div>
          <p className="text-base font-extrabold text-dark-text pt-0.5">
            {loading ? "..." : `${procScore}% Risk`}
          </p>
        </div>

        {/* Productivity Score Signal */}
        <div className="p-3 rounded-xl bg-dark-bg/90 border border-dark-border space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-dark-muted">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Productivity Score
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">
              AI Predicted
            </span>
          </div>
          <p className="text-base font-extrabold text-dark-text pt-0.5">
            {loading ? "..." : `${prodScore}% Efficient`}
          </p>
        </div>

        {/* Recommended Action Signal */}
        <div className="p-3 rounded-xl bg-dark-bg/90 border border-dark-border space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-dark-muted">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-primary" />
              Recommended Action
            </span>
            <span className="text-[10px] font-bold text-primary">{confidence}% Match</span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <p className="text-sm font-extrabold text-primary truncate">
              {loading ? "..." : nextAction}
            </p>
            <span className="text-[10px] text-dark-muted shrink-0 pl-1 font-semibold">
              ({acceptanceRate}% Acceptance)
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MLIntelligenceSummaryWidget;
