import { Card, Button, Modal } from "../ui";
import {
  KeyRound,
  Shield,
  Laptop,
  FileCode,
  FileSpreadsheet,
  Trash2,
  Download,
  AlertTriangle,
  Lock,
  LogOut,
} from "lucide-react";
import { useState } from "react";

function SecurityDataTab({ onExportJSON, onExportCSV, onClearCache }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSaved(true);
      setTimeout(() => {
        setPasswordSaved(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 3000);
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 20;
    if (newPassword.length >= 8) strength += 30;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(newPassword)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Password & Authentication Security */}
      <Card
        title="🔑 Password & Authentication"
        subtitle="Manage your login credentials and account access protection"
        className="w-full"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs focus:outline-none focus:border-primary transition-colors"
              />
              <KeyRound className="w-4 h-4 text-dark-muted absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-dark-muted">Password Strength</span>
                <span className={strength >= 75 ? "text-emerald-400" : strength >= 50 ? "text-amber-400" : "text-rose-400"}>
                  {strength >= 75 ? "Strong" : strength >= 50 ? "Medium" : "Weak"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength >= 75 ? "bg-emerald-500" : strength >= 50 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Lock}
              fullWidth
              className="text-xs font-bold"
            >
              {passwordSaved ? "Password Updated Successfully!" : "Update Account Password"}
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. Active Sessions & Devices */}
      <Card
        title="📱 Active Sessions & Devices"
        subtitle="Review devices currently authorized with your credentials"
        className="w-full"
      >
        <div className="space-y-3 pt-1">
          {/* Current Device */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-primary/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-text">Current Browser (Windows • Chrome)</h5>
                <p className="text-[10px] text-emerald-400 font-bold font-mono">ACTIVE SESSION • IP: 127.0.0.1</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
              This Device
            </span>
          </div>

          {/* Extension Device */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-dark-card text-dark-muted">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-text">EduPulse Companion Extension</h5>
                <p className="text-[10px] text-dark-muted">Last active 2 minutes ago</p>
              </div>
            </div>
            <span className="text-[10px] text-dark-muted font-bold font-mono">TOKEN SYNCED</span>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              fullWidth
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30"
            >
              Terminate All Other Sessions
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. GDPR Data Portability & Exports */}
      <Card
        title="📦 GDPR Data Portability & Backups"
        subtitle="Download a complete machine-readable copy of your personal study data"
        className="w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* JSON Export */}
          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-text">Complete JSON Archive</h5>
                <p className="text-[10px] text-dark-muted">All telemetry, roadmaps & XP</p>
              </div>
            </div>
            <Button
              variant="info"
              size="sm"
              icon={Download}
              fullWidth
              onClick={onExportJSON}
              className="text-xs"
            >
              Export JSON
            </Button>
          </div>

          {/* CSV Export */}
          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-dark-text">Focus Logs CSV</h5>
                <p className="text-[10px] text-dark-muted">Tabular spreadsheet records</p>
              </div>
            </div>
            <Button
              variant="success"
              size="sm"
              icon={Download}
              fullWidth
              onClick={onExportCSV}
              className="text-xs"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* 4. Danger Zone */}
      <Card
        title="⚠️ Danger Zone"
        subtitle="Irreversible account actions and local cache purges"
        className="w-full border-rose-500/30 bg-linear-to-br from-rose-500/5 via-dark-card to-dark-card"
      >
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-dark-bg border border-rose-500/20">
            <div>
              <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Purge Local Cache & Session Storage
              </h5>
              <p className="text-[11px] text-dark-muted mt-0.5">
                Clears cached dashboard telemetry and forces a clean synchronization from MongoDB.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowClearModal(true)}
              className="text-xs shrink-0"
            >
              Purge Cache
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Confirm Cache Purge"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs leading-relaxed">
              This will clear all local client-side state and reload your session from the server. Unsaved preferences will be reset.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setShowClearModal(false);
                onClearCache();
              }}
            >
              Proceed & Reload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SecurityDataTab;
