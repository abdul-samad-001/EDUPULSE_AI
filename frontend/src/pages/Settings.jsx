import { SectionHeader, Card } from "../components/ui";
import { Settings as SettingsIcon } from "lucide-react";

function Settings() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Settings ⚙️"
        subtitle="Manage your platform preferences and notification settings."
        icon={SettingsIcon}
      />

      <Card title="Account Settings" className="max-w-2xl">
        <p className="text-sm text-dark-muted">
          Custom preferences, integration options, and security settings will be available in future releases.
        </p>
      </Card>
    </div>
  );
}

export default Settings;