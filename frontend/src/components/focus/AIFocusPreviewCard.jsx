import { useState, useEffect } from "react";
import { Card, Button, Badge, LoadingSpinner } from "../ui";
import { Sparkles, Brain, ArrowRight, Play, Coffee, Code, BookOpen, CheckSquare, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRecommendationPrediction } from "../../services/mlService";
import { respondToRecommendation } from "../../services/recommendationService";

const ACTION_CONFIG = {
  0: { label: "Open Skill Roadmap", route: "/skills", actionTarget: "skills", icon: BookOpen },
  1: { label: "Start Focus Session", route: "/focus", actionTarget: "focus", icon: Play },
  2: { label: "Start Short Break", route: "/focus?mode=break", actionTarget: "break", icon: Coffee },
  3: { label: "Start Coding Focus Session", route: "/focus?mode=coding", actionTarget: "coding", icon: Code },
  4: { label: "Start Revision Session", route: "/focus?mode=revision", actionTarget: "revision", icon: BookOpen },
  5: { label: "Watch Video Lesson", route: "/skills", actionTarget: "video", icon: Play },
  6: { label: "Complete Pending Tasks", route: "/tasks", actionTarget: "tasks", icon: CheckSquare },
  7: { label: "Attempt Challenge Quiz", route: "/daily-challenge", actionTarget: "quiz", icon: HelpCircle },
};

function AIFocusPreviewCard() {
  const navigate = useNavigate();
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionProcessing, setActionProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchModel3 = async () => {
      try {
        setLoading(true);
        const res = await getRecommendationPrediction();
        if (isMounted && res?.success && res?.data) {
          setRecommendationData(res.data);
        }
      } catch (err) {
        console.warn("Focus Recommendation Warning:", err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchModel3();
    return () => {
      isMounted = false;
    };
  }, []);

  const eventId = recommendationData?.event_id || null;
  const classIdx = recommendationData?.recommendation_class ?? 1;
  const recText = recommendationData?.recommendation || "Start Focus Session";
  const confidence = recommendationData?.confidence
    ? Math.round(recommendationData.confidence * 100)
    : 75;

  const actionCfg = ACTION_CONFIG[classIdx] || ACTION_CONFIG[1];
  const ActionIcon = actionCfg.icon || ArrowRight;

  const handleAction = async () => {
    if (actionProcessing) return;
    try {
      setActionProcessing(true);
      await respondToRecommendation(eventId, "accepted", "cta_click", actionCfg.actionTarget).catch(() => null);
      navigate(actionCfg.route, {
        state: { mode: actionCfg.actionTarget, recommendationId: eventId },
      });
    } catch (err) {
      console.warn("Focus CTA Action Warning:", err);
      navigate(actionCfg.route);
    } finally {
      setActionProcessing(false);
    }
  };

  return (
    <Card
      title="🤖 Today's AI Focus Guidance"
      subtitle="Real-time attention & focus recommendations"
      headerAction={
        <Badge variant="primary" icon={Sparkles} size="sm">
          {confidence}% Confidence
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-dark-card to-dark-card"
    >
      {loading ? (
        <div className="py-8 flex justify-center items-center">
          <LoadingSpinner size="md" label="Loading focus guidance recommendation..." />
        </div>
      ) : (
        <div className="space-y-3.5 my-auto py-1">
          <div>
            <h3 className="text-base font-extrabold text-dark-text tracking-tight">
              Focus Recommendation: {recText}
            </h3>
            <p className="text-xs text-dark-muted mt-1 leading-relaxed">
              EduPulse AI evaluates your work session duration, distraction rates, and streak patterns to optimize your next study block.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Brain className="w-3.5 h-3.5" />
              <span>Optimal Work Block</span>
            </div>
            <p className="text-dark-muted text-[11px]">
              Recommended interval: 25-45 min focus + 5-10 min break
            </p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button
          variant="primary"
          fullWidth
          size="sm"
          icon={ActionIcon}
          iconPosition="right"
          onClick={handleAction}
          disabled={actionProcessing}
        >
          {actionProcessing ? "Launching..." : actionCfg.label}
        </Button>
      </div>
    </Card>
  );
}

export default AIFocusPreviewCard;
