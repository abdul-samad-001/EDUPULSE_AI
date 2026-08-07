import { useMemo } from "react";
import HeatmapCell from "./HeatmapCell";
import HeatmapLegend from "./HeatmapLegend";
import { Card, Badge } from "../ui";
import { Flame, CheckCircle2 } from "lucide-react";

// Helper to format Date into YYYY-MM-DD in local timezone (avoiding UTC offset shifts)
const getLocalDateString = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Heatmap({ sessions = [], streak = 0 }) {
  const TOTAL_WEEKS = 15; // 15 weeks (~105 days) for large, comfortable squares

  const { weeks, monthLabels, totalMins, todayMins, todayDateStr } = useMemo(() => {
    const minutesMap = {};
    let total = 0;

    (Array.isArray(sessions) ? sessions : []).forEach((s) => {
      if (s.startedAt) {
        const localSessionDate = getLocalDateString(new Date(s.startedAt));
        const mins = s.actualDurationMinutes || 0;
        minutesMap[localSessionDate] = (minutesMap[localSessionDate] || 0) + mins;
        total += mins;
      }
    });

    const now = new Date();
    const todayStr = getLocalDateString(now);

    const todayObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayLoggedMins = minutesMap[todayStr] || 0;

    // End date: Saturday of current week
    const endDate = new Date(todayObj);
    const daysUntilSaturday = 6 - endDate.getDay();
    endDate.setDate(endDate.getDate() + daysUntilSaturday);

    // Start date: Sunday TOTAL_WEEKS ago
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (TOTAL_WEEKS * 7 - 1));

    const weeksArr = [];
    const rawMonthLabels = [];
    let lastMonth = "";
    const curr = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    for (let w = 0; w < TOTAL_WEEKS; w++) {
      const weekDays = [];

      for (let d = 0; d < 7; d++) {
        const dateStr = getLocalDateString(curr);
        const mName = curr.toLocaleDateString("en-US", { month: "short" });

        if (d === 0 && mName !== lastMonth) {
          lastMonth = mName;
          rawMonthLabels.push({ name: mName, colIndex: w });
        }

        const isFuture = curr > todayObj;

        weekDays.push({
          date: dateStr,
          dayOfWeek: d,
          value: isFuture ? 0 : (minutesMap[dateStr] || 0),
          isFuture,
          isToday: dateStr === todayStr,
        });

        curr.setDate(curr.getDate() + 1);
      }

      weeksArr.push(weekDays);
    }

    // Filter month labels to ensure clean separation (at least 3 weeks apart)
    const filteredMonthLabels = [];
    let lastCol = -5;
    rawMonthLabels.forEach((m) => {
      if (m.colIndex - lastCol >= 3) {
        filteredMonthLabels.push(m);
        lastCol = m.colIndex;
      }
    });

    return {
      weeks: weeksArr,
      monthLabels: filteredMonthLabels,
      totalMins: total,
      todayMins: todayLoggedMins,
      todayDateStr: todayStr,
    };
  }, [sessions]);

  return (
    <Card
      title="🔥 Study Heatmap"
      subtitle={`${totalMins} mins logged across last ${TOTAL_WEEKS} weeks`}
      headerAction={
        <Badge variant="warning" icon={Flame} size="sm">
          {streak} Day Streak
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="my-auto py-1 space-y-3">
        {/* Today's Focus & Streak Callout Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-sm">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark-text">
                Today's Focus: <span className="text-primary font-extrabold">{todayMins} mins</span>
              </p>
              <p className="text-[11px] text-dark-muted">
                {todayMins > 0 ? "Daily streak target active!" : "Start a session today to keep your streak alive"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-dark-bg px-3 py-1.5 rounded-lg border border-dark-border">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{streak} Day Streak</span>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="bg-dark-bg p-3.5 sm:p-4 rounded-xl border border-dark-border">
          {/* Top Month Labels Row */}
          <div className="flex pl-8 mb-2 text-xs font-bold text-primary">
            <div className="w-full flex justify-between">
              {monthLabels.map((m, idx) => (
                <div key={idx} style={{ flex: 1 }} className="text-left font-bold truncate">
                  {m.name}
                </div>
              ))}
            </div>
          </div>

          {/* Grid Layout: Left Day Labels + 15 Week Columns */}
          <div className="flex gap-2 sm:gap-3 items-start w-full">
            {/* Left Day Axis */}
            <div className="flex flex-col justify-between text-[11px] font-semibold text-dark-muted pr-1 shrink-0 select-none py-0.5" style={{ height: "calc(7 * 1.5rem + 6 * 0.35rem)" }}>
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* 15 Week Columns Spaced Evenly Edge-to-Edge */}
            <div className="flex-1 flex justify-between items-center">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col justify-between gap-1 sm:gap-1.5 shrink-0">
                  {week.map((day) => (
                    <HeatmapCell
                      key={day.date}
                      value={day.value}
                      date={day.date}
                      isFuture={day.isFuture}
                      isToday={day.isToday}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-0.5 text-xs text-dark-muted">
          <div className="flex items-center gap-1.5 text-[11px] text-dark-muted">
            <div className="w-2.5 h-2.5 rounded-xs border-2 border-amber-400 bg-amber-500/20" />
            <span>Gold ring = Today ({todayDateStr})</span>
          </div>
          <HeatmapLegend />
        </div>
      </div>
    </Card>
  );
}

export default Heatmap;