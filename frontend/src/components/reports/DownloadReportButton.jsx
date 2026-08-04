import { downloadPDF } from "../../services/reportService";

function DownloadReportButton() {
  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={downloadPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
      >
        📄 Download PDF
      </button>
    </div>
  );
}

export default DownloadReportButton;