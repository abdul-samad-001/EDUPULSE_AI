import { useState, useEffect } from "react";
import { Card, Button, Badge, LoadingSpinner, toast } from "../ui";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  Trophy,
  Sparkles,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  Check,
} from "lucide-react";
import profileService from "../../services/profileService";
import authService from "../../services/authService";
import xpService from "../../services/xpService";
import dashboardService from "../../services/dashboardService";

function ProfileAccountTab() {
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [xpData, setXPData] = useState(null);
  const [dashStats, setDashStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Personal Info Form State
  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    graduationYear: "",
  });
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Password Security Tab State
  const [securityMethod, setSecurityMethod] = useState("otp"); // "otp" | "current_password"

  // Current Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // OTP Password Reset State
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpNewPassword, setOtpNewPassword] = useState("");
  const [otpConfirmPassword, setOtpConfirmPassword] = useState("");
  const [showOtpPassword, setShowOtpPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Email Verification OTP State
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [emailOtpSubmitting, setEmailOtpSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [profRes, xpRes, statsRes] = await Promise.all([
          profileService.getProfile().catch(() => null),
          xpService.getXP().catch(() => null),
          dashboardService.getDashboardStats().catch(() => null),
        ]);

        if (isMounted) {
          if (profRes) {
            setProfile(profRes);
            setPersonalForm({
              name: profRes.name || "",
              email: profRes.email || "",
              college: profRes.college || "",
              branch: profRes.branch || "",
              graduationYear: profRes.graduationYear || "",
            });
            localStorage.setItem("user", JSON.stringify(profRes));
          }
          setXPData(xpRes);
          setDashStats(statsRes);
        }
      } catch (err) {
        console.error("ProfileTab data load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    if (!personalForm.name.trim()) {
      toast.error("Validation Error", { description: "Full Name is required." });
      return;
    }

    try {
      setSavingPersonal(true);
      const updated = await profileService.updateProfile({
        name: personalForm.name.trim(),
        email: personalForm.email.trim(),
        college: personalForm.college.trim(),
        branch: personalForm.branch.trim(),
        graduationYear: personalForm.graduationYear,
      });

      setProfile((prev) => ({ ...prev, ...updated }));
      localStorage.setItem("user", JSON.stringify({ ...profile, ...updated }));

      toast.success("Profile Updated", {
        description: "Your personal details have been saved.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Update Failed", {
        description: err?.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSavingPersonal(false);
    }
  };

  // Dispatch OTP for password reset
  const handleSendResetOTP = async () => {
    const targetEmail = personalForm.email || profile?.email;
    if (!targetEmail) {
      toast.error("Email Required", { description: "No email address found for this user." });
      return;
    }

    try {
      setOtpSending(true);
      const res = await authService.sendOTP(targetEmail, "password_reset");
      setOtpSent(true);
      setResendTimer(60);

      if (res?.debugOtp) {
        setOtpCode(res.debugOtp);
        toast.info(`🔑 OTP Code: ${res.debugOtp}`, {
          description: res.isSimulated
            ? "SMTP not yet set in .env. Code auto-filled & logged in terminal for instant testing!"
            : `Verification code dispatched to ${targetEmail}.`,
        });
      } else {
        toast.success("OTP Dispatched", {
          description: res?.message || `6-digit OTP code sent to ${targetEmail}.`,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP Dispatch Failed", {
        description: err?.response?.data?.message || "Could not send OTP to email.",
      });
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP and Reset Password
  const handleVerifyOTPAndResetPassword = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("Invalid OTP", { description: "Please enter the 6-digit verification code." });
      return;
    }
    if (!otpNewPassword || otpNewPassword.length < 6) {
      toast.error("Password Length", { description: "New password must be at least 6 characters." });
      return;
    }
    if (otpNewPassword !== otpConfirmPassword) {
      toast.error("Password Mismatch", { description: "New passwords do not match." });
      return;
    }

    const targetEmail = personalForm.email || profile?.email;

    try {
      setOtpVerifying(true);
      const res = await authService.verifyOTPAndResetPassword({
        email: targetEmail,
        otp: otpCode.trim(),
        newPassword: otpNewPassword,
      });

      toast.success("Password Reset Successful", {
        description: res?.message || "Your password has been reset with OTP verification.",
      });

      setOtpSent(false);
      setOtpCode("");
      setOtpNewPassword("");
      setOtpConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Verification Failed", {
        description: err?.response?.data?.message || "Invalid or expired OTP code.",
      });
    } finally {
      setOtpVerifying(false);
    }
  };

  // Change with current password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error("Validation Error", { description: "Please enter your current password." });
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.error("Validation Error", { description: "New password must be at least 6 characters." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Validation Error", { description: "New passwords do not match." });
      return;
    }

    try {
      setSavingPassword(true);
      await profileService.updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password Changed", {
        description: "Your account password has been updated securely.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Password Update Failed", {
        description: err?.response?.data?.message || "Incorrect current password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  // Email verification OTP flow
  const handleSendEmailVerificationOTP = async () => {
    const targetEmail = personalForm.email || profile?.email;
    try {
      setVerifyingEmail(true);
      await authService.sendOTP(targetEmail, "email_verification");
      setEmailOtpSent(true);
      toast.success("Verification Code Sent", {
        description: `6-digit verification code sent to ${targetEmail}`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP", {
        description: err?.response?.data?.message || "Could not dispatch verification code.",
      });
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOtpCode || emailOtpCode.trim().length !== 6) {
      toast.error("Invalid Code", { description: "Please enter a 6-digit verification code." });
      return;
    }

    const targetEmail = personalForm.email || profile?.email;
    try {
      setEmailOtpSubmitting(true);
      await authService.verifyEmailOTP({
        email: targetEmail,
        otp: emailOtpCode.trim(),
      });

      setProfile((prev) => ({ ...prev, isEmailVerified: true }));
      localStorage.setItem("user", JSON.stringify({ ...profile, isEmailVerified: true }));

      toast.success("Email Verified!", {
        description: "Your email address is now verified.",
      });
      setEmailOtpSent(false);
      setEmailOtpCode("");
    } catch (err) {
      console.error(err);
      toast.error("Verification Failed", {
        description: err?.response?.data?.message || "Invalid or expired code.",
      });
    } finally {
      setEmailOtpSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" label="Loading Account Profile..." />
      </div>
    );
  }

  const isEmailVerified = profile?.isEmailVerified;

  return (
    <div className="space-y-5">
      {/* 1. COMPACT USER IDENTITY CARD */}
      <Card className="p-5 sm:p-6 bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-dark-border/60 pb-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-linear-to-tr from-primary to-emerald-500 text-dark-bg flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 border-2 border-dark-card">
              {getInitials(profile?.name || personalForm.name)}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-dark-card flex items-center justify-center text-dark-bg" title="Account Active">
              <CheckCircle2 className="w-3 h-3 stroke-3" />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-dark-text tracking-tight truncate">
                {profile?.name || "EduPulse Learner"}
              </h2>
              <Badge variant="primary" size="sm">
                {profile?.role === "admin" ? "System Admin" : "Active Learner"}
              </Badge>
              {isEmailVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Check className="w-3 h-3 stroke-3" />
                  Verified Email
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendEmailVerificationOTP}
                  disabled={verifyingEmail}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/20 transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-3 h-3" />
                  {verifyingEmail ? "Sending Code..." : "Verify Email (OTP)"}
                </button>
              )}
            </div>

            <p className="text-xs text-dark-muted font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
              {profile?.email || "student@edupulse.ai"}
            </p>

            {personalForm.college && (
              <p className="text-[11px] text-dark-muted flex items-center justify-center sm:justify-start gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {personalForm.college} {personalForm.branch ? `• ${personalForm.branch}` : ""}
              </p>
            )}
          </div>

          {/* Gamification Badges */}
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto shrink-0 text-center">
            <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border min-w-18">
              <span className="text-[9px] font-bold uppercase text-amber-400 flex items-center justify-center gap-1 mb-0.5">
                <Trophy className="w-2.5 h-2.5" />
                Level
              </span>
              <p className="text-base font-black text-amber-400">{xpData?.level ?? 1}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border min-w-18">
              <span className="text-[9px] font-bold uppercase text-emerald-400 flex items-center justify-center gap-1 mb-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                XP
              </span>
              <p className="text-base font-black text-emerald-400">{xpData?.totalXP ?? 0}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border min-w-18">
              <span className="text-[9px] font-bold uppercase text-rose-400 flex items-center justify-center gap-1 mb-0.5">
                <Flame className="w-2.5 h-2.5" />
                Streak
              </span>
              <p className="text-base font-black text-rose-400">{dashStats?.streak ?? profile?.streak ?? 0}d</p>
            </div>
          </div>
        </div>

        {/* Email Verification OTP Box (if triggered) */}
        {emailOtpSent && !isEmailVerified && (
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Enter 6-Digit Email Verification Code sent to {personalForm.email || profile?.email}
              </span>
              <button
                type="button"
                onClick={() => setEmailOtpSent(false)}
                className="text-[11px] text-dark-muted hover:text-dark-text"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={emailOtpCode}
                onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-36 bg-dark-bg border border-primary/50 text-primary text-center font-mono text-base font-extrabold tracking-widest rounded-xl p-2 focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                loading={emailOtpSubmitting}
                onClick={handleVerifyEmailOTP}
              >
                Confirm Verification
              </Button>
            </div>
          </div>
        )}

        {/* 2. FORMS GRID: PERSONAL DETAILS + PASSWORD & EMAIL OTP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-5 items-start">
          {/* PERSONAL DETAILS FORM */}
          <form onSubmit={handlePersonalSubmit} className="space-y-3.5 bg-dark-bg/60 p-4 sm:p-5 rounded-2xl border border-dark-border">
            <div className="flex items-center gap-2 border-b border-dark-border pb-2.5">
              <User className="w-4 h-4 text-primary" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-dark-text">Personal Details</h3>
                <p className="text-[10px] text-dark-muted">Edit profile details, name, and academics</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={personalForm.name}
                  onChange={handlePersonalChange}
                  required
                  placeholder="Your Full Name"
                  className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={personalForm.email}
                  onChange={handlePersonalChange}
                  placeholder="your.email@example.com"
                  className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                College / University
              </label>
              <div className="relative">
                <GraduationCap className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="college"
                  value={personalForm.college}
                  onChange={handlePersonalChange}
                  placeholder="e.g. Stanford University / IIT Delhi"
                  className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                  Branch / Major
                </label>
                <div className="relative">
                  <BookOpen className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="branch"
                    value={personalForm.branch}
                    onChange={handlePersonalChange}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                  Graduation Year
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    name="graduationYear"
                    value={personalForm.graduationYear}
                    onChange={handlePersonalChange}
                    placeholder="2027"
                    min="2000"
                    max="2040"
                    className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="sm"
                icon={Save}
                loading={savingPersonal}
              >
                Save Personal Details
              </Button>
            </div>
          </form>

          {/* PASSWORD SECURITY & EMAIL OTP SECTION */}
          <div className="space-y-3.5 bg-dark-bg/60 p-4 sm:p-5 rounded-2xl border border-dark-border">
            <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-dark-text">Password & Security</h3>
                  <p className="text-[10px] text-dark-muted">Reset via Email OTP or Current Password</p>
                </div>
              </div>

              {/* Security Method Selector */}
              <div className="flex items-center gap-1 bg-dark-card p-1 rounded-xl border border-dark-border">
                <button
                  type="button"
                  onClick={() => setSecurityMethod("otp")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    securityMethod === "otp"
                      ? "bg-primary text-dark-bg shadow-xs"
                      : "text-dark-muted hover:text-dark-text"
                  }`}
                >
                  Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => setSecurityMethod("current_password")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    securityMethod === "current_password"
                      ? "bg-primary text-dark-bg shadow-xs"
                      : "text-dark-muted hover:text-dark-text"
                  }`}
                >
                  Password
                </button>
              </div>
            </div>

            {/* METHOD 1: EMAIL OTP RESET (USER REQUESTED) */}
            {securityMethod === "otp" && (
              <div className="space-y-3 pt-0.5">
                <div className="p-3 rounded-xl bg-dark-card border border-dark-border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-dark-muted">Registered Account Email:</span>
                    <span className="font-bold text-primary text-xs">{personalForm.email || profile?.email}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-dark-border/60">
                    <p className="text-[10px] text-dark-muted leading-tight">
                      Click below to receive a secure 6-digit reset code in your inbox.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={otpSending ? RefreshCw : Send}
                      loading={otpSending}
                      disabled={resendTimer > 0}
                      onClick={handleSendResetOTP}
                      className="shrink-0 text-xs py-1 px-3"
                    >
                      {resendTimer > 0 ? `Resend (${resendTimer}s)` : otpSent ? "Resend OTP" : "Send OTP"}
                    </Button>
                  </div>
                </div>

                {otpSent && (
                  <form onSubmit={handleVerifyOTPAndResetPassword} className="space-y-3 pt-1 animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Can't find the email in your primary inbox? Please check your <strong>Spam / Junk folder</strong>.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                        Enter 6-Digit Email OTP Code <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="w-full bg-dark-card border-2 border-primary/40 text-primary font-mono text-center text-lg font-black tracking-widest rounded-xl p-2 focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                        New Password <span className="text-rose-400">* (min 6 chars)</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showOtpPassword ? "text" : "password"}
                          value={otpNewPassword}
                          onChange={(e) => setOtpNewPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Enter new password"
                          className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOtpPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                        >
                          {showOtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                        Confirm New Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={otpConfirmPassword}
                          onChange={(e) => setOtpConfirmPassword(e.target.value)}
                          required
                          placeholder="Confirm new password"
                          className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="sm"
                        icon={ShieldCheck}
                        loading={otpVerifying}
                      >
                        Verify OTP & Reset Password
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* METHOD 2: CURRENT PASSWORD UPDATE */}
            {securityMethod === "current_password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-0.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                    Current Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      required
                      placeholder="Enter current password"
                      className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                    New Password <span className="text-rose-400">* (min 6 chars)</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                      minLength={6}
                      placeholder="Enter new password"
                      className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1">
                    Confirm New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                      placeholder="Confirm new password"
                      className="w-full bg-dark-card border border-dark-border text-dark-text rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    type="submit"
                    variant="warning"
                    fullWidth
                    size="sm"
                    icon={Lock}
                    loading={savingPassword}
                  >
                    Update Account Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProfileAccountTab;
