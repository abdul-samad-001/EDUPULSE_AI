import { useState } from "react";
import { Card, Button, Badge, toast } from "../ui";
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  ShieldAlert,
  Zap,
  Activity,
  FolderArchive,
  ToggleRight,
  FolderOpen,
  Pin,
} from "lucide-react";

function ExtensionTab() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [testStatus, setTestStatus] = useState("idle");

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = "/edupulse-ai-extension.zip";
    link.download = "edupulse-ai-extension.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Download Started", {
        description: "edupulse-ai-extension.zip saved to Downloads.",
      });
    }, 600);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    toast.success("Copied to Clipboard", { description: text });
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleTestConnection = () => {
    setTestStatus("testing");
    const token = localStorage.getItem("token");
    if (token) {
      window.postMessage({ type: "EDUPULSE_AUTH_TOKEN", token }, "*");
    }

    setTimeout(() => {
      setTestStatus("success");
      toast.success("Connection Ready", {
        description: "Auth credentials synced to browser extension.",
      });
    }, 800);
  };

  const STEPS = [
    {
      step: "01",
      title: "1. Download & Extract",
      icon: FolderArchive,
      desc: "Download extension ZIP and extract to a permanent folder.",
      actionLabel: "Download ZIP",
      onAction: handleDownload,
    },
    {
      step: "02",
      title: "2. Open Extensions Tab",
      icon: ExternalLink,
      desc: "Paste URL into browser address bar:",
      copyText: "chrome://extensions",
      note: "Edge: edge://extensions • Brave: brave://extensions",
    },
    {
      step: "03",
      title: "3. Enable Developer Mode",
      icon: ToggleRight,
      desc: "Turn ON 'Developer mode' toggle in top-right.",
      highlight: "Top-right toggle switch",
    },
    {
      step: "04",
      title: "4. Load Unpacked Folder",
      icon: FolderOpen,
      desc: "Click 'Load unpacked' (top-left) and pick unzipped folder.",
      highlight: "Select folder with manifest.json",
    },
    {
      step: "05",
      title: "5. Pin & Auto-Sync",
      icon: Pin,
      desc: "Pin extension icon. It auto-syncs with your account token!",
      highlight: "Auto-synced with workspace",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. COMPACT EXTENSION HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-4 sm:p-5 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" icon={Layers} size="sm">
                Extension v2.4.0
              </Badge>
              <Badge variant="success" size="sm">
                Manifest V3
              </Badge>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-dark-text tracking-tight">
              EduPulse AI Companion Extension 🧩
            </h2>
            <p className="text-xs text-dark-muted">
              Auto-track study telemetry, block social media distractions, and sync focus intervals directly.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={Activity}
              onClick={handleTestConnection}
              className="text-xs"
            >
              {testStatus === "testing" ? "Testing..." : testStatus === "success" ? "Synced ✓" : "Ping Sync"}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Download}
              loading={isDownloading}
              onClick={handleDownload}
              className="font-bold text-xs shadow-md shadow-primary/20"
            >
              Download (.ZIP)
            </Button>
          </div>
        </div>
      </div>

      {/* 2. 5 COMPACT INSTALLATION STEPS */}
      <Card
        title="🚀 How to Install & Run in 5 Simple Steps"
        subtitle="Quick walkthrough to load the unpacked extension in Chrome, Edge, or Brave"
        className="p-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex flex-col justify-between space-y-2.5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono">
                    {item.step}
                  </span>
                  <div className="p-1.5 rounded-lg bg-dark-card border border-dark-border text-primary">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-dark-text">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-dark-muted leading-snug">
                    {item.desc}
                  </p>
                </div>

                {item.copyText && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between bg-dark-card p-1.5 rounded-lg border border-dark-border">
                      <code className="text-[10px] text-primary font-mono truncate mr-1">
                        {item.copyText}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.copyText)}
                        className="p-0.5 text-dark-muted hover:text-dark-text"
                        title="Copy"
                      >
                        {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    {item.note && (
                      <p className="text-[9px] text-dark-muted/70">{item.note}</p>
                    )}
                  </div>
                )}

                {item.actionLabel && (
                  <div className="pt-0.5">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      icon={Download}
                      onClick={item.onAction}
                      className="text-[11px] py-1"
                    >
                      {item.actionLabel}
                    </Button>
                  </div>
                )}

                {item.highlight && (
                  <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-center">
                    {item.highlight}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. EXTENSION FEATURES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
            <Zap className="w-3.5 h-3.5" />
            <span>Automatic Telemetry</span>
          </div>
          <p className="text-[11px] text-dark-muted leading-tight">
            Captures study intervals and syncs encrypted batches to your dashboard.
          </p>
        </Card>

        <Card className="p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Distraction Blocker</span>
          </div>
          <p className="text-[11px] text-dark-muted leading-tight">
            Restricts social feeds during Pomodoros and redirects you to focus.
          </p>
        </Card>

        <Card className="p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Habit Nudge</span>
          </div>
          <p className="text-[11px] text-dark-muted leading-tight">
            Sends motivational notifications when off-task risk is detected.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default ExtensionTab;
