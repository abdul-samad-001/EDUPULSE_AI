import { useState, useEffect } from "react";
import { Card, Button, Badge } from "../ui";
import { Coffee, Play, SkipForward, RotateCcw } from "lucide-react";

function BreakTimerCard() {
  const [breakLength, setBreakLength] = useState(5); // 5 mins default
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStartBreak = (mins = 5) => {
    setBreakLength(mins);
    setRemainingSeconds(mins * 60);
    setIsActive(true);
  };

  const handleSkip = () => {
    setIsActive(false);
    setRemainingSeconds(breakLength * 60);
  };

  const formatBreakTime = () => {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      title="☕ Suggested Rest Break"
      subtitle="Rest your mind between intense focus blocks to maintain cognitive energy"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-4 my-auto py-2">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark-text">Suggested Interval Rest</p>
              <p className="text-[11px] text-dark-muted">5-10 minute light stretch or walk</p>
            </div>
          </div>

          <Badge variant={isActive ? "success" : "neutral"} size="sm">
            {isActive ? "Break Active" : "Ready"}
          </Badge>
        </div>

        {/* Break Timer Display */}
        <div className="text-center py-2">
          <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {formatBreakTime()}
          </span>
          <p className="text-[11px] text-dark-muted mt-0.5">
            {isActive ? "Enjoy your mental rest" : "Select interval duration below"}
          </p>
        </div>

        {/* Break Control Buttons */}
        <div className="flex items-center gap-2">
          {!isActive ? (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={() => handleStartBreak(5)}
                className="flex-1"
              >
                Start 5M Break
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStartBreak(10)}
                className="flex-1"
              >
                10M Break
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={RotateCcw}
                onClick={handleSkip}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={SkipForward}
                onClick={handleSkip}
                className="flex-1"
              >
                Skip Break
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export default BreakTimerCard;
