import { useState } from "react";
import { Card, Badge, Button, Progress, Modal } from "../ui";
import {
  Crown,
  CheckCircle2,
  HardDrive,
  Cpu,
  Laptop,
  CreditCard,
  Download,
  Zap,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";

function SubscriptionTab() {
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [eduEmail, setEduEmail] = useState("");
  const [eduVerified, setEduVerified] = useState(false);
  const [downloadingInv, setDownloadingInv] = useState(null);

  const LICENSE_KEY = "EDU-PRO-2026-X89K-7741-SCHOLAR";

  const PRO_BENEFITS = [
    "Unlimited AI Productivity Coach recommendations",
    "Sub-20ms priority local ML inference pipeline",
    "Comprehensive PDF, CSV, and JSON study report exports",
    "Unlimited skill roadmaps and milestone tracking",
    "Multi-device telemetry sync with Chrome Extension bridge",
    "Access to exclusive beta model releases (Model 3 v2.4+)",
  ];

  const INVOICES = [
    {
      id: "INV-2026-0891",
      date: "Aug 01, 2026",
      desc: "EduPulse Pro Scholar License (Annual 2026-2027)",
      amount: "$0.00",
      status: "PAID (SCHOLAR GRANT)",
    },
    {
      id: "INV-2025-0412",
      date: "Aug 01, 2025",
      desc: "EduPulse Academic Beta License (Annual 2025-2026)",
      amount: "$0.00",
      status: "PAID (SCHOLAR GRANT)",
    },
  ];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(LICENSE_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleVerifyEdu = (e) => {
    e.preventDefault();
    if (eduEmail.toLowerCase().includes(".edu") || eduEmail.includes("@")) {
      setEduVerified(true);
    }
  };

  const handleDownloadInvoice = (inv) => {
    setDownloadingInv(inv.id);
    setTimeout(() => {
      const receiptContent =
        "========================================================\n" +
        "             EDUPULSE ACADEMIC INVOICE RECEIPT          \n" +
        "========================================================\n\n" +
        `INVOICE ID    : ${inv.id}\n` +
        `ISSUE DATE    : ${inv.date}\n` +
        `PLAN TIER     : EduPulse Pro Scholar (Academic License)\n` +
        `DESCRIPTION   : ${inv.desc}\n` +
        `AMOUNT CHARGED: ${inv.amount}\n` +
        `DISCOUNT RATE : 100% Academic Scholar Grant\n` +
        `PAYMENT STATUS: ${inv.status}\n` +
        `LICENSE KEY   : ${LICENSE_KEY}\n` +
        `EXPIRATION    : August 31, 2027\n\n` +
        "========================================================\n" +
        "This official academic receipt verifies full student\n" +
        "sponsorship under the EduPulse Academic Research Fund.\n" +
        "========================================================\n";

      const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EduPulse_Invoice_${inv.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadingInv(null);
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Pro Membership Showcase (2 Cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500/10 via-dark-card to-dark-card border-2 border-amber-500/30 p-6 sm:p-7 shadow-xl">
          {/* Subtle VIP Aura Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-dark-text">EduPulse Pro Scholar</h3>
                    <Badge variant="warning" size="sm">ACTIVE PLAN</Badge>
                  </div>
                  <p className="text-xs text-dark-muted mt-0.5">Billed Annually • Renews Aug 2027</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">$0</span>
                <span className="text-xs text-dark-muted font-bold"> / Free Academic Tier</span>
              </div>
            </div>

            {/* Pro Features Grid */}
            <div className="pt-2 border-t border-dark-border/60">
              <h4 className="text-xs font-bold text-dark-muted uppercase tracking-wider mb-3">
                Included Pro Scholar Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRO_BENEFITS.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-dark-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-dark-border/60">
              <Button
                variant="warning"
                size="sm"
                icon={Zap}
                onClick={() => setShowLicenseModal(true)}
                className="font-bold text-xs cursor-pointer"
              >
                Manage Academic License
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={CreditCard}
                onClick={() => setShowBillingModal(true)}
                className="text-xs cursor-pointer"
              >
                Billing Details & Invoices
              </Button>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <Card
          title="🧾 Billing History & Invoices"
          subtitle="Download official academic tier receipts and billing records"
          className="w-full"
        >
          <div className="space-y-2 pt-1">
            {INVOICES.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border text-xs gap-3 flex-wrap sm:flex-nowrap"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-dark-text">{inv.desc}</h5>
                    <p className="text-[11px] text-dark-muted">{inv.date} • {inv.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-mono font-bold text-emerald-400 text-xs">{inv.status}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    loading={downloadingInv === inv.id}
                    onClick={() => handleDownloadInvoice(inv)}
                    className="text-xs py-1 px-2.5"
                  >
                    Receipt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 2. Resource Quotas & Usage Meters (1 Col) */}
      <div className="space-y-6">
        <Card
          title="📊 Resource Quotas"
          subtitle="Real-time capacity usage across compute and storage"
          className="w-full"
        >
          <div className="space-y-5 pt-1">
            {/* Storage Quota */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-dark-text">
                  <HardDrive className="w-3.5 h-3.5 text-primary" />
                  Cloud Telemetry Storage
                </span>
                <span className="font-mono font-bold text-primary">1.2 GB / 10 GB</span>
              </div>
              <Progress value={12} color="primary" />
              <p className="text-[10px] text-dark-muted">12% utilized • High-speed SSD</p>
            </div>

            {/* AI Computation Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-dark-text">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  AI Coach Inferences
                </span>
                <span className="font-mono font-bold text-emerald-400">8,450 / 10,000</span>
              </div>
              <Progress value={84.5} color="success" />
              <p className="text-[10px] text-dark-muted">Monthly quota resets in 14 days</p>
            </div>

            {/* Connected Sync Devices */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-dark-text">
                  <Laptop className="w-3.5 h-3.5 text-amber-400" />
                  Connected Devices
                </span>
                <span className="font-mono font-bold text-amber-400">2 / 5 Devices</span>
              </div>
              <Progress value={40} color="warning" />
              <p className="text-[10px] text-dark-muted">Chrome Extension (Active) • Web App</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL: MANAGE ACADEMIC LICENSE */}
      {/* ========================================================= */}
      <Modal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        title="🎓 Academic License Management"
        size="lg"
      >
        <div className="space-y-5">
          {/* License Status Banner */}
          <div className="p-4 rounded-xl bg-linear-to-r from-amber-500/15 via-dark-card to-dark-card border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-dark-text">Active Scholar Verification</h4>
                <p className="text-xs text-amber-400/90 font-medium">100% Sponsored Educational Grant</p>
              </div>
            </div>
            <Badge variant="warning" size="sm">
              SCHOLAR PRO
            </Badge>
          </div>

          {/* License Key Card */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block">
              Unique Academic License Key
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-dark-bg border border-dark-border">
              <span className="font-mono font-bold text-xs text-primary flex-1 select-all">
                {LICENSE_KEY}
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={copiedKey ? Check : Copy}
                onClick={handleCopyKey}
                className="text-xs shrink-0"
              >
                {copiedKey ? "Copied!" : "Copy Key"}
              </Button>
            </div>
          </div>

          {/* Institution Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-1">
              <span className="flex items-center gap-1.5 font-bold text-dark-muted">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                Affiliated Institution
              </span>
              <p className="font-bold text-dark-text">Stanford University • Computer Science</p>
            </div>

            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-1">
              <span className="flex items-center gap-1.5 font-bold text-dark-muted">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                License Validity
              </span>
              <p className="font-bold text-dark-text">Valid through Aug 31, 2027 (Auto-Renewing)</p>
            </div>
          </div>

          {/* Link Educational Email */}
          <form onSubmit={handleVerifyEdu} className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h5 className="text-xs font-bold text-dark-text">Re-Verify University Email (.edu)</h5>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={eduEmail}
                onChange={(e) => setEduEmail(e.target.value)}
                placeholder="student@university.edu"
                className="flex-1 px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-xs text-dark-text focus:outline-none focus:border-primary"
              />
              <Button type="submit" variant="primary" size="sm" className="text-xs">
                {eduVerified ? "Verified!" : "Verify Email"}
              </Button>
            </div>
            {eduVerified && (
              <p className="text-[11px] text-emerald-400 font-medium">
                ✅ Educational domain verified! Grant renewed for next academic cycle.
              </p>
            )}
          </form>

          {/* Close Button */}
          <div className="flex justify-end pt-2 border-t border-dark-border">
            <Button variant="outline" size="sm" onClick={() => setShowLicenseModal(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================= */}
      {/* 4. MODAL: BILLING DETAILS & INVOICES */}
      {/* ========================================================= */}
      <Modal
        isOpen={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        title="💳 Billing Details & Academic Invoices"
        size="lg"
      >
        <div className="space-y-5">
          {/* Payment Method Overview */}
          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-3">
            <h4 className="text-xs font-bold text-dark-muted uppercase tracking-wider">
              Active Billing Profile
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-dark-text">EduPulse Academic Research Sponsorship</h5>
                  <p className="text-[11px] text-dark-muted">100% Institutional Waiver Applied • $0.00 / year</p>
                </div>
              </div>
              <Badge variant="success" size="sm">SPONSORED</Badge>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-dark-muted uppercase tracking-wider">
              Issued Receipts & Statements
            </h4>
            <div className="space-y-2">
              {INVOICES.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border text-xs"
                >
                  <div>
                    <h5 className="font-bold text-dark-text">{inv.desc}</h5>
                    <p className="text-[11px] text-dark-muted">{inv.date} • {inv.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">{inv.amount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      loading={downloadingInv === inv.id}
                      onClick={() => handleDownloadInvoice(inv)}
                      className="text-xs py-1"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close Action */}
          <div className="flex justify-end pt-2 border-t border-dark-border">
            <Button variant="outline" size="sm" onClick={() => setShowBillingModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SubscriptionTab;
