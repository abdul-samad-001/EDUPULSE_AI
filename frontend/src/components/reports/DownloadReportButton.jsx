import { downloadPDF } from "../../services/reportService";
import { Button } from "../ui";
import { Download } from "lucide-react";

function DownloadReportButton() {
  return (
    <Button
      variant="primary"
      size="sm"
      icon={Download}
      onClick={downloadPDF}
    >
      Download Report PDF
    </Button>
  );
}

export default DownloadReportButton;