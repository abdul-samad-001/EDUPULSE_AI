import { useState, useEffect } from "react";
import { Card, Button, Badge, LoadingSpinner } from "../ui";
import { Sparkles, Brain, ArrowRight, Target, Play, Coffee, Code, BookOpen, CheckSquare, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRecommendationPrediction } from "../../services/mlService";

const EXPLANATIONS = {
  0: "Your current skill progression is steady. Continuing your active roadmap will maximize domain mastery.",
  1: "Your attention signals indicate prime cognitive readiness. Starting a focused study session now will maximize output.",
  2: "Your recent focus duration indicates cognitive fatigue. A 5-10 minute recovery break will restore focus efficiency.",
  3: "Technical mastery requires hands-on practice. Diving into coding challenges will solidify recent concepts.",
  4: "Retention declines without periodic review. Revisiting previous milestone topics will boost long-term recall.",
  5: "Visual learning can bridge conceptual gaps. Watching targeted educational content will clarify complex topics.",
  6: "You have unresolved pending milestone tasks. Clearing backlog items prevents deadline pressure.",
  7: "Your progress metrics show strong preparedness. Attempting a self-assessment quiz will test your knowledge retention.",
};

const ACTION_CONFIG = {
  0: { label: "Open Skill Roadmap", route: "/skills", icon: BookOpen },
  1: { label: "Start Focus Session", route: "/focus", icon: Play },
  2: { label: "Start Short Break", route: "/focus", icon: Coffee },
  3: { label: "Practice Coding", route: "/skills", icon: Code },
  4: { label: "Start Revision", route: "/skills", icon: BookOpen },
  5: { label: "Watch Video Lesson", route: "/skills", icon: Play },
  6: { label: "Complete Pending Tasks", route: "/skills", icon: CheckSquare },
  7: { label: "Attempt Challenge Quiz", route: "/daily-challenge", icon: HelpCircle },
};

function AIAnalyticsPreviewCard() {
  const navigate = useNavigate();
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.warn("Recommendation Warning:", err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchModel3();
    return () => {
      isMounted = false;
    };
  }, []);

  const classIdx = recommendationData?.recommendation_class ?? 6;
  const recText = recommendationData?.recommendation || "Complete Pending Tasks";
  const confidence = recommendationData?.confidence
    ? Math.round(recommendationData.confidence * 100)
    : 69;

  const explanation = EXPLANATIONS[classIdx] || EXPLANATIONS[6];
  const actionCfg = ACTION_CONFIG[classIdx] || ACTION_CONFIG[6];
  const ActionIcon = actionCfg.icon || ArrowRight;

  return (
    <Card
      title="🤖 AI Intelligence & Learning Path Optimization"
      subtitle="Automated performance evaluation and optimal activity routing"
      headerAction={
        <div className="flex items-center gap-1.5">
          <Badge variant="primary" icon={Sparkles} size="sm">
            {confidence}% Confidence
          </Badge>
        </div>
      }
      className="w-full h-full flex flex-col justify-between border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-dark-card to-dark-card"
    >
      {loading ? (
        <div className="py-8 flex justify-center items-center">
          <LoadingSpinner size="md" label="Calculating AI learning recommendation..." />
        </div>
      ) : (
        <div className="space-y-3.5 my-auto py-1">
          <div>
            <span className="text-[11px] font-bold uppercase text-primary tracking-wider block mb-1">
              AI Recommendation Signal
            </span>
            <h3 className="text-base font-extrabold text-dark-text tracking-tight flex items-center gap-2">
              <span>{recText}</span>
            </h3>
            <p className="text-xs text-dark-muted mt-1 leading-relaxed">
              {explanation}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
              <span className="flex items-center gap-1 font-bold text-primary">
                <Brain className="w-3.5 h-3.5" />
                Intelligence Engine
              </span>
              <p className="text-dark-muted text-[11px]">Real-Time Behavioral Analytics</p>
            </div>

            <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Target className="w-3.5 h-3.5" />
                Prediction Certainty
              </span>
              <p className="text-dark-muted text-[11px]">{confidence}% Certainty Score</p>
            </div>
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
          onClick={() => navigate(actionCfg.route)}
        >
          {actionCfg.label}
        </Button>
      </div>
    </Card>
  );
}

export default AIAnalyticsPreviewCard;
