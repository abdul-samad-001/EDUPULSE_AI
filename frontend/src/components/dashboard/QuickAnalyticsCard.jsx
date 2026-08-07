import { useNavigate } from "react-router-dom";
import { Card, Button } from "../ui";
import { ArrowRight } from "lucide-react";

function QuickAnalyticsCard() {
  const navigate = useNavigate();

  return (
    <Card
      title="📊 Analytics Overview"
      subtitle="View your productivity trends, AI insights, study vs distract analysis, procrastination score, and website usage."
      className="w-full"
    >
      <div className="mt-2">
        <Button
          variant="primary"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate("/analytics")}
        >
          Open Analytics
        </Button>
      </div>
    </Card>
  );
}

export default QuickAnalyticsCard;