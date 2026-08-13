import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge, LoadingSpinner } from "../ui";
import { Bot, Sparkles, Lightbulb, ArrowRight, Play, Coffee, Code, BookOpen, CheckSquare, HelpCircle, X, CheckCircle2 } from "lucide-react";
import { getRecommendationPrediction } from "../../services/mlService";
import { respondToRecommendation, getRecommendationStats } from "../../services/recommendationService";

const EXPLANATIONS = {
  0: "Your current skill progression is steady. Continuing your active roadmap will maximize domain mastery.",
  1: "Your attention signals indicate prime cognitive readiness. Starting a focused study session now will maximize output.",
  2: "Your recent focus duration indicates cognitive fatigue. A 5-10 minute recovery break will restore focus efficiency.",
  3: "Technical mastery requires hands-on practice. Diving into a coding-focused session will solidify recent concepts.",
  4: "Retention declines without periodic review. Revisiting previous milestone topics will boost long-term recall.",
  5: "Visual learning can bridge conceptual gaps. Watching targeted educational content will clarify complex topics.",
  6: "You have unresolved pending milestone tasks. Clearing backlog items prevents deadline pressure.",
  7: "Your progress metrics show strong preparedness. Attempting a self-assessment quiz will test your knowledge retention.",
};

const ACTION_CONFIG = {
  0: { label: "Continue Skill Roadmap", route: "/skills", actionTarget: "skills", icon: BookOpen },
  1: { label: "Start Focus Session", route: "/focus", actionTarget: "focus", icon: Play },
  2: { label: "Start Short Break", route: "/focus?mode=break", actionTarget: "break", icon: Coffee },
  3: { label: "Start Coding Focus Session", route: "/focus?mode=coding", actionTarget: "coding", icon: Code },
  4: { label: "Start Revision Session", route: "/focus?mode=revision", actionTarget: "revision", icon: BookOpen },
  5: { label: "Watch Video Lesson", route: "/skills", actionTarget: "video", icon: Play },
  6: { label: "Complete Pending Tasks", route: "/tasks", actionTarget: "tasks", icon: CheckSquare },
  7: { label: "Attempt Challenge Quiz", route: "/daily-challenge", actionTarget: "quiz", icon: HelpCircle },
};

function AICoachPreviewCard() {
  const navigate = useNavigate();
  const [recommendationData, setRecommendationData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionProcessing, setActionProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCoachData = async () => {
      try {
        const [recRes, statsRes] = await Promise.all([
          getRecommendationPrediction().catch(() => null),
          getRecommendationStats().catch(() => null),
        ]);

        if (isMounted) {
          if (recRes?.success && recRes?.data) {
            setRecommendationData(recRes.data);
          }
          if (statsRes?.success && statsRes?.data) {
            setStats(statsRes.data);
          }
        }
      } catch (err) {
        console.warn("AI Productivity Coach warning:", err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoachData();
    return () => {
      isMounted = false;
    };
  }, []);

  const eventId = recommendationData?.event_id || null;
  const classIdx = recommendationData?.recommendation_class ?? 6;
  const recText = recommendationData?.recommendation || "Complete Pending Tasks";
  const confidence = recommendationData?.confidence
    ? Math.round(recommendationData.confidence * 100)
    : 75;

  const explanation = EXPLANATIONS[classIdx] || EXPLANATIONS[6];
  const actionCfg = ACTION_CONFIG[classIdx] || ACTION_CONFIG[6];
  const ActionIcon = actionCfg.icon || ArrowRight;

  const handleAccept = async () => {
    if (actionProcessing) return;
    try {
      setActionProcessing(true);
      setFeedbackMessage(`Recommendation accepted. Launching ${actionCfg.label}...`);
      await respondToRecommendation(eventId, "accepted", "cta_click", actionCfg.actionTarget).catch(() => null);
      setTimeout(() => {
        navigate(actionCfg.route, {
          state: { mode: actionCfg.actionTarget, recommendationId: eventId },
        });
      }, 500);
    } catch (err) {
      console.warn("Accept response warning:", err);
      navigate(actionCfg.route);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleDismiss = async () => {
    if (actionProcessing) return;
    try {
      setActionProcessing(true);
      setFeedbackMessage("Got it. We'll adjust your next suggestion.");
      setDismissed(true);
      await respondToRecommendation(eventId, "dismissed", "user_dismiss").catch(() => null);
    } catch (err) {
      console.warn("Dismiss response warning:", err);
    } finally {
      setActionProcessing(false);
    }
  };

  // Personalization insight phrase
  let historyInsight = "Your history shows balanced engagement across daily recommendations.";
  if (stats && stats.completedRecommendations > 0) {
    historyInsight = `Your history shows ${stats.completedRecommendations} completed AI recommendations with a ${stats.acceptanceRate}% acceptance rate.`;
  } else if (stats && stats.mostAcceptedRecommendation && stats.mostAcceptedRecommendation !== "N/A") {
    historyInsight = `Your history shows highest follow-through for "${stats.mostAcceptedRecommendation}".`;
  }

  if (dismissed && feedbackMessage) {
    return (
      <Card
        title="🤖 AI Productivity Coach"
        subtitle="Personalized real-time daily study & task guidance"
        className="w-full h-full flex flex-col justify-between"
      >
        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border text-center space-y-2 my-auto">
          <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
          <p className="text-sm font-bold text-dark-text">{feedbackMessage}</p>
          <p className="text-xs text-dark-muted">Check back later for updated telemetry recommendations.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="🤖 AI Productivity Coach"
      subtitle="Personalized real-time daily study & task guidance"
      headerAction={
        <div className="flex items-center gap-1.5">
          <Badge variant="primary" icon={Sparkles} size="sm">
            {confidence}% Confidence
          </Badge>
        </div>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      {loading ? (
        <div className="py-8 flex justify-center items-center">
          <LoadingSpinner size="md" label="Analyzing recommendation signals..." />
        </div>
      ) : (
        <div className="space-y-3.5 my-1">
          {feedbackMessage && (
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Recommendation Box */}
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 shrink-0" />
                <span>Recommended Next Action</span>
              </div>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-primary/20 text-primary">
                {recText}
              </span>
            </div>
            <p className="text-xs text-dark-text leading-relaxed font-medium pt-1">
              {explanation}
            </p>
          </div>

          {/* Behavioral Pattern & Personalization Insight */}
          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Bot className="w-4 h-4 shrink-0" />
              <span>Historical Behavioral Insight</span>
            </div>
            <p className="text-xs text-dark-muted leading-relaxed">
              {historyInsight}
            </p>
          </div>
        </div>
      )}

      <div className="pt-2 flex items-center gap-2">
        <Button
          variant="primary"
          className="flex-1"
          size="sm"
          icon={ActionIcon}
          iconPosition="right"
          onClick={handleAccept}
          disabled={actionProcessing}
        >
          {actionProcessing ? "Launching..." : actionCfg.label}
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={X}
          onClick={handleDismiss}
          disabled={actionProcessing}
          title="Dismiss recommendation"
        >
          Dismiss
        </Button>
      </div>
    </Card>
  );
}

export default AICoachPreviewCard;
