import { useState } from "react";
import { Card, Button } from "../ui";
import { FileText, FileSpreadsheet, FileCode, Share2, Download, Check } from "lucide-react";
import { downloadPDF, exportReportCSV, exportReportJSON } from "../../services/reportService";

function ExportCenterWidget() {
  const [downloading, setDownloading] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleExport = async (type, exportFn) => {
    try {
      setDownloading(type);
      await exportFn();
    } catch (err) {
      console.error(`Export ${type} error:`, err);
    } finally {
      setDownloading(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title="📥 Export & Sharing Center"
      subtitle="Download official PDF, CSV, or JSON study audit reports or share your learning progress"
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* PDF Export Button */}
        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-dark-text">Official PDF Report</h4>
              <p className="text-[11px] text-dark-muted">Formatted PDF document</p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            fullWidth
            icon={Download}
            loading={downloading === "pdf"}
            onClick={() => handleExport("pdf", downloadPDF)}
          >
            Export PDF
          </Button>
        </div>

        {/* CSV Export Button */}
        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-dark-text">Spreadsheet CSV</h4>
              <p className="text-[11px] text-dark-muted">Raw tabular study metrics</p>
            </div>
          </div>
          <Button
            variant="success"
            size="sm"
            fullWidth
            icon={Download}
            loading={downloading === "csv"}
            onClick={() => handleExport("csv", exportReportCSV)}
          >
            Export CSV
          </Button>
        </div>

        {/* JSON Export Button */}
        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-dark-text">Raw JSON Data</h4>
              <p className="text-[11px] text-dark-muted">Developer schema payload</p>
            </div>
          </div>
          <Button
            variant="info"
            size="sm"
            fullWidth
            icon={Download}
            loading={downloading === "json"}
            onClick={() => handleExport("json", exportReportJSON)}
          >
            Export JSON
          </Button>
        </div>

        {/* Share Link Button */}
        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-dark-text">Shareable Link</h4>
              <p className="text-[11px] text-dark-muted">Copy link to clipboard</p>
            </div>
          </div>
          <Button
            variant="warning"
            size="sm"
            fullWidth
            icon={copied ? Check : Share2}
            onClick={handleShare}
          >
            {copied ? "Link Copied!" : "Share Report"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ExportCenterWidget;
