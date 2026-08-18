import { useState, useEffect } from "react";
import profileService from "../services/profileService";
import xpService from "../services/xpService";
import dashboardService from "../services/dashboardService";

import Avatar from "../components/profile/Avatar";
import ProfileForm from "../components/profile/ProfileForm";

import { SectionHeader, Card, LoadingSpinner, toast } from "../components/ui";
import { User, Trophy, Sparkles, Flame } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [xpData, setXPData] = useState(null);
  const [dashStats, setDashStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        const [profRes, xpRes, statsRes] = await Promise.all([
          profileService.getProfile().catch(() => null),
          xpService.getXP().catch(() => null),
          dashboardService.getDashboardStats().catch(() => null),
        ]);

        if (isMounted) {
          setProfile(profRes);
          setXPData(xpRes);
          setDashStats(statsRes);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileSave = async (updatedFields) => {
    try {
      const data = await profileService.updateProfile(updatedFields);
      setProfile(data);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Profile Updated", {
        description: "Your personal details have been saved.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Update Failed", {
        description: "Failed to update profile details.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading User Profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <SectionHeader
        title="User Profile 👤"
        subtitle="Manage your personal information, avatar, and account settings."
        icon={User}
      />

      {/* Main Profile Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center border-b border-dark-border pb-6">
          <Avatar name={profile?.name} size="h-24 w-24" />

          <h2 className="text-2xl font-bold text-dark-text mt-4">
            {profile?.name || "EduPulse Learner"}
          </h2>

          <p className="text-sm text-dark-muted mt-1">
            {profile?.email || "student@edupulse.ai"}
          </p>

          {/* Dynamic XP & Level Stat Badges */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-amber-400 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                Level
              </span>
              <p className="text-xl font-black text-amber-400">
                {xpData?.level ?? 1}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-emerald-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                XP
              </span>
              <p className="text-xl font-black text-emerald-400">
                {xpData?.totalXP ?? 0}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-rose-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Streak
              </span>
              <p className="text-xl font-black text-rose-400">
                {dashStats?.streak ?? 0} d
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ProfileForm initialData={profile} onSave={handleProfileSave} />
        </div>
      </Card>
    </div>
  );
}

export default Profile;