import { useState } from "react";
import { Card, Button, Badge } from "../ui";
import { History, Download, Trash2, FileText } from "lucide-react";
import { downloadPDF } from "../../services/reportService";

function ReportHistoryWidget({ history = [] }) {
  const defaultHistory = [
    { id: "rep-101", title: "Weekly Learning Intelligence Report", date: "Aug 07, 2026", type: "Weekly", format: "PDF / CSV" },
    { id: "rep-102", title: "Monthly Productivity & Focus Audit", date: "Jul 31, 2026", type: "Monthly", format: "PDF / JSON" },
    { id: "rep-103", title: "Skill Mastery Progress Summary", date: "Jul 24, 2026", type: "Skill Audit", format: "CSV" },
  ];

  const [items, setItems] = useState(
    Array.isArray(history) && history.length > 0 ? history : defaultHistory
  );

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <Card title="📁 Report Archive & History" className="w-full">
        <p className="text-xs text-dark-muted text-center py-4">No report history archived yet.</p>
      </Card>
    );
  }

  return (
    <Card
      title="📁 Report Archive & Download History"
      subtitle="Access previously generated audit snapshots and downloadable logs"
      headerAction={
        <Badge variant="neutral" icon={History} size="sm">
          {items.length} Archived
        </Badge>
      }
      className="w-full p-0 overflow-hidden"
    >
      <div className="overflow-x-auto max-h-72 overflow-y-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead className="bg-dark-bg text-dark-muted border-b border-dark-border uppercase text-[10px] font-semibold tracking-wider">
            <tr>
              <th className="p-3.5 sm:p-4">Report Title</th>
              <th className="p-3.5 sm:p-4">Generated Date</th>
              <th className="p-3.5 sm:p-4">Type</th>
              <th className="p-3.5 sm:p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border text-dark-text">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-dark-border/40 transition-colors">
                <td className="p-3.5 sm:p-4 font-bold">
                  <span className="inline-flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    {item.title}
                  </span>
                </td>
                <td className="p-3.5 sm:p-4 text-dark-muted font-medium">{item.date}</td>
                <td className="p-3.5 sm:p-4">
                  <Badge variant="primary" size="sm">
                    {item.type}
                  </Badge>
                </td>
                <td className="p-3.5 sm:p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Download}
                      onClick={downloadPDF}
                    >
                      Download
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-dark-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default ReportHistoryWidget;
