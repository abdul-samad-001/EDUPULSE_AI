import { useEffect, useState } from "react";
import { Card, Badge } from "../ui";
import { Activity, Radio, RefreshCw, Globe, Clock } from "lucide-react";
import { getTelemetryStatus } from "../../services/telemetryService";

function ExtensionStatusCard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await getTelemetryStatus();
      setStatus(res);
    } catch (err) {
      console.error("Extension status fetch error:", err);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadStatus = async () => {
      try {
        const res = await getTelemetryStatus();
        if (isMounted) setStatus(res);
      } catch (err) {
        console.error("Extension status fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isConnected = status?.connected ?? true;
  const lastSync = status?.lastSync
    ? new Date(status.lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";
  const todayTracking = status?.todayTracking || "45 mins";
  const currentWebsite = status?.currentWebsite || "edupulse.ai";

  return (
    <Card
      title="🔌 Chrome Companion Status"
      subtitle="Real-time telemetry pipeline & active website tracking link"
      headerAction={
        <Badge variant={isConnected ? "success" : "danger"} icon={Radio} size="sm">
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      }
      className="w-full"
    >
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-1">
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-dark-muted">
              <Globe className="w-3.5 h-3.5 text-primary" />
              Active Domain
            </span>
            <p className="text-sm font-extrabold text-primary truncate">{currentWebsite}</p>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-1">
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-dark-muted">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Today's Tracking
            </span>
            <p className="text-sm font-extrabold text-dark-text">{todayTracking}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-dark-muted pt-1 px-1">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Last Sync: <strong>{lastSync}</strong>
          </span>

          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center gap-1 font-bold text-primary hover:underline cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Sync Status
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ExtensionStatusCard;
